import axios from "axios";
import React from "react";

type Message = {
  id: number;
  message: string;
};

const EventSourcing: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource(`http://localhost:5010/connect`);
    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
  };

  const sendMessage = async () => {
    await axios.post("http://localhost:5010/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

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
            {mess.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default EventSourcing;
