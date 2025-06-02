from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

model = tf.keras.models.load_model('model/model.keras')

with open('labels.txt', 'r') as f:
    labels = [line.strip() for line in f.readlines()]

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array.astype(np.float32)

@app.route('/predict', methods=['POST'])
def predict():
    print("Request received")
    data = request.get_json()

    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    base64_str = data['image']
    print("Data keys:", data.keys())
    print("Image length:", len(base64_str))

    try:
        image_bytes = base64.b64decode(base64_str)
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

if __name__ == "__main__":
    CORS(app)
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    app.run(host=host, port=port, debug=True)
