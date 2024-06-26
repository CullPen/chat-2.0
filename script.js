
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const usernameInput = document.getElementById('usernameInput');

    const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messagesContainer.innerHTML = messages.map((msg, index) => `
            <div class="p-2 mb-2 bg-gray-200 rounded flex justify-between items-center">
                <div>
                    <strong>${msg.username}:</strong> ${msg.text} <small class="text-gray-500">(${msg.timestamp})</small>
                </div>
                <div>
                    <button class="edit-button text-blue-500 mr-2" data-index="${index}">Edit</button>
                    <button class="delete-button text-red-500" data-index="${index}">Delete</button>
                </div>
            </div>
        `).join('');
    };

    const saveMessage = (message) => {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
    };

    const deleteMessage = (index) => {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.splice(index, 1);
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
    };

    const editMessage = (index, newText) => {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages[index].text = newText;
        messages[index].timestamp = new Date().toLocaleTimeString();
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
    };

    const clearMessages = () => {
        localStorage.removeItem('messages');
        loadMessages();
    };

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        const username = usernameInput.value.trim() || 'Anonymous';
        if (messageText) {
            const message = {
                text: messageText,
                username: username,
                timestamp: new Date().toLocaleTimeString()
            };
            saveMessage(message);
            loadMessages();
            messageInput.value = '';
        }
    });

    clearButton.addEventListener('click', () => {
        clearMessages();
    });

    messagesContainer.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        if (event.target.classList.contains('delete-button')) {
            deleteMessage(index);
        }
        if (event.target.classList.contains('edit-button')) {
            const newText = prompt('Edit your message:');
            if (newText) {
                editMessage(index, newText);
            }
        }
    });

    loadMessages();
});
