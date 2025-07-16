from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import sys
import re

app = Flask(__name__)
CORS(app, origins = ["..."])

with open("prompt3.txt", 'r') as file:
    SYSTEM_PROMPT = file.read()

OLLAMA_API_URL = "..."
MODEL_NAME = "llama3"

# temporary, move into a db or something
chat_history = []

def build_full_prompt(user_input):
    prompt_lines = [f"System: {SYSTEM_PROMPT}"]
    
    # Add chat history
    for pair in chat_history[-5:]:  # only keep last 5 exchanges
        prompt_lines.append(f"User: {pair['user']}")
        prompt_lines.append(f"Bot: {pair['bot']}")

    # Add the new user message
    prompt_lines.append(f"User: {user_input}")
    prompt_lines.append("Bot:")  # prompt the LLM to continue here

    return "\n".join(prompt_lines)

def chat_with_ollama(prompt):
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(OLLAMA_API_URL, json=payload)
    if response.status_code == 200:
        return response.json()['response']
    else:
        return f"Error: {response.status_code}\n{response.text}"

def remove_emojis(text):
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags
        "\U00002700-\U000027BF"  # dingbats
        "\U000024C2-\U0001F251"  # enclosed characters
        "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', text)


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", '')
    full_prompt = build_full_prompt(user_input)
    bot_reply = chat_with_ollama(full_prompt)
    bot_reply = remove_emojis(bot_reply)

    # Store in memory
    chat_history.append({"user": user_input, "bot": bot_reply})

    return jsonify({'response':bot_reply})


if __name__ == "__main__":
    app.run(port=5000)