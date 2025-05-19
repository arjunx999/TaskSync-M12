import React, { useEffect } from "react";
import { useAppContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";

const ChatHome = () => {
  const Navigate = useNavigate();
  const { user } = useAppContext();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user === null) {
      alert("User not logged in. Please Log-in to continue");
      setTimeout(() => {
        Navigate("/");
      }, 500);
    }
    // console.log(user.profilePic)

    const token = sessionStorage.getItem("token");
    const fetchAllUsers = async () => {
      const resUsers = await axios.get("http://localhost:9999/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setAllUsers(resUsers.data);
      setAllUsers(resUsers.data.filter((u) => u._id !== user._id));
      // console.log(resUsers.data)
    };
    fetchAllUsers();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      sessionStorage.clear();
      Navigate("/");
    }
  };

  const [viewUsers, setViewUsers] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = search.trim()
    ? allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.username.toLowerCase().includes(search.toLowerCase())
      )
    : [...allUsers].sort((a, b) => a.name.localeCompare(b.name));

  const serverUrl = "http://localhost:9999";

  const [showUserDetails, setShowUserDetails] = useState(false);
  const [ShowPfp, setShowPfp] = useState(false);

  return (
    <div className="w-[100vw] h-[100vh] flex overflow-hidden bg-[#F5F7FA]">
      {/* SIDEBAR */}
      <div className="w-[5%] h-full bg-zinc-100 border-r-[0.1rem] flex flex-col">
        <div className="w-fill h-[50%] flex flex-col pt-[1.5vh]">
          <div className="w-full h-[10vh] flex justify-center items-center relative group">
            <i className="ri-chat-1-line text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer bg-[#F5F7FA]"></i>
            <span className="absolute left-1/2 -translate-x-1/2 translate-y-5.5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Chats
            </span>
          </div>
          <div className="w-full h-[10vh] bg--300 flex justify-center items-center relative group ">
            <i className="ri-list-check-3 text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem]  cursor-pointer bg-[#F5F7FA]"></i>
            <span className="absolute left-1/2 -translate-x-1/2 translate-y-5.5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Tasks
            </span>
          </div>
        </div>
        <div className="w-fill h-[50%] bg--400 flex flex-col pb-[2vh] justify-end">
          <div className="w-full h-[10vh] bg--300 flex justify-center items-center relative group">
            <i
              className="ri-logout-box-line  text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer bg-[#F5F7FA]"
              onClick={handleLogout}
            ></i>
            <span className="absolute left-1/2 -translate-x-1/2 translate-y-5.5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Log out
            </span>
          </div>
          <div className="w-full h-[10vh] p-2 inline-block relative group">
            <img
              className="w-full h-full bg-gray-200 border-[0.1rem] rounded-full cursor-pointer"
              src={`${serverUrl}/${user.profilePic}`}
              alt="Profile Picture"
              onClick={() => setShowUserDetails((prev) => !prev)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Profile
            </span>
          </div>
        </div>
      </div>

      {/* CONTACT-LIST */}
      <div className="w-[30%] h-full bg--300 relative border-r-[0.1rem] flex flex-col ">
        <div className="w-full h-[10%] bg--300 border-b-[0.1rem]">
          <img
            className="w-full h-full object-cover scale-50"
            src={logo}
            alt=""
          />
        </div>
        <div className="w-full border--[0.1rem] h-[7%] bg--600 gap-[0.7vw] flex items-center relative justify-center px-[1vw]">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="relative h-[77%] rounded-xl p-2 w-[95%] border-[1.4px] border-zinc-800 bg-zinc-100 font-['Fredoka'] "
            onClick={() => setViewUsers((prev) => !prev)}
          />
          {viewUsers && (
            <div className="absolute w-full rounded-b-lg h-auto bg-zinc-100 max-h-[30vh] z-10 overflow-y-scroll flex flex-col top-[7vh] shadow-lg border border-b-zinc-400 font-['Fredoka'] border-l-zinc-400 border-r-zinc-400 ">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="w-full"
                  onClick={() => {
                    setSelectedUser(u), setViewUsers(false);
                  }}
                >
                  <div className="w-full px-4 py-2 hover:bg-zinc-300 cursor-pointer flex items-center gap-2">
                    <img
                      src={`${serverUrl}/${u.profilePic}`}
                      alt={u.username}
                      className="w-8 h-8 rounded-full border"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{u.name}</span>
                      <span className="text-xs text-gray-700">
                        @{u.username}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center text-sm py-2 text-gray-600">
                  No users found
                </div>
              )}
            </div>
          )}

          <div className="relative group inline-block">
            <i className="ri-group-fill border-[1.4px] text-xl px-2 py-1 rounded-xl bg--300 cursor-pointer"></i>

            <span className="absolute left-1/2 -translate-x-1/2 translate-y-5.5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Create Group
            </span>
          </div>
        </div>
        <div className="w-full h-[83%] bg--400 border-t-[0.1rem] overflow-x-hidden overflow-y-scroll"></div>

        {showUserDetails && (
          <div className="w-full h-full bg-[#F5F7FA] border-r-[0.1rem] absolute py-[11vh] top-0 left-0 z-20">
            <div className="w-[16vw] h-[16vw] bg-zinc-300 border-[0.17rem] rounded-full mx-auto overflow-hidden">
              <div
                className=" absolute text-3xl top-[1.4vw] left-[1.4vw]  flex justify-center items-center"
                onClick={() => setShowUserDetails(false)}
              >
                <i className="ri-close-fill text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer bg-zinc-100"></i>
              </div>
              <img
                className="w-full h-full obejct-cover cursor-pointer"
                src={`${serverUrl}/${user.profilePic}`}
                onClick={() => setShowPfp(true)}
                alt=""
              />
            </div>
            <div className="flex flex-col items-center mt-[2vh] gap-[0.5vh]">
              <h3 className="text-3xl font-semibold font-['Fredoka']">
                {user.name}
              </h3>
              <h3 className="text-lg font-['Fredoka']">{user.bio}</h3>
              <h3 className="text-lg font-['Fredoka']">@{user.username}</h3>
              <h3 className="text-sm text-gray-600 font-['Fredoka']">
                {user.email}
              </h3>
            </div>
          </div>
        )}
      </div>

      {ShowPfp && (
        <div className="w-[95%] flex justify-center items-center h-full glass-effect absolute left-[5%] top-0 z-20">
          <div
            className=" absolute text-3xl top-[1.4vw] left-[1.4vw]  flex justify-center items-center"
            onClick={() => setShowPfp(false)}
          >
            <i className="ri-close-fill text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer"></i>
          </div>
          <img
            className="w-[30vw]"
            src={`${serverUrl}/${user.profilePic}`}
            alt=""
          />
        </div>
      )}
      {/* CHAT */}
      {/* <div className="w-[65%] h-full bg-[#F5F7FA] flex flex-col font-['Fredoka'] "> */}
      <div className="w-[65%] h-full">
        {selectedUser ? (
          <ChatBox user={user} selectedUser={selectedUser} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <h1 className="font-['Fredoka'] text-2xl my-auto">
              Select a User To start texting
            </h1>
          </div>
        )}
        {/* <div className="w-full h-[10%] bg- border-b-[0.1rem] flex items-center justify-between gap-[1vw] text-xl font-semibold px-[2vw] select-none">
          <div className="flex items-center justify-center gap-[1vw]">
            {selectedUser && (
              <div className="w-[3.3vw] h-[3.3vw] rounded-full bg-zinc-300 border-[0.1rem]">
                <img
                  src={`${serverUrl}/${selectedUser.profilePic}`}
                  className="w-full h-full rounded-full "
                  alt=""
                />
              </div>
            )}
            {selectedUser ? (
              <h1>{selectedUser.name}</h1>
            ) : (
              <h1>No user selected</h1>
            )}
          </div>
          {selectedUser && <div className="flex items-center justify-center">
            <div className="relative group inline-block">
              <i className="ri-more-2-fill cursor-pointer border-[1.4px] rounded-xl px-2 py-2"></i>
              <span className="absolute left-1.5 -translate-x-1/2 translate-y-5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                View Details
              </span>
            </div>
          </div>}
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
        </div> */}
      </div>
    </div>
  );
};

export default ChatHome;
