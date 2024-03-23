// Function to open a new chat
function openNewChat() {
    // Clear existing chat messages
    document.getElementById('chat-messages').innerHTML = '';
}

// Event listener for new chat button click
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('new-chat-btn').addEventListener('click', openNewChat);
});

// Function to send a message to the chat
async function sendMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user-message');
    userMessageElement.textContent = message;
    chatMessages.appendChild(userMessageElement);
    
    // Scroll to the bottom of the chat window
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Send message to Flask backend
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    const responseData = await response.json();

    // Display response from Flask backend in the chat
    displayResponse(responseData.message);
}

// Function to display the response from the chatbot
function displayResponse(response) {
    const chatMessages = document.getElementById('chat-messages');
    const botMessageElement = document.createElement('div');
    botMessageElement.classList.add('message', 'bot-message');
    botMessageElement.textContent = response;
    chatMessages.appendChild(botMessageElement);
    
    // Scroll to the bottom of the chat window
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle user input when send button is clicked or Enter key is pressed
function handleUserInput() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Display user message in the chat
    sendMessage(userInput);

    // Clear user input field
    document.getElementById('user-input').value = '';
}

// Event listener for send button click
document.getElementById('send-btn').addEventListener('click', handleUserInput);

// Event listener for pressing Enter key in the input field
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});

// Function to save the current chat
function saveChat() {
    const chatMessages = document.getElementById('chat-messages');
    const messages = chatMessages.querySelectorAll('.message');
    const savedChats = document.getElementById('saved-chats');

    // Create a new div element to store the saved chat
    const savedChatDiv = document.createElement('div');
    savedChatDiv.classList.add('saved-chat');

    // Clone each message and append it to the saved chat div
    messages.forEach(message => {
        const clonedMessage = message.cloneNode(true);
        savedChatDiv.appendChild(clonedMessage);
    });

    // Append the saved chat div to the saved chats panel
    savedChats.appendChild(savedChatDiv);
}

// Event listener for save chat button click
document.getElementById('save-chat-btn').addEventListener('click', saveChat);

// Adjust panel heights and add separate scrollbars
function adjustPanelHeights() {
    const windowHeight = window.innerHeight;
    const panelHeight = windowHeight - document.querySelector('.navbar').offsetHeight;
    document.querySelectorAll('.full-height-panel').forEach(panel => {
        panel.style.height = panelHeight + 'px';
        panel.classList.add('overflow-auto');
    });
}

// Adjust panel heights when the window is resized
window.addEventListener('resize', adjustPanelHeights);

// Initial adjustment of panel heights
adjustPanelHeights();

// Function to check if scrolling is required and update the footer position
function updateFooterPosition() {
    const cardBody = document.getElementById('saved-chats');
    const newChatFooter = document.getElementById('new-chat-footer');

    if (cardBody.scrollHeight > cardBody.clientHeight) {
        newChatFooter.classList.remove('fixed-footer');
    } else {
        newChatFooter.classList.add('fixed-footer');
    }
}

// Event listener for window resize to update footer position
window.addEventListener('resize', updateFooterPosition);

// Initial update of footer position
updateFooterPosition();

// Function to update the position of the input group footer
function updateInputFooterPosition() {
    const chatMessages = document.getElementById('chat-messages');
    const newMessageFooter = document.getElementById('new-message-footer');

    if (chatMessages.scrollHeight > chatMessages.clientHeight) {
        newMessageFooter.classList.remove('fixed-footer');
    } else {
        newMessageFooter.classList.add('fixed-footer');
    }
}

// Event listener for window resize to update footer position
window.addEventListener('resize', updateInputFooterPosition);

// Initial update of footer position
updateInputFooterPosition();
