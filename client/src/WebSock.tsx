import axios from "axios";
import React from "react";

type Message = {
  id: number;
  message: string;
  event: "message" | "connection";
  username : string;
};

const WebSock: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [value, setValue] = React.useState("");
  const socket = React.useRef<any>();
  const [connected, setConnected] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");

  function connect() {
    socket.current = new (WebSocket as any)("ws://localhost:5010");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("socket has closed");
    };
    socket.current.onerror = () => {
      console.log("socket error");
    };
  }

  const sendMessage = async () => {
    const message = {
      id: Date.now(),
      username,
      message: value,
      event: 'message'
    }
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="m-auto mt-10">
        <div>
          <input
            value={username}
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={connect}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-4/12 border-2 m-auto mt-10 rounded-md border-emerald-700 p-12 h-40">
        <div>
          <div className="w-full ">
            <input
              type="text"
              className="border w-full border-emerald-700	m-auto py-1 px-2"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <button
              className="float-right border border-emerald-700 mt-4 text-emerald-800 py-2 px-4"
              onClick={sendMessage}
            >
              send
            </button>
          </div>
        </div>
      </div>
      <div>
        {messages.map((mess) => (
          <div
            key={mess.id}
            className="p-2 border-2 rounded-md border-emerald-700 w-4/12 m-auto mt-1"
          >
            {mess.event === 'connection' ? `${mess.username} jointed` : `[${mess.username}]: ${mess.message}`}
          </div>
        ))}
      </div>
    </>
  );
};

export default WebSock;
