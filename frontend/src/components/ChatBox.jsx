import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function ChatBox({ myId, otherId }) {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch chat history
    axios.get(`/api/chat/history/${otherId}`)
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [otherId]);

  useEffect(() => {
    // WebSocket connection
    const socket = new window.WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat' &&
            ((data.senderId === myId && data.receiverId === otherId) ||
             (data.senderId === otherId && data.receiverId === myId))) {
          setMessages(prev => [...prev, {
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            timestamp: data.timestamp,
          }]);
        }
      } catch (e) {}
    };

    return () => socket.close();
  }, [myId, otherId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(JSON.stringify({
        type: 'chat',
        senderId: myId,
        receiverId: otherId,
        message: input,
      }));
      setInput('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white max-w-md mx-auto">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.senderId === myId ? 'text-right' : 'text-left'}>
            <span className={msg.senderId === myId ? 'bg-blue-200' : 'bg-green-200'}
                  style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '8px', margin: '2px' }}>
              {msg.message}
            </span>
            <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="ml-2 bg-blue-600 text-white px-4 py-1 rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
