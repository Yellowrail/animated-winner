from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for local testing

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("fakespot-ai/roberta-base-ai-text-detection-v1")
model = AutoModelForSequenceClassification.from_pretrained("fakespot-ai/roberta-base-ai-text-detection-v1")

@app.route("/detect", methods=["POST"])
def detect():
    data = request.get_json()
    text = data.get("text", "")
    
    # Tokenize and run model
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1).squeeze()

    # Extract confidence
    ai_conf = probs[1].item()
    human_conf = probs[0].item()
    result = "AI-generated" if ai_conf > human_conf else "Human-written"

    return jsonify({
        "result": result,
        "confidence": {
            "ai": round(ai_conf * 100, 2),
            "human": round(human_conf * 100, 2)
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
