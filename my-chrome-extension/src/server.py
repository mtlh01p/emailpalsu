# server.py
from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

@app.route("/check", methods=["POST"])
def check_factuality():
    try:
        data = request.json
        if not data or "text" not in data:
            return jsonify({"error": "Invalid request data"}), 400

        prompt = f"Is this statement/email address suspicious in an email? '{data['text']}' If not, respond with 'No. <reason>'. If yes, respond with format 'Yes. <reason>'. Example: No. Email address is valid and official"
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}]
        )
        reply = response["choices"][0]["message"]["content"]

        # Parse the reply to separate Answer and Reason
        if reply.startswith("Yes"):
            answer = "Yes, this is suspicious."
            reason = reply.split("Yes. ")[1] if "Yes. " in reply else "Reason not found."
        elif reply.startswith("No"):
            answer = "No, this is good enough."
            reason = reply.split("No. ")[1] if "No. " in reply else "Reason not found."
        else:
            answer = "Unknown"
            reason = "Could not determine answer."

        return jsonify({"answer": answer, "reason": reason})

    except openai.error.OpenAIError as e:
        print(f"OpenAI API error: {e}")
        return jsonify({"error": "OpenAI API error"}), 500

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)