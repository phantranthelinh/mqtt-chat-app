import "./App.css";
import { useState } from "react";
import { connect } from "mqtt";
import { Chat } from "./Chat";

const client = connect(process.env.REACT_APP_URL, {
  clientId: "mqttjs_" + Math.random().toString(16),
});

function App() {
  const [topic, setTopic] = useState("");
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinTopicHandler = () => {
    if (username.trim() !== "" && topic.trim() !== "") {
      setShowChat(true);
      console.log("Client connected:", client.options.clientId);
      client.subscribe(topic);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <>
          <div className="joinChatContainer">
            <h3> Join A Chat</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button onClick={joinTopicHandler}>Join A Topic</button>
          </div>
        </>
      ) : (
        <>
          <Chat client={client} username={username} topic={topic}></Chat>
        </>
      )}
    </div>
  );
}

export default App;
