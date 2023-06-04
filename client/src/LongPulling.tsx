import axios from "axios";
import React from "react";

type Message = {
  id: number;
  message: string;
};

const LongPulling: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    try {
      const { data } = await axios.get("http://localhost:5010/get-messages");
      setMessages((prev) => [data, ...prev]);
      await subscribe();
    } catch (e) {
      setTimeout(() => subscribe(), 500);
    }
  };

  const sendMessage = async () => {
    await axios.post("http://localhost:5010/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

  return (
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
        <div>
          {messages.map((mess) => (
            <div key={mess.id}>{mess.message}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongPulling;
