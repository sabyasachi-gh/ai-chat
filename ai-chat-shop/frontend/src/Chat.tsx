import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage: Message = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to server." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🛒 AI Shopping Assistant</div>
      <div style={styles.messages}>
        {messages.length === 0 && (
          <p style={styles.placeholder}>
            Ask me anything! e.g. "Show me red sneakers under ₹2000"
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#0084ff" : "#e5e5ea",
              color: msg.role === "user" ? "#fff" : "#000",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.bubble, background: "#e5e5ea" }}>
            Typing...
          </div>
        )}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex", flexDirection: "column",
    width: "400px", height: "600px",
    border: "1px solid #ddd", borderRadius: "12px",
    overflow: "hidden", fontFamily: "sans-serif",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    margin: "40px auto",
  },
  header: {
    background: "#0084ff", color: "#fff",
    padding: "16px", fontSize: "16px", fontWeight: "bold",
  },
  messages: {
    flex: 1, padding: "16px",
    display: "flex", flexDirection: "column", gap: "8px",
    overflowY: "auto", background: "#f9f9f9",
  },
  placeholder: { color: "#aaa", textAlign: "center", marginTop: "40px" },
  bubble: {
    padding: "10px 14px", borderRadius: "18px",
    maxWidth: "75%", fontSize: "14px", lineHeight: "1.4",
  },
  inputRow: {
    display: "flex", padding: "12px",
    borderTop: "1px solid #eee", background: "#fff",
  },
  input: {
    flex: 1, padding: "10px", borderRadius: "20px",
    border: "1px solid #ddd", outline: "none", fontSize: "14px",
  },
  button: {
    marginLeft: "8px", padding: "10px 18px",
    background: "#0084ff", color: "#fff",
    border: "none", borderRadius: "20px",
    cursor: "pointer", fontSize: "14px",
  },
};