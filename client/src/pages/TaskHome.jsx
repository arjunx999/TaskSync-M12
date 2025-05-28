import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/UserContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import KanbanBoard from "../components/KanbanBoard";

const TaskHome = () => {
  // console.log(localStorage.getItem("task_head"))

  const { user } = useAppContext();
  const Navigate = useNavigate();
  const [ShowPfp, setShowPfp] = useState(false);
  const serverUrl = "http://localhost:9999";

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      sessionStorage.clear();
      Navigate("/");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden bg-[#F5F7FA] flex">
      {/* Pfp Display */}
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
      {/* Sidebar */}
      <div className="w-[5%] h-full bg-zinc-100 border-r-[0.1rem] flex flex-col">
        <div className="w-fill h-[50%] flex flex-col pt-[1.5vh]">
          <div
            className="w-full h-[10vh] flex justify-center items-center relative group"
            onClick={() => Navigate("/home")}
          >
            <i
              className="ri-chat-1-line text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem] cursor-pointer bg-[#F5F7FA]"
              onClick={() => Navigate("/home")}
            ></i>
            <span className="absolute left-1/2 -translate-x-1/2 translate-y-5.5 mt-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Chats
            </span>
          </div>
          <div className="w-full h-[10vh] bg--300 flex justify-center items-center relative group ">
            <i
              className="ri-list-check-3 text-xl px-3 py-2 rounded-full bg--300 border-[0.1rem]  cursor-pointer bg-[#F5F7FA]"
              onClick={() => Navigate("/tasks")}
            ></i>
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
              onClick={() => setShowPfp((prev) => !prev)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Profile
            </span>
          </div>
        </div>
      </div>
      {/* Right-Half */}
      <div className="w-[95%] h-full bg-zinc-100 flex justify-center items-center gap-[2.5vw] ">
        {/* Kanban Board */}
        <div className="w-[66%] h-[90%] bg-white overflow-hidden  rounded-3xl border-[0.1rem] flex flex-col">
          <div className="w-full h-[10%] bg-white flex justify-between border-b-[0.1rem] select-none">
            <div className="w-[25%] relative h-full bg--300">
              <img
                className="w-full h-full absolute -left-3 top-[3px] object-cover scale-70"
                src={logo}
                alt=""
              />
            </div>
            <div className="w-[25%] h-full bg--300 flex items-center justify-end pr-[2%]">
              <button type="submit">
                <div
                  aria-label="User Login Button"
                  tabIndex="0"
                  role="button"
                  className="user-profile mx-auto"
                >
                  <div className="user-profile-inner">
                    <p className="font-['Fredoka']">Add Task</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="w-full h-[90%] bg--900">
            <KanbanBoard />
          </div>
        </div>
        {/* Progress Graph */}
        <div className="w-[25.5%] h-[90%] bg-white overflow-hidden rounded-3xl border-[0.1rem]"></div>
      </div>
    </div>
  );
};

export default TaskHome;
