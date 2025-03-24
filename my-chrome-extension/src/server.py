from flask import Flask, request, jsonify
import openai

openai.api_key = "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"

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_hoax():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Is this a hoax? '{text}'. Respond with 'Yes, it's a hoax' or 'No, it's not a hoax' and provide a confidence score.",
        max_tokens=50
    )
    
    result = response.choices[0].text.strip()
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(port=5000)