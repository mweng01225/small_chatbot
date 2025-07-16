import React from "react";
import ChatBox from "./ChatBox";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", color:"white" }}>Amazing Chatbot</h1>
      <ChatBox />
    </div>
  );
}

export default App;
