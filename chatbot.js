document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbot = document.querySelector('.chatbot');
    const closeBtn = document.querySelector('.close-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const closeWelcomeBtn = document.querySelector('.close-welcome-btn');

    // A map of keywords to their corresponding triage instructions
    const triageIssues = {
        'login': 'Please try clearing your browser\'s cache and cookies. Then, try logging in again. Does this resolve your issue?',
        'password': 'To reset your password, please go to the login page and click the "Forgot Password" link. A reset link will be sent to your registered email. Does this resolve your issue?',
        'upload': 'Please check your internet connection. Also, ensure your file is a supported type (PNG, JPEG, PDF) and is under the 1GB size limit. Does this resolve your issue?',
        'access': 'Ensure you are signed in to the correct account. If you are trying to access a shared file, check that the owner has granted you the correct permissions. Does this resolve your issue?',
        'default': 'I\'m sorry, I don\'t have a specific solution for that. It seems like you might need to speak with a human. Has this information been helpful?',
    };
    
    // An object to hold bot responses for general queries
    const generalResponses = {
        'hello': 'Hello there! How can I help you today? You can ask me about our services, privacy, or anything else about Southout IT Ltd.',
        'hi': 'Hi! How can I assist you?',
        'services': 'We offer Secure Cloud Storage, Encrypted Communication, and Data Backup and Recovery. Is there a specific service you\'d like to know more about?',
        'privacy': 'Privacy is at the core of our mission. We use end-to-end encryption to ensure only you have access to your data. Your information is never sold or shared.',
        'secure cloud storage': 'Our secure cloud storage uses robust encryption to keep your files safe from unauthorized access and cyber threats. Your data is protected every step of the way.',
        'encrypted communication': 'Our communication tools feature advanced encryption protocols to keep your conversations private and secure from prying eyes.',
        'data backup': 'We provide automated data backup solutions to protect your valuable data from loss. Our quick recovery service ensures you can restore your files with ease.',
        'contact': 'To contact us, you can fill out the email form below. Our team will get back to you as soon as possible.',
        'who are you': 'I am the Southout IT Ltd virtual assistant. I\'m here to answer common questions and guide you to the right information.',
        'founder': 'Southout IT Ltd was founded in 2024 by Adam, with James serving as the Operations Manager & Technology Consultant.',
    };

    function addMessage(text, sender, options = null) {
        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat-message', `${sender}-message`);

        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.innerHTML = text; // Use innerHTML to allow for buttons and form

        chatMessage.appendChild(messageText);
        
        // Add option buttons if provided
        if (options) {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options-container');
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.addEventListener('click', () => option.handler());
                optionsContainer.appendChild(button);
            });
            messageText.appendChild(optionsContainer);
        }

        chatBox.appendChild(chatMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // New function to add the email form to the chat box
    function addEmailForm() {
        const formHtml = `
            <div class="email-form-container">
                <form id="email-form">
                    <input type="text" id="name-input" name="name" placeholder="Your Name" required>
                    <input type="email" id="email-input" name="email" placeholder="Your Email" required>
                    <textarea id="message-input" name="message" placeholder="Please describe your issue in more detail." rows="5" required></textarea>
                    <button type="submit">Send Email to Support</button>
                </form>
            </div>
        `;
        addMessage(formHtml, 'bot');
    }

    // Function to handle the "Anything else?" follow-up
    function askForMoreHelp() {
        const options = [
            { text: 'Yes', handler: () => {
                addMessage('Okay, what can I help you with?', 'bot');
                // Remove the form if it was visible
                const formContainer = chatBox.querySelector('.email-form-container');
                if (formContainer) {
                    formContainer.remove();
                }
            }},
            { text: 'No, thanks.', handler: () => {
                addMessage('You\'re welcome! Feel free to reach out if you have any more questions.', 'bot');
            }}
        ];
        addMessage('Is there anything else I can help you with?', 'bot', options);
    }
    
    // Function to handle bot responses
    function handleBotResponse(userMessage) {
        const trimmedMessage = userMessage.toLowerCase().trim();
        let botResponse = generalResponses[trimmedMessage];

        if (botResponse) {
            setTimeout(() => {
                addMessage(botResponse, 'bot');
                // For 'contact' and 'founder', we don't need a follow-up question
                if (trimmedMessage !== 'contact' && trimmedMessage !== 'founder') {
                    askForMoreHelp();
                }
            }, 500);
        } else {
            // Triage logic for technical issues
            const foundIssue = Object.keys(triageIssues).find(key => trimmedMessage.includes(key));
            const triageResponse = foundIssue ? triageIssues[foundIssue] : triageIssues.default;

            const defaultResponse = triageResponse;

            if (foundIssue) {
                setTimeout(() => {
                    addMessage(defaultResponse, 'bot');
                    askForMoreHelp();
                }, 500);
            } else {
                setTimeout(() => {
                    const options = [
                        { text: 'Yes', handler: () => {
                            addMessage('I\'m sorry to hear that. Please fill out the form below to contact our support team.', 'bot');
                            addEmailForm();
                        }}
                    ];
                    addMessage(defaultResponse, 'bot', options);
                }, 500);
            }
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        addMessage(userMessage, 'user');
        handleBotResponse(userMessage);

        chatInput.value = '';
    });

    // Toggle chatbot visibility
    chatbotToggler.addEventListener('click', () => {
        document.body.classList.toggle('show-chatbot');
        if (document.body.classList.contains('show-chatbot')) {
            welcomeMessage.classList.remove('show');
            if (chatBox.children.length === 0) {
                addMessage('Hello! I\'m the Southout IT Ltd virtual assistant. How can I help you today?', 'bot');
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        document.body.classList.remove('show-chatbot');
    });

    // Welcome message pop-up on page load
    setTimeout(() => {
        welcomeMessage.classList.add('show');
    }, 2000);

    // Close the welcome message pop-up
    closeWelcomeBtn.addEventListener('click', () => {
        welcomeMessage.classList.remove('show');
    });
});
