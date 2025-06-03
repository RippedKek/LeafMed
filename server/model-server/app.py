from flask import Flask, request, jsonify
from transformers import AutoImageProcessor, AutoModelForImageClassification, ViTForImageClassification
from flask_cors import CORS
import tensorflow as tf
import torch
import numpy as np
from PIL import Image
import base64
import io
import os
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('model/model.keras')

with open('labels.txt', 'r') as f:
    labels = [line.strip() for line in f.readlines()]

yolo_model = YOLO("model/yolo11x_leaf.pt") 

processor = AutoImageProcessor.from_pretrained("model/model-v2")
model = AutoModelForImageClassification.from_pretrained("model/model-v2")

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array.astype(np.float32)

def image_to_base64(image: Image.Image) -> str:
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()

@app.route('/v1/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        image_bytes = base64.b64decode(data['image'])
    except Exception as e:
        return jsonify({'error': f'Base64 decode error: {str(e)}'}), 400

    img_tensor = preprocess_image(image_bytes)
    predictions = model.predict(img_tensor)[0]
    top_index = int(np.argmax(predictions))
    top_label = labels[top_index]
    confidence = float(predictions[top_index])

    return jsonify({
        'index': top_index,
        'label': top_label,
        'confidence': round(confidence, 4)
    })


@app.route('/v2/detect', methods=['POST'])
def predict_with_crop():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        image_bytes = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({'error': f'Image decode error: {str(e)}'}), 400

    image_path = "temp_input.jpg"
    image.save(image_path)

    results = yolo_model.predict(image_path, task="detect", conf=0.5)
    boxes = results[0].boxes
    class_ids = boxes.cls.cpu().numpy()
    xyxy = boxes.xyxy.cpu().numpy()
    class_names = [yolo_model.names[int(i)] for i in class_ids]

    for i, name in enumerate(class_names):
        if name.lower() == "leaf":
            x1, y1, x2, y2 = map(int, xyxy[i])
            cropped = image.crop((x1, y1, x2, y2))
            cropped_base64 = image_to_base64(cropped)

            return jsonify({
                "leaf_detected": True,
                "cropped_leaf": cropped_base64,
                "box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
            })

    return jsonify({
        "leaf_detected": False,
        "message": "No leaf detected in the image."
    })

@app.route('/v2/predict', methods=['POST'])
def predict_v2():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    try:
        image_bytes = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({'error': f'Image decode error: {str(e)}'}), 400

    inputs = processor(image, return_tensors="pt")

    with torch.no_grad():
        logits = model(**inputs).logits
        predicted_label = logits.argmax(-1).item()
        label = model.config.id2label[predicted_label]

    return jsonify({
        "label": label
    })
    

if __name__ == "__main__":
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    app.run(host=host, port=port, debug=True)
