# LeafMed Model Server

This is the machine learning model server for LeafMed, responsible for processing and classifying plant images. The server uses a TensorFlow model to identify medicinal plants and their properties.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

## Project Structure

```
model-server/
├── image/              # Test images directory
├── model/              # Contains the TensorFlow model
├── venv/              # Virtual environment (created during setup)
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── app.py             # Main Flask application
├── ping.py            # Server test script
├── labels.txt         # Model labels
└── requirements.txt   # Python dependencies
```

## Setup

1. Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/MacOS
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory with the following variables:

```env
HOST=0.0.0.0  # or your preferred host
PORT=5000     # or your preferred port
```

## Running the Server

1. Activate the virtual environment (if not already activated):

```bash
# Windows
.\venv\Scripts\activate

# Linux/MacOS
source venv/bin/activate
```

2. Start the server:

```bash
python app.py
```

The server will start on the host and port specified in your `.env` file (defaults to 0.0.0.0:5000 if not specified).

## Testing the Server

You can test if the server is working correctly using the ping script:

```bash
python ping.py
```

This will send a test image to the server and print the classification results.

## API Endpoints

### POST /predict

Accepts a base64 encoded image and returns the classification results.

**Request Body:**

```json
{
  "image": "base64_encoded_image_string"
}
```

**Response:**

```json
{
  "index": 0,
  "label": "plant_name",
  "confidence": 0.9876
}
```

## Error Handling

The server includes basic error handling for:

- Missing image in request
- Invalid base64 encoding
- Model prediction errors

## Development

- The server uses Flask for the REST API
- CORS is enabled for cross-origin requests
- The TensorFlow model is loaded once at startup
- Environment variables can be configured in the `.env` file

## Troubleshooting

1. If you get a "Model not found" error:

   - Ensure the model file exists in the `model/` directory
   - The model should be named `model.keras`

2. If you get a port binding error:

   - Check if the port is already in use
   - Modify the PORT in your `.env` file

3. If you get import errors:
   - Ensure you're in the virtual environment
   - Try reinstalling dependencies: `pip install -r requirements.txt`
