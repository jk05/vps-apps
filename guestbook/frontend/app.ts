const messageForm = <HTMLFormElement>document.getElementById('messageForm');
const messageListElement = document.getElementById('messageList')!;
const messageInput = <HTMLInputElement>document.getElementById('message')

type Messages = {
  messages: Message[]
}

type Message = {
  message: string
  timestamp: string
}

// Fetch and display last 5 messages
async function loadMessages() {
  const response = await fetch('/api/messages');
  const {messages}: Messages = await response.json();
  console.log('messages12345678', messages)

  messageListElement.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = `${msg.message} (at ${msg.timestamp})`;
    messageListElement.appendChild(li);
  });
}

// Submit the form
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value;

  await fetch('/api/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  messageForm.reset();
  loadMessages();  // Reload messages after submission
});

// Initial load of messages
loadMessages();