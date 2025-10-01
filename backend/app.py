from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback

print("Starting Flask backend for Cow Lumpy Disease Prediction...")
print(f"Current working directory: {os.getcwd()}")

# Try importing TensorFlow with error handling
try:
    import tensorflow as tf
    print(f"TensorFlow version: {tf.__version__}")
except ImportError as e:
    print(f"ERROR: Could not import TensorFlow. Please install it with 'pip install tensorflow'")
    print(f"Error details: {e}")
    sys.exit(1)

try:
    import numpy as np
    print(f"NumPy version: {np.__version__}")
except ImportError as e:
    print(f"ERROR: Could not import NumPy. Please install it with 'pip install numpy'")
    print(f"Error details: {e}")
    sys.exit(1)

# Try importing image preprocessing
try:
    from tensorflow.keras.utils import load_img, img_to_array
    print("Using tf.keras.utils for image processing")
except ImportError:
    try:
        from tensorflow.keras.preprocessing import image
        print("Using tf.keras.preprocessing.image for image processing")
    except ImportError as e:
        print(f"ERROR: Could not import image processing tools. Please ensure TensorFlow is properly installed.")
        print(f"Error details: {e}")
        sys.exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Use the model file directly from the backend directory
print("Looking for model file in the backend directory...")
model_path = os.path.join(os.path.dirname(__file__), 'lumpy_disease_cnn.h5')

if not os.path.exists(model_path):
    print(f"❌ ERROR: Model file not found at {model_path}")
    print("Please run setup.py first to copy the model file to the backend directory.")
    sys.exit(1)

print(f"✅ Found model at: {model_path}")

print(f"Loading model from: {model_path}")

# Load the trained model with error handling
try:
    model = tf.keras.models.load_model(model_path)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"ERROR: Failed to load the model from {model_path}")
    print(f"Error details: {str(e)}")
    traceback.print_exc()
    sys.exit(1)

# Function to preprocess the input image with proper error handling
def preprocess_img(img_path, target_size=(128, 128)):
    try:
        # Try using the newer API
        try:
            from tensorflow.keras.utils import load_img, img_to_array
            img = load_img(img_path, target_size=target_size)
            img_array = img_to_array(img)
        except ImportError:
            # Fall back to older API
            from tensorflow.keras.preprocessing import image
            img = image.load_img(img_path, target_size=target_size)
            img_array = image.img_to_array(img)
        
        # Continue with preprocessing
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize
        return img_array
    except Exception as e:
        print(f"ERROR in preprocess_img: {str(e)}")
        traceback.print_exc()
        raise

@app.route('/')
def index():
    """Root endpoint to check if the server is running"""
    return jsonify({
        "status": "success", 
        "message": "Cow Lumpy Disease Prediction API is running!",
        "model_path": model_path
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to receive images and make predictions"""
    print("\n--- Processing new prediction request ---")
    
    # Check if image is in the request
    if 'image' not in request.files:
        print("Error: No image file in request")
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        print("Error: Empty filename")
        return jsonify({'error': 'No image selected'}), 400
    
    print(f"Received image: {file.filename}, content type: {file.content_type}")
    
    # Save the file temporarily with error handling
    temp_path = os.path.join(os.path.dirname(__file__), 'temp_upload.jpg')
    try:
        file.save(temp_path)
        print(f"Image saved temporarily at: {temp_path}")
        
        # Check if the file was actually saved
        if not os.path.exists(temp_path) or os.path.getsize(temp_path) == 0:
            return jsonify({'error': 'Failed to save the uploaded image'}), 500
            
    except Exception as e:
        print(f"Error saving uploaded file: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Failed to save the uploaded image: {str(e)}'}), 500
    
    try:
        # Preprocess the image
        print("Preprocessing the image...")
        img_array = preprocess_img(temp_path)
        
        # Make prediction
        print("Running model prediction...")
        prediction = model.predict(img_array)
        print(f"Raw prediction: {prediction}")
        
        # Process result
        print("Processing prediction results...")
        if prediction.shape[-1] == 1:  # Binary classification (sigmoid)
            probability = float(prediction[0][0])
            result = "Infected" if probability < 0.3 else "Not Infected"
        else:  # Multi-class (softmax)
            class_names = ['Not Infected', 'Infected']  # Update if your classes differ
            probability = float(np.max(prediction))
            result = class_names[np.argmax(prediction)]
        
        print(f"Prediction result: {result}, probability: {probability}")
        
        # Clean up
        try:
            os.remove(temp_path)
            print("Temporary file cleaned up")
        except Exception as e:
            print(f"Warning: Could not remove temporary file: {str(e)}")
        
        # Return the result
        return jsonify({
            'result': result,
            'probability': probability
        })
    
    except Exception as e:
        print(f"Error during prediction process: {str(e)}")
        traceback.print_exc()
        
        # Clean up in case of error
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                print("Temporary file cleaned up after error")
            except:
                pass
                
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'details': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    try:
        print("\n=== Starting the Flask server ===")
        print(f"Server will be available at: http://localhost:5000")
        print("Press Ctrl+C to stop the server")
        # Run the server on all interfaces (0.0.0.0) to make it accessible from other devices
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"\nERROR starting the server: {str(e)}")
        traceback.print_exc()
        sys.exit(1)