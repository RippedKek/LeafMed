# 🌿 LeafMed – Smart Herbal Healthcare App

**LeafMed** is a mobile application designed to make herbal healthcare accessible, intelligent, and trustworthy — especially for rural communities in Bangladesh. The app combines AI-powered disease detection, herbal remedy generation, and camera-based plant recognition to offer a reliable alternative to expensive or inaccessible clinics.

---

## 📱 Features

- **Symptom-based Disease Detection** – Users input symptoms, and the app predicts the most probable herbally-treatable illness using AI.
- **Herbal Remedy Suggestions** – Get accurate herbal recipes with ingredients, preparation steps, and dosage.
- **Plant/Leaf Recognition** – Use the camera to identify medicinal plants using TensorFlow Lite.
- **Offline Mode** – Core features work without internet connectivity for rural use.
- **Multilingual Support** – Available in both English and Bangla.
- **Recipe Saving & Reminders** – Save favorite herbal recipes and set reminders.
- **Community Feed** – View herbal hacks and shared recipes from other users.

---

## 🛠️ Tech Stack

| Layer        | Tools                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| Frontend     | React Native                                                           |
| Backend      | Firebase                                                               |
| AI Models    | Gemini/OpenAI (symptom → disease), TensorFlow Lite (plant recognition) |
| Image Picker | react-native-image-picker                                              |
| Camera       | react-native-camera / expo-camera                                      |
| Auth         | Clerk                                                                  |

---

## 🧠 AI Capabilities

- **Disease Prediction**: NLP-based classification from symptom text.
- **Herbal Recipe Generator**: Maps disease to traditional remedies.
- **Plant Classification**: TensorFlow Lite model trained on leaf images of common herbs like Neem, Tulsi, Basak, etc.

---

## 💡 How It Works

1. User inputs symptoms (e.g., “sore throat, fever”).
2. AI predicts the most likely disease.
3. App shows the corresponding herbal remedy.
4. User can scan a plant leaf to verify the ingredient.
5. Recipes can be saved, pinned, and reminders set.

---

## 📦 Installation

```bash
git clone https://github.com/RippedKek/leafmed.git
cd leafmed
cd server
npm install
cd ../client
npm install
npx expo start
```

## 📈 Business Model

LeafMed uses a **freemium model**:

- **Free**: Basic features with ads
- **Premium ($1/month)**: Ad-free, unlimited plant scans

Additional monetization:

- Seasonal herbal packs (e.g. Monsoon Immunity Kit)
- NGO partnerships and donations

## 🧪 Dataset & Training

- Plant classification model trained on leaf image dataset using TensorFlow Lite Model Maker
- Disease–symptom–herb mapping curated from verified herbal medicine sources

## 🙌 Acknowledgments

- Inspired by traditional Bangladeshi herbal medicine
- Built for the BdApps Innovation Summit 2025
- Contributors: Masnun Nuha Chowdhury, Tanjeeb Meheran Rohan

> “When hospitals are far and herbs are near, LeafMed is the bridge.”
