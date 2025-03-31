@app.route("/check", methods=["POST"])
def check_factuality():
    data = request.json
    prompt = f"Is this statement suspicious in an email? '{data['text']}' If not, respond with 'No' and explain briefly in one sentence."
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}]
    )
    reply = response["choices"][0]["message"]["content"].split(". ")
    answer = "Yes" if "Yes" in reply[0] else "No"
    reason = reply[1] if len(reply) > 1 else "No reason provided."
    return jsonify({"answer": answer, "reason": reason})

@app.route("/save-html", methods=["POST"])
def save_html():
    data = request.json
    html_content = data.get("html", "")

    # Save HTML file to a specified location
    html_file_path = "path/to/your/file.html"  # Update the path to your file
    try:
        with open(html_file_path, "w", encoding="utf-8") as html_file:
            html_file.write(html_content)
        return "HTML file updated successfully", 200
    except Exception as e:
        print(f"Error saving HTML: {e}")
        return "Failed to save HTML file", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)