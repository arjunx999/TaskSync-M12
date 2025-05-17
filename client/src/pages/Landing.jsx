import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import landing from "../assets/undraw_online-connection_c56e.svg";

const Landing = () => {
  const Navigate = useNavigate();
  const headToLogin = () => {
    Navigate("/log-in");
  };
  const headToSignUp = () => {
    Navigate("/sign-up");
  };
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden bg-[#F5F7FA] flex flex-col select-none">
      {/* Navbar */}
      <div className="w-full h-[9.5%] bg--300 flex border-b-[0.1rem] border-black">
        <div className="w-[20%] h-full bg--400">
          <img
            className="cursor-pointer w-full h-full object-cover scale-68 "
            src={logo}
            alt=""
          />
        </div>
        <div className="w-[80%] h-full bg--400 flex items-center gap-x-[2.5vw] justify-end px-[5vw] ">
          <a
            target="blank"
            className="scale-160 cursor-pointer"
            href="https://github.com/arjunx999/TaskSync-M12"
          >
            <i className="ri-github-fill "></i>
          </a>
          <a
            className="scale-160 cursor-pointer"
            target="blank"
            href="https://www.linkedin.com/in/arjun-verma-5b4326292/"
          >
            <i className="ri-linkedin-fill "></i>
          </a>

          <div
            aria-label="User Login Button"
            tabIndex="0"
            role="button"
            className="user-profile"
            onClick={headToLogin}
          >
            <div className="user-profile-inner">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g data-name="Layer 2" id="Layer_2">
                  <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"></path>
                </g>
              </svg>
              <p>Log In</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[90.5%] bg--300 flex ">
        <div className="w-[50%] h-full bg--400 flex flex-col px-[2vw] items-start justify-center">
          <h1 className="font-black text-4xl font-['Fredoka'] ">
            Turn Your Conversations into Actions with TaskSync :
          </h1>
          <h3 className="mt-[2vh] leading-tight text-lg font- font-['Fredoka'] mr-3 ">
            TaskSync is a clean and intuitive real-time chat app built for
            freelancers and startup teams. It lets you seamlessly convert
            messages into tasks, assign deadlines, and track progress—all
            without leaving the conversation. From brainstorming to execution,
            everything stays in sync with live updates and drag-and-drop task
            tracking.
          </h3>
          <h3 className="mt-[0.6vh] leading-tight text-lg font- font-['Fredoka']">
            Sign up now and start turning chats into action.
          </h3>
          <div
            aria-label="User Login Button"
            tabIndex="0"
            role="button"
            className="user-profile-2 mt-[2vh] "
            onClick={headToSignUp}
          >
            <div className="user-profile-inner-2">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g data-name="Layer 2" id="Layer_2">
                  <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"></path>
                </g>
              </svg>
              <p>Sign Up</p>
            </div>
          </div>
        </div>
        <div className="w-[50%] h-full bg--400 flex justify-center items-center">
          <img src={landing} className="scale-85" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
