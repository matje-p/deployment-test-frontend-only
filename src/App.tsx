import React, { useState, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import "./App.css";

const Messages = () => {
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
};

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <>
          <button onClick={() => logout()}>Log Out</button>
          <Messages />
        </>
      )}
    </div>
  );
};

const Auth0ProviderWithHistory = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

const RootApp = () => (
  <Auth0ProviderWithHistory>
    <App />
  </Auth0ProviderWithHistory>
);

export default RootApp;
