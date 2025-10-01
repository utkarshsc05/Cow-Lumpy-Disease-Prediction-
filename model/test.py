import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Get absolute paths for model and image
model_path = os.path.join(os.path.dirname(__file__), 'lumpy_disease_cnn.h5')
img_path = os.path.join(os.path.dirname(__file__), "Cow_Lumpy_Prediction", 'normal.png')

print("Model path:", model_path)
print("Image path:", img_path)

# Load your trained model
model = tf.keras.models.load_model(model_path)

# Function to preprocess the input image
def preprocess_img(img_path, target_size=(128, 128)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize if your model expects it
    return img_array

img_array = preprocess_img(img_path)

# Make prediction
prediction = model.predict(img_array)
print("Prediction:", prediction)

# Show result: infected or not
if prediction.shape[-1] == 1:  # Binary classification (sigmoid)
    result = "Infected" if prediction[0][0] > 0.3 else "Not Infected"
else:  # Multi-class (softmax)
    class_names = ['Not Infected', 'Infected']  # Update if your classes differ
    result = class_names[np.argmax(prediction)]
print("Result:", result)