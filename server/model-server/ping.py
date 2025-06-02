import requests
import os
import base64
from dotenv import load_dotenv

load_dotenv()

host = '127.0.0.1'
port = os.getenv('PORT', '5000')
server_url = f"http://{host}:{port}/predict"

# ping server to test if it is working
img_path = 'image/4.jpg'
with open(img_path, 'rb') as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    response = requests.post(server_url, json={'image': encoded_image})

print(response.json())
