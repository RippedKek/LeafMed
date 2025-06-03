# 🌿 LeafMed – Smart Herbal Healthcare App

**LeafMed** is a mobile application designed to make herbal healthcare accessible, intelligent, and trustworthy — especially for rural communities in Bangladesh. The app combines AI-powered disease detection, herbal remedy generation, and camera-based plant recognition to offer a reliable alternative to expensive or inaccessible clinics.

---

## 🏗️ Project Architecture

### Client (`/client`)

- React Native mobile application
- Features a modern, intuitive UI for symptom input and plant recognition
- Integrates with both backend services for data management and AI features

### Server Components

#### 1. Backend Server (`/server/backend`)

- Main application server handling:
  - User authentication (Clerk)
  - Data persistence (Firebase)
  - Business logic
  - API endpoints

#### 2. Model Server (`/server/model-server`)

- Dedicated Flask server for AI/ML operations
- Components:
  - `app.py`: Main Flask application with REST endpoints
  - `model/`: Contains trained AI models
    - YOLO model for leaf detection
    - ViT model for plant classification
    - TensorFlow model for disease prediction
  - `labels.txt`: Classification labels for plant species
  - Environment configuration via `.env`

---

## 📱 Features

- **Symptom-based Disease Detection** – Users input symptoms, and the app predicts the most probable herbally-treatable illness using AI.
- **Herbal Remedy Suggestions** – Get accurate herbal recipes with ingredients, preparation steps, and dosage.
- **Plant/Leaf Recognition** – Use the camera to identify medicinal plants using:
  - YOLO for leaf detection
  - Vision Transformer (ViT) for species classification
- **Offline Mode** – Core features work without internet connectivity for rural use.
- **Multilingual Support** – Available in both English and Bangla.
- **Recipe Saving & Reminders** – Save favorite herbal recipes and set reminders.
- **Community Feed** – View herbal hacks and shared recipes from other users.

---

## 🛠️ Tech Stack

### Frontend

- React Native
- React Native Image Picker
- Expo Camera

### Backend Services

- Firebase (Data Storage)
- Clerk (Authentication)

### AI/ML Server

- Flask
- TensorFlow
- PyTorch
- Transformers
- YOLO (Ultralytics)
- Python Image Processing (Pillow)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RippedKek/leafmed.git
cd leafmed
```

### 2. Setup Model Server

```bash
cd server/model-server
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Setup Backend Server

```bash
cd ../backend
npm install
npm run dev
```

### 4. Setup Mobile App

```bash
cd ../../client
npm install
npx expo start
```

### Environment Variables

Create `.env` files in respective directories:

Model Server `.env`:

```
HOST=0.0.0.0
PORT=5000
```

---

## 🧠 AI Model Endpoints

### Model Server API (`localhost:5000`)

1. `/v1/predict` - Legacy plant classification endpoint

   - Input: Base64 encoded image
   - Output: Plant classification with confidence score

2. `/v2/detect` - Advanced leaf detection and cropping

   - Input: Base64 encoded image
   - Output: Cropped leaf image and bounding box

3. `/v2/predict` - Modern plant classification using ViT
   - Input: Base64 encoded image
   - Output: Plant species classification

**Refer to the README of model-server for better understanding.**

---

## 📈 Business Model

LeafMed uses a **freemium model**:

- **Free**: Basic features with ads
- **Premium ($1/month)**: Ad-free, unlimited plant scans

Additional monetization:

- Seasonal herbal packs (e.g. Monsoon Immunity Kit)
- NGO partnerships and donations

## 🧪 Dataset & Training

- Plant classification models trained on custom leaf image dataset
- YOLO model fine-tuned for leaf detection
- Vision Transformer (ViT) adapted for species classification
- Disease–symptom–herb mapping curated from verified sources

## 🙌 Acknowledgments

- Inspired by traditional Bangladeshi herbal medicine
- Built for the BdApps Innovation Summit 2025
- Contributors: Masnun Nuha Chowdhury, Tanjeeb Meheran Rohan

> "When hospitals are far and herbs are near, LeafMed is the bridge."
