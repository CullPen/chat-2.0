document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const usernameInput = document.getElementById('usernameInput');
    const boldButton = document.getElementById('boldButton');
    const italicButton = document.getElementById('italicButton');

    const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messagesContainer.innerHTML = messages.map((msg, index) => `
            <div class="p-2 mb-2 bg-gray-200 rounded flex justify-between items-center">
                <div>
                    <strong>${msg.username}:</strong> <span class="message-content">${msg.text}</span> <small class="text-gray-500">(${msg.timestamp})</small>
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

    let currentFormatting = {
        bold: false,
        italic: false
    };

    const applyFormatting = (text) => {
        if (currentFormatting.bold) text = `<b>${text}</b>`;
        if (currentFormatting.italic) text = `<i>${text}</i>`;
        return text;
    };

    sendButton.addEventListener('click', () => {
        const messageText = applyFormatting(messageInput.value.trim());
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

    boldButton.addEventListener('click', () => {
        currentFormatting.bold = !currentFormatting.bold;
        boldButton.classList.toggle('bg-gray-500');
        boldButton.classList.toggle('text-white');
    });

    italicButton.addEventListener('click', () => {
        currentFormatting.italic = !currentFormatting.italic;
        italicButton.classList.toggle('bg-gray-500');
        italicButton.classList.toggle('text-white');
    });

    messagesContainer.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        if (event.target.classList.contains('delete-button')) {
            deleteMessage(index);
        }
        if (event.target.classList.contains('edit-button')) {
            const newText = prompt('Edit your message:');
            if (newText) {
                editMessage(index, applyFormatting(newText));
            }
        }
    });

    setInterval(loadMessages, 3000); // Poll every 3 seconds for new messages
    loadMessages();
});
