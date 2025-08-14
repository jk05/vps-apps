const messageForm = <HTMLFormElement>document.getElementById("messageForm");
const messageListElement = document.getElementById("messageList")!;
const messageInput = <HTMLInputElement>document.getElementById("message");
const messagesHeading = <HTMLHeadingElement>(
  document.getElementById("messages-heading")
);

type Messages = {
  messages: Message[];
};

type Message = {
  message: string;
  timestamp: string;
};

const getBasePath = (): string => {
  // Read <base href="..."> or default to "/"
  const href = document.querySelector("base")?.getAttribute("href") || "/";
  return href.endsWith("/") ? href : href + "/";
};

const apiUrl = (p: string): string => {
  const base = getBasePath(); // e.g. "/guestbook/"
  const trimmed = p.replace(/^\/+/, ""); // remove leading slash
  return base + trimmed; // e.g. "/guestbook/api/messages"
};

// Fetch and display last 5 messages
async function loadMessages() {
  const response = await fetch(apiUrl("/api/messages")); // relative path i.e. /guestbook/api/messages
  const { messages }: Messages = await response.json();

  messagesHeading.textContent = "";
  messageListElement.innerHTML = "";
  if (!messages.length) {
    return (messagesHeading.textContent = "No messages currently...");
  }
  messagesHeading.textContent = "Last 5 Messages:";
  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = `${msg.message} (at ${msg.timestamp})`;
    messageListElement.appendChild(li);
  });
}

// Submit the form
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = messageInput.value;

  // relative path i.e. /guestbook/api/messages
  await fetch(apiUrl("/api/message"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  messageForm.reset();
  loadMessages(); // Reload messages after submission
});

// Initial load of messages
loadMessages();
