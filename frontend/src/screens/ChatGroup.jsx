import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyGroups,
  addMessage,
  selectGroup,
  removeMessage,
} from '../store/chatsSlice';
import io from 'socket.io-client';
import { IoIosHeart } from 'react-icons/io';
import { HiMiniRectangleGroup } from 'react-icons/hi2';
import { FaUserGroup } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

const ChatGroup = () => {
  const user = useSelector((state) => state.authSlice.user);
  const groups = useSelector((state) => state.chatsSlice.groups);
  const groupSelected = useSelector((state) => state.chatsSlice.groupSelected);
  const messages = useSelector((state) => state.chatsSlice.messages);

  const dispatch = useDispatch();
  const socketRef = useRef(null);

  const [inputValue, setInputValue] = useState('');
  const input = useRef(null);

  // Initialize Socket.IO and handle incoming messages
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000');
    }

    // Join the selected group room
    if (groupSelected._id) {
      socketRef.current.emit('joinRoom', groupSelected._id);

      // Handle incoming messages
      socketRef.current.on('receiveMessage', (message) => {
        dispatch(addMessage(message));
      });

      socketRef.current.on('messageDeleted', (messageId) => {
        dispatch(removeMessage({ messageId }));
      });
    }

    // Clean up when the component unmounts or group changes
    return () => {
      if (groupSelected._id) {
        socketRef.current.emit('leaveRoom', groupSelected._id);
      }
      socketRef.current.off('receiveMessage');
    };
  }, [groupSelected._id, dispatch]);

  // Get Groups of User
  useEffect(() => {
    dispatch(getMyGroups(user._id));
    console.log(messages);
  }, [dispatch, user._id, messages]);

  // Send Message
  const sendHandler = () => {
    const timeStamp = `${new Date().getHours()}:${
      new Date().getMinutes() < 10
        ? '0' + new Date().getMinutes()
        : new Date().getMinutes()
    }`;

    const sendData = {
      groupId: groupSelected._id,
      message: inputValue,
      senderId: user._id,
      senderName: `${user.firstName} ${user.lastName}`,
      profileImg: user.profileImage,
      times: timeStamp,
    };

    if (inputValue.length) {
      socketRef.current.emit('sendmessage', sendData);
    }
    input.current.value = '';
  };

  // Delete Message
  const deleteHandler = (message) => {
    const data = {
      groupId: groupSelected._id,
      messageId: message.messageId,
    };

    socketRef.current.emit('deletemessage', data);
  };

  return (
    <div className="flex h-43rem bg-white">
      <div className="w-1/4 bg-white p-4 border-r border-gray-200">
        <div className="flex justify-center text-gray-800 font-semibold mb-6">
          <IoIosHeart className="text-blue-500 mt-0.5 w-5 h-5 mr-4" />
          Favorites
        </div>
        <ul>
          <li className="mb-4">
            <a
              href="#group"
              className="text-blue-500 font-medium px-2 py-1 ml-24 rounded-lg block"
            >
              No groups in favorite
            </a>
          </li>
        </ul>
        <div className="flex justify-center text-gray-800 font-semibold mb-6 mt-20">
          <HiMiniRectangleGroup className="text-blue-500 mt-0.5 w-5 h-5 mr-4" />
          Groups
        </div>
        <ul>
          {groups?.map((group) => (
            <li key={group._id} className="mb-4">
              <a
                href="#group"
                className="text-blue-500 hover:text-white hover:bg-blue-500 w-full flex justify-center transition-colors duration-200 font-medium px-2 py-1 rounded-lg"
                onClick={() => dispatch(selectGroup(group))}
              >
                #{group.groupName}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex justify-center text-gray-800 font-semibold mb-6 mt-20">
          <FaUserGroup className="text-blue-500 mt-0.5 w-5 h-5 mr-4" />
          Members
        </div>
        <ul>
          {groupSelected.members?.map((member) => (
            <li key={member._id} className="mb-4">
              <div className="flex items-center space-x-3 ml-20">
                <img
                  src={
                    member.profileImg
                      ? `/backend${member.profileImg.replace(/\\/g, '/')}`
                      : 'https://via.placeholder.com/40'
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full shadow-md"
                />
                <div className="text-blue-500 font-medium px-4">
                  {`${member.firstName} ${member.lastName}`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col bg-customGreen">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm">
          <h2 className="text-gray-900 font-semibold">
            {groupSelected.groupName}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {groupSelected.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center mono">
              <img
                src="https://cdn-icons-png.flaticon.com/512/8415/8415530.png"
                alt="No group selected"
                className="w-1/3 h-1/3   "
              />
              <p className="text-gray-600 text-lg text-center">
                Select a group to view and chat with its members.
                <br /> Once selected, you'll see conversations <br />
                and be able to send and receive messages in real-time.
              </p>
            </div>
          ) : (
            messages?.map((message, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 relative group"
              >
                <img
                  src={
                    message.profileImg
                      ? `/backend${message.profileImg.replace(/\\/g, '/')}`
                      : 'https://via.placeholder.com/40'
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full shadow-md"
                />
                <div className="flex flex-col relative">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-semibold">
                      {message.senderId === user._id
                        ? 'Me'
                        : message.senderName}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {message.timestamp}
                    </span>
                  </div>
                  <div
                    className={`${
                      message.senderId === user._id ? 'bg-white' : 'bg-blue-100'
                    } p-4 rounded-lg shadow-md`}
                  >
                    <p className="w-fit text-gray-800 text-left">
                      {message.text}
                    </p>
                  </div>

                  {/* Delete Icon Positioned in Background */}
                  {message.senderId === user._id && (
                    <MdDelete
                      className="absolute text-red-500 w-6 cursor-pointer right-0 top-0 h-full transform translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-10 transition-all duration-300"
                      onClick={() => deleteHandler(message)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white flex">
          <input
            type="text"
            placeholder="Type something to send..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 bg-gray-100 focus:outline-none focus:border-blue-500 shadow-sm"
            ref={input}
            onChange={() => setInputValue(input.current.value)}
          />
          <button
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 shadow-lg"
            onClick={sendHandler}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGroup;
