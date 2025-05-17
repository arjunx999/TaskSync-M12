import React from "react";
import photo from "../assets/undraw_remotely_p27a.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "../context/UserContext";

const LogIn = () => {
  const Navigate = useNavigate();
  const headTohome = () => {
    Navigate(-1);
  };

  const { setUser } = useAppContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogInInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const [logInInfo, setLogInInfo] = useState({
    email: "",
    password: "",
  });

  const handleLogIn = async (e) => {
    e.preventDefault();

    const { email, password } = logInInfo;

    try {
      const response = await fetch("http://localhost:9999/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInInfo),
      });
      const data = await response.json();

      if (response.status === 404) {
        return alert("User Does Not Exists. Sign-Up Instead");
      }
      if (response.status === 400) {
        alert("Incorrect password !");
      }

      const { success, message, token, user } = data;
      if (success) {
        sessionStorage.setItem("token", token);
        setUser(user);
        alert("Log-in successful!");
        setTimeout(() => {
          Navigate("/home");
        }, 500);
      } else {
        alert(message || "Log-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Login:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] relative overflow-hidden bg-[#F5F7FA] flex items-center justify-center">
      <i
        onClick={headTohome}
        className="ri-arrow-left-circle-line absolute left-[3vw] top-[5vh] scale-300 text-black cursor-pointer "
      ></i>
      <div className="w-[75%] h-[75%] rounded-2xl absolute bg-black z-0 right-[12vw] bottom-[11.3vh] "></div>
      <div className="w-[75%] h-[75%] rounded-2xl bg-white z-10  border-[2px] flex overflow-hidden">
        <div className="w-[50%] h-full bg--300 border-r-[2px] flex flex-col items-center justify-center">
          <div className="w-[90%] h-[70%] bg--200 mb-[1.5vh] ">
            <img className="object-cover scale-80" src={photo} alt="" />
          </div>
          <div className="w-[90%] h-[20%] bg--300">
            <h1 className="mt-[1.8vh] leading-tight text-md font- font-['Fredoka']">
              Continue where you left off in your unified workspace. Rejoin the
              flow of real-time chats and tasks—all seamlessly synced to keep
              your projects organized and updated.
            </h1>
          </div>
        </div>
        <div className="w-[50%] h-full bg--300 px-[3vw] py-[15vh]">
          <h1 className="text-3xl font-['Fredoka'] font-medium ">Log-In :</h1>
          <form action="" onSubmit={handleLogIn}>
            <div className="flex flex-col mt-[0.8vw] gap-y-[0.8vw] bg--400">
              <input
                type="email"
                placeholder="email"
                required
                className="w-[100%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                name="email"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="password"
                required
                className="w-[100%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100 font-fredoka"
                name="password"
                onChange={handleInputChange}
              />

              {/* button */}
              <button type="submit">
                <div
                  aria-label="User Login Button"
                  tabIndex="0"
                  role="button"
                  className="user-profile mx-auto"
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
              </button>
            </div>
          </form>
          <h3 className="font-['Fredoka'] text-sm mt-[2.5vh] ">
            Note : username and password must be 5-20 characters long.
          </h3>
          <h3 className="font-['Fredoka'] text-sm mt-[1vh]">
            Don't have an account ?{" "}
            <Link to="/sign-up" className="underline">
              Sign-Up{" "}
            </Link>
            instead.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
