import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiBaseUrl}/all-messages`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) =>
        setMessages(data.map((msg: { content: string }) => msg.content))
      )
      .catch((error) => console.error("Error fetching messages:", error));
  }, [apiBaseUrl]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch(`${apiBaseUrl}/add-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newMessage }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setNewMessage("");
      })
      .catch((error) => console.error("Error adding message:", error));
  };

  return (
    <>
      <h2>Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default App;
