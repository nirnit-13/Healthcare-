import os
import openai
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv  # ✅ Load environment variables

# Load environment variables from .env file
env_path = r"D:\Healthcare Project\.env" 

# ✅ Debugging: Print the detected file path
print("🛠️ Looking for .env at:", env_path)

# ✅ Check if the .env file exists
if os.path.exists(env_path):
    load_dotenv(env_path)
    print("✅ .env file loaded successfully.")
else:
    print("❌ .env file NOT found!")
#load_dotenv()

print("🌍 All Environment Variables:")
for key, value in os.environ.items():
    print(f"{key}: {value}")
print("🔑 OpenAI API Key:", os.getenv("OPENAI_API_KEY"))
# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend to interact with backend
app.secret_key = "healthcare_ani_nir_1319_key"  # Set secret key for session

# ✅ Securely load OpenAI API key from environment
openai.api_key = os.getenv("OPENAI_API_KEY")



# ✅ Initialize Firebase Admin SDK
cred = credentials.Certificate("D:/Healthcare Project/healthcare-b7dbb-firebase-adminsdk-fbsvc-56cf87d0e1.json")  
firebase_admin.initialize_app(cred)
db = firestore.client()  # Firestore database instance

# ✅ User Registration Route
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        full_name = data.get('fullName')
        email = data.get('email')
        phone = data.get('phone')
        gender = data.get('gender')
        dob = data.get('dob')
        password = data.get('password')
        confirmPassword = data.get('confirmPassword')

        if password != confirmPassword:
            return jsonify({'error': 'Passwords do not match'}), 400

        user = auth.create_user(email=email, password=password)

        db.collection('users').document(user.uid).set({
            'fullName': full_name,
            'email': email,
            'phone': phone,
            'gender': gender,
            'dob': dob
        })

        return jsonify({'message': 'User registered successfully', 'uid': user.uid}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ✅ User Login Route
@app.route('/login', methods=['POST'])
def login():
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authentication token is required"}), 401

        id_token = auth_header.split("Bearer ")[-1]
        decoded_token = auth.verify_id_token(id_token)

        uid = decoded_token["uid"]
        return jsonify({"message": "Login successful", "uid": uid})

    except Exception as e:
        return jsonify({"error": str(e)}), 401

# ✅ Diagnose Symptoms Using OpenAI API
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

models = client.models.list()
for model in models:
    print(model.id)

@app.route("/diagnose", methods=["POST"])
def diagnose():
    """Handles user symptom input and generates a response using OpenAI."""
    user_input = request.json.get("symptoms", "")

    if not user_input:
        return jsonify({"error": "Please provide symptoms."}), 400

    prompt = f"""
    The user provided the following symptoms: {user_input}.
    Based on medical knowledge, suggest possible conditions, their likelihood, and basic recommendations.
    If symptoms are severe, advise consulting a doctor immediately.
    """

    try:
        # ✅ Debugging: Print to see if function is called
        print("🔄 Received request for diagnosis...")
        print("📝 Prompt:", prompt)

        # ✅ Check if OpenAI API key is set
        print("🔑 OpenAI API Key:", openai.api_key)

        # ✅ Call OpenAI API
        assistant_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant trained to provide possible diagnoses based on symptoms."},
                {"role": "user", "content": prompt}
            ]
        )

        # ✅ Print OpenAI response for debugging
        print("✅ OpenAI Response:", assistant_response)

        # ✅ Extract response correctly
        diagnosis = assistant_response.choices[0].message.content
        return jsonify({"diagnosis": diagnosis})

    except Exception as e:
        print("❌ OpenAI API Error:", str(e))  # ✅ Print error if API call fails
        return jsonify({"error": str(e)}), 500


    #try:
        # Corrected OpenAI API call
        #assistant_response = client.chat.completions.create(
            #model="gpt-4-turbo",
            #messages=[
                #{"role": "system", "content": "You are a helpful medical assistant trained to provide possible diagnoses based on symptoms."},
                #{"role": "user", "content": prompt}
          #  ]
       # )

       # diagnosis = assistant_response.choices[0].message.content  # Corrected response parsing
       # return jsonify({"diagnosis": diagnosis})

   # except openai._exceptions.OpenAIError as e:  # Updated error handling
        #return jsonify({"error": str(e)}), 500


# ✅ Run Flask App
if __name__ == "__main__":
    print("✅ Flask app is starting...")
    print(app.url_map)  # Debugging: Show all registered routes
    app.run(debug=True)
