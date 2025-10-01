# Backend for Cow Lumpy Disease Prediction

This is a Flask backend that serves the machine learning model for predicting Lumpy Skin Disease in cows.

## Setup

1. Install the required dependencies:
   ```
   pip install flask flask-cors tensorflow numpy pillow
   ```

2. Run the server:
   ```
   python app.py
   ```

The server will start on http://localhost:5000

## API Endpoints

### GET /
Returns a simple message to confirm that the API is running.

### POST /predict
Accepts an image file and returns a prediction.

#### Request
- Method: POST
- Content-Type: multipart/form-data
- Body: 
  - image: The image file to analyze

#### Response
```json
{
  "result": "Infected" or "Not Infected",
  "probability": 0.95 (float between 0 and 1)
}
```

## Troubleshooting

If you encounter issues with loading the model, make sure:
1. The model file (lumpy_disease_cnn.h5) is located in the correct path
2. TensorFlow and its dependencies are properly installed