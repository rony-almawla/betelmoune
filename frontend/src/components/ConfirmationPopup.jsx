import React from 'react';

const ConfirmationPopup = ({ message, onConfirm, onCancel, confirmLabel, cancelLabel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <p className="text-xl font-semibold mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            {confirmLabel || 'Confirm'}
          </button>
          <button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            {cancelLabel || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
