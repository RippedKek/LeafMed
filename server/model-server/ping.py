import requests
import os
import base64
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

host = '127.0.0.1'
port = os.getenv('PORT', '5000')

detect_url = f"http://{host}:{port}/v2/detect"
predict_url = f"http://{host}:{port}/v2/predict"
older_url = f"http://{host}:{port}/v1/predict"

img_path = 'image/3.jpg'

with open(img_path, 'rb') as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    detect_response = requests.post(detect_url, json={'image': encoded_image})

detect_data = detect_response.json()
print("[DETECTION RESPONSE]:", detect_data)

if detect_data.get('leaf_detected') and 'cropped_leaf' in detect_data:
    cropped_base64 = detect_data['cropped_leaf']
    cropped_bytes = base64.b64decode(cropped_base64)

    image = Image.open(io.BytesIO(cropped_bytes))
    image.show()

    predict_response = requests.post(predict_url, json={'image': cropped_base64})
    predict_data = predict_response.json()

    print("[PREDICTION RESPONSE]:", predict_data)
    

else:
    print("No leaf detected or no cropped image returned.")
