import React from 'react';

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h3 className="text-2xl font-bold mb-4">{message.title}</h3>
        <p className="text-gray-700 mb-6">{message.body}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700"
        >
          {message.buttonText}
        </button>
      </div>
    </div>
  );
};

export default PopupMessage;
