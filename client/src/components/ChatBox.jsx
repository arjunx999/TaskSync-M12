import React from "react";
import { useState } from "react";

const ChatBox = ({ selectedUser, user }) => {

  const serverUrl = "http://localhost:9999";

  const [showUserDetails, setShowUserDetails] = useState(false);
    const [ShowPfp, setShowPfp] = useState(false);

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
            <h1 className="cursor-pointer" onClick={() => setShowUserDetails((prev) => !prev)}>{selectedUser.name}</h1>
          ) : (
            <h1>No user selected</h1>
          )}
        </div>
        {selectedUser && (
          <div className="flex items-center justify-center">
            <div className="relative group inline-block">
              <i className="ri-more-2-fill cursor-pointer border-[1.4px] rounded-xl px-2 py-2" onClick={() => setShowUserDetails((prev) => !prev)}></i>
              <span className="absolute left-1.5 -translate-x-1/2 translate-y-5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                View Details
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-[81%] bg-zinc-100"></div>
      <div className="w-full h-[9%] bg-[#F5F7FA] flex items-center justify-center border-t-[0.1rem]">
        <div className="w-full h-[94%] border--[0.1rem]  bg--600 gap-[0.7vw] flex items-center justify-center px-[1vw]">
          <div className="relative group inline-block">
            <i className="ri-attachment-2 border-[1.4px] text-xl px-3 py-[0.52rem] rounded-xl bg--300 cursor-pointer"></i>

            <span className="absolute left-1.5 -translate-x-1/2 -translate-y-9 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Add Attachment
            </span>
          </div>
          <input
            type="text"
            placeholder="Type your message"
            className="h-[77%] rounded-xl p-2 w-[95%] border-[1.4px] border-zinc-800 bg-zinc-100 font-['Fredoka'] "
          />
          <div className="relative group inline-block">
            <i className="ri-send-plane-fill border-[1.4px] text-xl px-3 py-[0.52rem] rounded-xl bg--300 cursor-pointer"></i>

            <span className="absolute left-1.5 -translate-x-1/2 -translate-y-9 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Send Message
            </span>
          </div>
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
              <h3 className="text-lg font-['Fredoka']">@{selectedUser.username}</h3>
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
