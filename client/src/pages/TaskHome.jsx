import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/UserContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import KanbanBoard from "../components/KanbanBoard";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TaskHome = () => {
  // console.log(localStorage.getItem("task_head"))

  const { user } = useAppContext();
  const Navigate = useNavigate();
  const [ShowPfp, setShowPfp] = useState(false);
  const serverUrl = "http://localhost:9999";
  const [taskCreation, setTaskCreation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const token = sessionStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((task) => task.status === "To Do").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      sessionStorage.clear();
      Navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:9999/tasks/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(res.data);
      setFormData({ title: "", description: "", dueDate: "" });
      setTaskCreation(false);
      await fetchUserTasks();
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  const fetchUserTasks = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:9999/tasks/user/${user._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTasks(res.data);
  };

  useEffect(() => {
    const heading = sessionStorage.getItem("task_head");
    if (heading) {
      setFormData({
        title: heading,
        description: "",
        dueDate: "",
      });
      sessionStorage.removeItem("task_head");
      setTaskCreation(true);
    }
    fetchUserTasks();
  }, [user._id]);

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
      <div className="w-[95%] h-full bg--100 flex justify-center items-center gap-[2.5vw] ">
        {/* Kanban Board */}
        <div className="w-[66%] h-[90%] z-0 bg-zinc-100 rounded-3xl border-[0.1rem] flex flex-col">
          {taskCreation ? (
            // Task creator
            <form
              className="w-full h-full bg-white rounded-3xl flex px-[2vw] pt-[2vw] relative"
              onSubmit={handleSubmit}
            >
              <div className="w-full flex flex-col mt-[0.8vw] font-['Fredoka'] gap-y-[0.8vw] bg--400">
                <div className="flex w-full h-20 bg--300 gap-[3%]">
                  <div className="w-[72%]">
                    <h1 className="text-2xl">Title :</h1>
                    <input
                      type="text"
                      placeholder="task name"
                      required
                      className="w-[100%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                      name="title"
                      onChange={handleInputChange}
                      value={formData.title}
                    />
                  </div>

                  <div className="w-[25%]">
                    <h1 className="text-2xl">Due Date :</h1>
                    <input
                      type="date"
                      placeholder="email"
                      required
                      className="w-[100%] h-[6vh] rounded-xl p-3 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                      name="dueDate"
                      onChange={handleInputChange}
                      value={formData.dueDate}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="w-full h-[70%] bg--300">
                  <h1 className="text-2xl">Description :</h1>
                  <textarea
                    type="text"
                    placeholder="describe your task here..."
                    required
                    className="w-[100%] h-[91%] resize-none overflow-y-scroll rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100 [scrollbar-width:none] 
                [-ms-overflow-style:none] 
                [&::-webkit-scrollbar]:w-0 
                [&::-webkit-scrollbar]:bg-transparent font-fredoka"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                {/* button */}
                <button type="submit">
                  <div
                    aria-label="User Login Button"
                    tabIndex="0"
                    role="button"
                    className="user-profile mx-auto"
                  >
                    <div className="user-profile-inner">
                      <p>Add Task</p>
                    </div>
                  </div>
                </button>
              </div>

              <div
                className="w-[3.7vw] h-[3.7vw] bg-red-400 cursor-pointer rounded-full absolute -right-4 -top-4 flex items-center justify-center border-[0.1rem] border-black hover:shadow-md"
                onClick={() => {
                  setTaskCreation(false);
                  setFormData({
                    title: "",
                    description: "",
                    dueDate: "",
                  });
                }}
              >
                <i className="ri-close-fill font-bold text-2xl"></i>
              </div>
            </form>
          ) : (
            // Kanban board
            <div>
              <div className="w-full h-[10%] bg-white rounded-t-3xl flex justify-between border-b-[0.1rem] select-none">
                <div className="w-[25%] relative h-full bg--300">
                  <img
                    className="w-full h-full absolute -left-3 top-[3px] object-cover scale-70"
                    src={logo}
                    alt=""
                  />
                </div>
                <div className="w-[25%] h-full bg--300 flex items-center justify-end pr-[2%]">
                  <button type="submit" onClick={() => setTaskCreation(true)}>
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
              <div className="w-full h-[90%] bg-zinc-100">
                <KanbanBoard tasks={tasks} refetchTasks={fetchUserTasks} />
              </div>
            </div>
          )}
        </div>
        {/* Progress Graph */}
        <div className="w-[25.5%] h-[90%] bg-white overflow-hidden rounded-3xl border-[0.1rem] flex flex-col">
          <div className="w-full h-[60%] bg--300 flex items-center justify-center border-b-[0.1rem]">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-45 h-45">
                <CircularProgressbar
                  value={progressPercent}
                  text={`${progressPercent}%`}
                  styles={buildStyles({
                    pathColor: "#fc9003",
                    textColor: "#fc9003",
                    trailColor: "#ffe6c7",
                    backgroundColor: "#fff",
                    textSize: "1.5rem",
                    pathTransitionDuration: 0.5,
                  })}
                />
              </div>
              <span className="text-lg font-semibold text-gray-700 mt-2">
                Progress
              </span>
            </div>
          </div>
          <div className="w-full pt-1 h-[40%] bg--300">
            <h1 className="text-xl font-['Fredoka'] font-semibold ml-[5%] underline underline-offset-3">
              Tasks :
            </h1>
            <div className="w-full h-[88%] font-['Fredoka'] bg--300 flex items-center justify-center p-1">
              <div className="w-[50%] h-full bg-300 flex flex-col items-center justify-center gap-y-[5%]">
                <div className="w-[87%] h-[40%] bg-blue-100 items-center pl-3 rounded-xl flex border-[0.1rem]">
                  <div className="w-[6px] rounded-xl h-[62%] bg-blue-500"></div>
                  <div className="flex flex-col ml-1.5 ">
                    <h1 className="text-lg font-semibold">Total :</h1>
                    <h2 className="text-lg -mt-1">{totalTasks}</h2>
                  </div>
                </div>
                <div className="w-[87%] h-[40%] bg-orange-100 items-center pl-3 rounded-xl flex border-[0.1rem]">
                  <div className="w-[6px] rounded-xl h-[62%] bg-orange-500"></div>
                  <div className="flex flex-col ml-1.5 ">
                    <h1 className="text-lg font-semibold">To-do :</h1>
                    <h2 className="text-lg -mt-1">{todoTasks}</h2>
                  </div>
                </div>
              </div>
              <div className="w-[50%] h-full bg-300 flex flex-col items-center justify-center gap-y-[5%]">
                <div className="w-[87%] h-[40%] bg-pink-100 items-center pl-3 rounded-xl flex border-[0.1rem]">
                  <div className="w-[6px] rounded-xl h-[62%] bg-pink-500"></div>
                  <div className="flex flex-col ml-1.5 ">
                    <h1 className="text-lg font-semibold">Completed :</h1>
                    <h2 className="text-lg -mt-1">{completedTasks}</h2>
                  </div>
                </div>
                <div className="w-[87%] h-[40%] bg-purple-100 items-center pl-3 rounded-xl flex border-[0.1rem]">
                  <div className="w-[6px] rounded-xl h-[62%] bg-purple-500"></div>
                  <div className="flex flex-col ml-1.5 ">
                    <h1 className="text-lg font-semibold">In-Prog :</h1>
                    <h2 className="text-lg -mt-1">{inProgressTasks}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHome;
