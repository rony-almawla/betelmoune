import React, { useState } from 'react';

const PaymentPopup = ({ method, onSubmit, onClose }) => {
  const [transactionId, setTransactionId] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = () => {
    if (method === 'OMT' && transactionId.trim()) {
      onSubmit({ omtTransactionId: transactionId });
    } else if (method === 'Wish Money' && reference.trim()) {
      onSubmit({ wishMoneyReference: reference });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter Payment Details for {method}
        </h2>

        {method === 'OMT' && (
          <div className="mb-4">
            <label
              htmlFor="transactionId"
              className="block text-sm font-medium text-gray-700"
            >
              OMT Transaction ID
            </label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}

        {method === 'Wish Money' && (
          <div className="mb-4">
            <label
              htmlFor="reference"
              className="block text-sm font-medium text-gray-700"
            >
              Wish Money Reference
            </label>
            <input
              type="text"
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Submit Payment
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;

