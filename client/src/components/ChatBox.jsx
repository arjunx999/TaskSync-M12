import React from "react";
import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import axios from "axios";

const ChatBox = ({ selectedUser, user }) => {
  const serverUrl = "http://localhost:9999";

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [ShowPfp, setShowPfp] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("user-connected", user._id);
    }
  }, [user]);

  const [text, setText] = useState("");
  // console.log(text)
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // console.log(user)
    const FetchMessages = async () => {
      try {
        if (!selectedUser?._id) return;
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:9999/directMessages/getMessages/${selectedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.log("error loading messages: ", error);
      }
    };
    FetchMessages();
  }, [selectedUser]);

  // console.log(messages);
  const handleSendMessage = () => {
    if (text.trim().length < 1) return;

    const newMsg = {
      receiverId: selectedUser._id,
      content: text,
      senderId: user._id,
    };

    socket.emit("send-message", newMsg);
    setMessages((prev) => [...prev, { ...newMsg, sender: user._id }]);
    setText("");
  };

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (
        selectedUser &&
        ((msg.sender === selectedUser._id && msg.receiver === user._id) ||
          (msg.sender === user._id && msg.receiver === selectedUser._id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const [file, setFile] = useState(null);

  // const handleFileChange = async (e) => {
  //   const newFile = e.target.files[0];
  //   setFile(newFile);
  //   const formData = new FormData();
  //   formData.append("senderId", user._id);
  //   formData.append("receiverId", selectedUser._id);
  //   formData.append("content", text);
  //   formData.append("attachment", newFile);
  //   const token = sessionStorage.getItem("token")
  //   try {
  //     const res = await axios.post(
  //         "http://localhost:9999/directMessages/send",
  //         formData,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       if(res.status == 201) {
  //         console.log("attachment uploaded")
  //         setMessages((prev) => [...prev, res.data]);
  //         socket.emit("send-message", {
  //           ...res.data,
  //         });
  //       } else {
  //         console.log("error in attachment upload")
  //       }

  //   } catch (error) {
  //     console.error("File upload failed:", error);

  //   }
  // }

  return (
    <div className="w-full h-full bg-[#F5F7FA] relative flex flex-col font-['Fredoka']">
      <div className="w-full h-[10%] bg- border-b-[0.1rem] flex items-center justify-between gap-[1vw] text-xl font-semibold px-[2vw] select-none">
        <div className="flex items-center justify-center gap-[1vw]">
          {selectedUser && (
            <div className="w-[3.3vw] h-[3.3vw] rounded-full bg-zinc-300 border-[0.1rem]">
              <img
                onClick={() => setShowUserDetails((prev) => !prev)}
                src={`${serverUrl}/${selectedUser.profilePic}`}
                className="w-full h-full rounded-full cursor-pointer "
                alt=""
              />
            </div>
          )}
          {selectedUser ? (
            <h1
              className="cursor-pointer"
              onClick={() => setShowUserDetails((prev) => !prev)}
            >
              {selectedUser.name}
            </h1>
          ) : (
            <h1>No user selected</h1>
          )}
        </div>
        {selectedUser && (
          <div className="flex items-center justify-center">
            <div className="relative group inline-block">
              <i
                className="ri-more-2-fill cursor-pointer border-[1.4px] rounded-xl px-2 py-2"
                onClick={() => setShowUserDetails((prev) => !prev)}
              ></i>
              <span className="absolute left-1.5 -translate-x-1/2 translate-y-5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                View Details
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ------------------- Messages section ------------------- */}
      <div
        className="w-full h-[81%] bg-zinc-100 px-5 py-3 overflow-x-hidden overflow-y-scroll [scrollbar-width:none] 
                [-ms-overflow-style:none] 
                [&::-webkit-scrollbar]:w-0 
                [&::-webkit-scrollbar]:bg-transparent"
      >
        {messages.map((msg, index) => {
          const isSender = msg.sender === user._id;
          return (
            <div
              key={index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full select-none">
                  <img
                    alt="Profile"
                    src={`${serverUrl}/${
                      isSender ? user.profilePic : selectedUser.profilePic
                    }`}
                  />
                </div>
              </div>
              <div className="chat-header select-none">
                {isSender ? user.name : selectedUser.name}
              </div>
              <div className="chat-bubble min-h-[2vh] h-auto max-w-[45%] break-words overflow-wrap break-word overflowhidden">
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full h-[9%] bg-[#F5F7FA] flex items-center justify-center border-t-[0.1rem]">
        <div
          className="w-full h-[94%] border--[0.1rem]  bg--600 gap-[0.7vw] flex items-center justify-center px-[1vw]"
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   handleSendMessage();
          // }}
        >
          <div className="relative group inline-block">
            <i className="ri-attachment-2 border-[1.4px] text-xl px-3 py-[0.52rem] rounded-xl bg--300 cursor-pointer"></i>
            {/* <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              className="absolute -top-1.5 left-0 rounded-xl w-full h-full bg-pink-900 py-5 opacity-0 cursor-pointer"
            /> */}
            <span className="absolute left-1.5 -translate-x-1/2 -translate-y-9 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Add Attachment
            </span>
          </div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message"
            className="h-[77%] rounded-xl p-2 w-[95%] border-[1.4px] border-zinc-800 bg-zinc-100 font-['Fredoka'] "
          />
          <button
            onClick={() => handleSendMessage()}
            type="submit"
            className="relative group inline-block"
          >
            <i className="ri-send-plane-fill border-[1.4px] text-xl px-3 py-[0.52rem] rounded-xl bg--300 cursor-pointer"></i>

            <span className="absolute left-1.5 -translate-x-1/2 -translate-y-9 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Send Message
            </span>
          </button>
        </div>
      </div>

      {showUserDetails && (
        <div className="w-[30vw] h-full bg-[#F5F7FA] border-r-[0.1rem] absolute py-[11vh] top-0 -left-[30vw] z-20">
          <div className="w-[16vw] h-[16vw] bg-zinc-300 border-[0.17rem] rounded-full mx-auto overflow-hidden">
            <div
              className=" absolute text-3xl top-[1.4vw] left-[1.4vw]  flex justify-center items-center"
              onClick={() => setShowUserDetails(false)}
            >
              <i className="ri-close-fill text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer bg-zinc-100"></i>
            </div>
            <img
              className="w-full h-full obejct-cover cursor-pointer"
              src={`${serverUrl}/${selectedUser.profilePic}`}
              onClick={() => setShowPfp(true)}
              alt=""
            />
          </div>
          <div className="flex flex-col items-center mt-[2vh] gap-[0.5vh]">
            <h3 className="text-3xl font-semibold font-['Fredoka']">
              {selectedUser.name}
            </h3>
            <h3 className="text-lg font-['Fredoka']">{selectedUser.bio}</h3>
            <h3 className="text-lg font-['Fredoka']">
              @{selectedUser.username}
            </h3>
            <h3 className="text-sm text-gray-600 font-['Fredoka']">
              {selectedUser.email}
            </h3>
          </div>
        </div>
      )}
      {ShowPfp && (
        <div className="w-[95vw] flex justify-center items-center h-full glass-effect absolute top-0 right-[0vw] z-20">
          <div
            className=" absolute text-3xl top-[1.4vw] left-[1.4vw]  flex justify-center items-center"
            onClick={() => setShowPfp(false)}
          >
            <i className="ri-close-fill text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer"></i>
          </div>
          <img
            className="w-[30vw]"
            src={`${serverUrl}/${selectedUser.profilePic}`}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
