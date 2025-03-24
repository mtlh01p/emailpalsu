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