import React, { useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function sendMessage(message) {
        const response = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        return data.response;
    }

    async function handleSubmit(e){
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const reply = await sendMessage(input);
            const botMessage = {sender: "bot", text: reply};
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [...prev, {sender: "bot", text: "Error talking to model. Try again later."},]);
        }

    setLoading(false)
    }

  return (
    <>
      <div style={styles.wrapper}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#434550" : "#1F2229",
              color: msg.sender === "user" ? "white" : "white",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div style={styles.thinking}>🤖 Typing...</div>}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.userInputBox}
          placeholder="Type your message..."
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </>
  );
}

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        height: "80vh",        // full viewport height
        padding: "1rem",
        backgroundColor: "#1F2229", // same background as your chat
    },
    chatBox: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "60vh",
        overflowY: "auto",
        padding: 10,
        border: "1px solid #1F2229",
        borderRadius: 8,
        background: "#1F2229",
        marginBottom: 10,
  },
    message: {
        padding: 10,
        borderRadius: 16,
        maxWidth: "80%",
        whiteSpace: "pre-wrap",
    },
    form: {
        display: "flex",
        gap: 10,
    },
    userInputBox: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        border: "0px",
        backgroundColor: "#434550",
        color: "white",
        outline: "none",
    },
    button: {
        padding: "10px 20px",
        borderRadius: 8,
        border: "none",
        background: "#007bff",
        color: "white",
        cursor: "pointer",
    },
    thinking: {
        fontStyle: "italic",
        color: "#888",
        alignSelf: "flex-start",
    },
};