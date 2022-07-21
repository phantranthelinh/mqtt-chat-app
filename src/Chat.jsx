import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export const Chat = (props) => {
  const { client, username, topic } = props;
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([{}]);

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const messageData = {
        message,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await client.publish(topic, new Buffer.from(JSON.stringify(messageData)));
      setMessage("");
    }
  };

  useEffect(() => {
    client.on("message", (topic, payload) => {
      setMessageList((list) => [...list, JSON.parse(payload.toString())]);
    });
  }, [client]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>
          TOPIC: {topic} - User: {username}
        </p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.slice(1).map((messageContent, i) => {
            return (
              <div
                key={i}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <dir>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p>{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </dir>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(e.target.value)}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};
