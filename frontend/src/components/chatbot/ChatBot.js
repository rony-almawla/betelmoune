import React from 'react';
import ChatBot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './chatbotConfig'; // Import your chatbot configuration
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import { FaTimes } from 'react-icons/fa'; // Import close icon

const ChatBotComponent = ({ onClose }) => {
  return (
    <div className="relative bg-white p-4 border rounded shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900"
      >
        <FaTimes className="text-xl" />
      </button>
      <ChatBot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};

export default ChatBotComponent;

