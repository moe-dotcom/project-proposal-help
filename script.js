import OpenAI from 'openai'

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const spinner = document.getElementById('spinner');
    const sendIcon = document.getElementById('send-icon');

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const time = new Date();
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            ${content}
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    // Function to show loading state on send button
    function showLoading() {
        spinner.style.display = 'block';
        sendIcon.style.display = 'none';
        sendButton.disabled = true;
    }

    // Function to hide loading state on send button
    function hideLoading() {
        spinner.style.display = 'none';
        sendIcon.style.display = 'block';
        sendButton.disabled = false;
    }

    async function sendMessageToAI(messages) {
        showTypingIndicator();
        showLoading();
        const messages = [
            {
                role: 'system',
                content: 'You are a professional project proposal assistant. Help users create compelling project proposals by generating content, suggesting how to structure a proposal, and refining their ideas. Be concise yet thorough, and always ask clarifying questions if needed to provide the best proposal content.'
            },
            {
                role: 'user',
                content: userInput
            }
        ]
        try {
            const openai = new OpenAI ({
                apiKey: '', // Add api key here
                dangerouslyAllowBrowser: true
            })       
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: messages,
                temperature: 0.5
                })
            

             if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Simulate typing delay for better UX
            setTimeout(() => {
                hideTypingIndicator();
                addMessage(aiResponse, false);
                hideLoading();
            }, 1000);
            
        } catch (error) {
            console.error('Error calling AI API:', error);
            hideTypingIndicator();
            addMessage("I'm sorry, I encountered an error while processing your request. Please refresh this page or try again later.", false);
            hideLoading();
        }
    }

    // Event listener for send button click and Enter key
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessageToAI(message);
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                sendMessageToAI(message);
            }
        }
    });

    // Focus the input field on page load
    userInput.focus();
});