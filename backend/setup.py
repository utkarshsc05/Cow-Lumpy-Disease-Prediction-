import os
import shutil
import sys

print("Setup script for Cow Lumpy Disease Prediction backend")

# Possible locations of the model file
possible_model_paths = [
    os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'lumpy_disease_cnn.h5'),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), 'lumpy_disease_cnn.h5'),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'lumpy_disease_cnn.h5'),
    os.path.join('D:\\TECH_CODE\\PROJECTS\\Lumpy_Disease_prediction', 'lumpy_disease_cnn.h5')
]

# Find the model file
source_path = None
for path in possible_model_paths:
    print(f"Checking for model at: {path}")
    if os.path.exists(path):
        source_path = path
        print(f"✅ Found model at: {path}")
        break

if not source_path:
    print("❌ ERROR: Could not find the model file.")
    print(f"Searched in: {', '.join(possible_model_paths)}")
    sys.exit(1)

# Destination path in backend folder
dest_path = os.path.join(os.path.dirname(__file__), 'lumpy_disease_cnn.h5')

# Copy the model file to the backend directory
try:
    shutil.copy2(source_path, dest_path)
    print(f"✅ Model file copied to: {dest_path}")
except Exception as e:
    print(f"❌ ERROR copying model file: {str(e)}")
    sys.exit(1)

print("\nSetup completed successfully. You can now run 'python app.py' to start the server.")