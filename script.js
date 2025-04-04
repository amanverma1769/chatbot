const API_KEY = 'AIzaSyCUDPifdtDZgftNExQkkWHkweHL5YMM9t0'; 
// Replace with your actual Gemini API key

const API_URL = `https://gemini.ai/api/v1/generate`;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {
    try {
        // const response = await fetch("http://localhost:5000/chat", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ message: prompt })
        // });

        // const data = await response.json();
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'contents': [
                {
                  'parts': [
                    {
                      'text': `${prompt}`
                    }
                  ]
                }
              ]
            })
          });
        const data = await response.json();

        if (!data || !data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            throw new Error("Invalid response from Gemini API.");
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        showErrorMessage("Invalid response received. Please check your input or try again later.");
        return null;
    }
}

function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '')
               .replace(/\*\*/g, '')
               .replace(/\n{3,}/g, '\n\n')
               .trim();
}

// function addMessage(message, isUser) {
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

//     const profileImage = document.createElement('img');
//     profileImage.classList.add('profile-image');
//     profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
//     profileImage.alt = isUser ? 'User' : 'Bot';

//     const messageContent = document.createElement('div');
//     messageContent.classList.add('message-content');
//     messageContent.textContent = message;

//     messageElement.appendChild(profileImage);
//     messageElement.appendChild(messageContent);
//     chatMessages.appendChild(messageElement);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }
function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
    profileImage.alt = isUser ? 'User' : 'Bot';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// 🚀 New Function: Display an error message
function showErrorMessage(errorText) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message'); // Apply a CSS class for styling
    errorElement.textContent = errorText;
    
    chatMessages.appendChild(errorElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => errorElement.remove(), 5000); // Auto-remove error after 5 seconds
}

async function handleUserInput() {
    console.log('test');
    const userMessage = userInput.value.trim();

    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';

        sendButton.disabled = true;
        userInput.disabled = true;

        try {
            const botMessage = await generateResponse(userMessage);
            if (!botMessage) return; // If error occurred, don't proceed further

            addMessage(cleanMarkdown(botMessage), false);
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage("Something went wrong. Please try again.");
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});
