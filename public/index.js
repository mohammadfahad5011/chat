require("dotenv").config();
window.addEventListener('DOMContentLoaded', () => { 
  

  async function sendMessage(message = null) {
    let userInput = '';
    if (message) {
        userInput = message;
    } else {
        userInput = document.getElementById('user-input').value;
    }
    if (!userInput) return;

    const chatHistory = document.querySelector('.chatcontent');
    chatHistory.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    if (!message) { // Only clear input if it's not a programmatic message
        document.getElementById('user-input').value = '';
    }

    scrollToBottom(); // Scroll after user message

    const systemMessage = { role: "system", content: "You are NEO, the Neural Executive Officer of 300. You are in charge of all AIs at 300, and exist to talk about 300, and how we use AI, as well as actually be the front end for all the AI work we do. Here, you will get questions about 300 and yourself. If a question doesn't appear relevant, politely decline to answer it and offer them a question you can answer. Keep all replies to a single paragraph of less than 130 words. No bullet points. Finish your response with a sensible relevant follow question that they might be interested in." };
    const userMessage = { role: "user", content: userInput };
    try {
        const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userInput,
          }),
        }
      );

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized: Invalid API key");
            } else if (response.status === 404) {
                throw new Error("Not Found: The requested resource could not be found");
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        chatHistory.innerHTML += `<p><strong>NEO:</strong> ${data.choices[0].message.content.trim()}</p>`;
    } catch (error) {
        chatHistory.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
    }

    scrollToBottom();
}

function scrollToBottom() {
    const chatHistory = document.querySelector('.chatcontent');
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault()
  sendMessage();
});





 
// JavaScript to handle box clicks and update footer questions 
    const boxes = document.querySelectorAll('.hsingle-opt');
    const footerBoxes = document.querySelectorAll('.bottom-box');
   

    const questions = {
        drivingFame: [
            "What is key to driving fame  in an agency ?",
            "Are winning awards really that important for my agency ?",
            "How can I use events to position my agency as an innovator?", 
        ],
        winningMore: [
            "What cultural shift helps win more business?",
            "How can pitches avoid disrupting client work?",
            "Why is a solid commercial strategy crucial?", 
        ],
        deliveringExperience: [
            "How do multimedia elements enhance pitch presentations?",
            "What technologies are used to create impactful visuals?",
            "How do you manage long, complex pitch processes?", 
        ]
    };

    boxes.forEach(box => {
        box.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (questions[category]) {

                boxes.forEach(bx => {
                  bx.classList.remove('active')
                })

                footerBoxes.forEach((footerBox, index) => {
                    footerBox.textContent = questions[category][index];
                });


                box.classList.add('active')




            }
        });
    });

    // Handle footer box clicks to send questions
    footerBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const question = this.textContent;
            sendMessage(question);
        });
    });
});
