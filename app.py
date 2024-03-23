from flask import Flask, request, jsonify, render_template
import requests
import os
app = Flask(__name__)

# Access the OpenAI API key from environment variables
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
CHATGPT_MODEL = 'gpt-3.5-turbo-instruct'  # Choose the appropriate GPT model
MAX_TOKENS = 150  # Adjust as per your requirement

saved_chats = []

@app.route('/')
def index():
    return render_template('index.html', saved_chats=saved_chats)


@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.json.get('message')
        if not user_input:
            return jsonify({'message': 'No message provided'}), 400

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {OPENAI_API_KEY}'
        }
        data = {
            'model': CHATGPT_MODEL,
            'prompt': user_input,
            'max_tokens': MAX_TOKENS
        }
        response = requests.post('https://api.openai.com/v1/completions', headers=headers, json=data)
        response_data = response.json()
        bot_response = response_data['choices'][0]['text'].strip()

        # Save the chat message
        saved_chats.append({'user_input': user_input, 'bot_response': bot_response})

        return jsonify({'message': bot_response}), 200

    except Exception as e:
        print('Error processing user message:', e)
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
