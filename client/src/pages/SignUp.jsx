import React from "react";
import photo from "../assets/undraw_chatting_2b1g.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const Navigate = useNavigate();
  const headTohome = () => {
    Navigate(-1);
  };
  const [fileName, setFileName] = useState("Upload Profile Picture");

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    if (newFile) {
      setFileName(newFile.name);
    } else {
      setFileName("Upload File");
    }
  };

  const [signUpInfo, setSignUpInfo] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a Profile Picture");
    }

    const formData = new FormData();
    formData.append("username", signUpInfo.username);
    formData.append("name", signUpInfo.name);
    formData.append("email", signUpInfo.email);
    formData.append("password", signUpInfo.password);
    formData.append("profilePic", file);

    try {
      const response = await fetch("http://localhost:9999/auth/signup", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.status === 400) {
        alert("Username already taken.");
      }

      if (response.status === 409) {
        alert("User Already Exists. Try Logging in Instead");
      }

      const { success, message } = data;
      if (success) {
        alert("Sign-up Successful! Login to continue");
        setTimeout(() => {
          Navigate("/log-in");
        }, 500);
      } else {
        alert(message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] relative overflow-hidden bg-[#F5F7FA] flex items-center justify-center select-none">
      <i
        onClick={headTohome}
        className="ri-arrow-left-circle-line absolute left-[3vw] top-[5vh] scale-300 text-black cursor-pointer "
      ></i>
      <div className="w-[75%] h-[75%] rounded-2xl absolute bg-black z-0 right-[12vw] bottom-[11.3vh] "></div>
      <div className="w-[75%] h-[75%] rounded-2xl bg-white z-10  border-[2px] flex overflow-hidden">
        <div className="w-[50%] h-full bg--300 border-r-[2px] px-[3vw] py-[8vh]">
          <h1 className="text-3xl font-['Fredoka'] font-medium ">Sign-Up :</h1>
          <form onSubmit={handleSignUp}>
            <div className="mt-[2vh] flex gap-x-[0.5vw] bg--400">
              <input
                type="text"
                placeholder="username"
                required
                className="w-[49%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                name="username"
                value={signUpInfo.username}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="name"
                required
                className="w-[49%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                name="name"
                value={signUpInfo.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col mt-[0.8vw] gap-y-[0.8vw] bg--400">
              <input
                type="email"
                placeholder="email"
                required
                className="w-[100%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                name="email"
                value={signUpInfo.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="password"
                required
                className="w-[100%] h-[6vh] rounded-xl p-2 border-[1.4px] border-zinc-800 bg-zinc-100  font-fredoka"
                name="password"
                value={signUpInfo.password}
                onChange={handleInputChange}
              />
              <div className="w-full relative">
                {" "}
                <input
                  type="file"
                  id="fileUpload"
                  required
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  className="bg--300 opacity-0 rounded-xl w-[100%] h-[10vh] cursor-pointer"
                />
                <label
                  htmlFor="fileUpload"
                  className="absolute w-full h-[10vh] flex items-center top-0 left-0 justify-center bg-zinc-100 border-zinc-800 border-[1.4px] rounded-xl p-2 font-fredoka text-zinc-600 shadow-inner cursor-pointer"
                >
                  {fileName}
                </label>
              </div>

              {/* button */}
              <button type="submit">
                <div
                  aria-label="User Login Button"
                  tabIndex="0"
                  role="button"
                  className="user-profile-2 mx-auto "
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
              </button>
            </div>
          </form>
          <h3 className="font-['Fredoka'] text-sm mt-[2.5vh] ">
            Note : username and password must be 5-20 characters long.
          </h3>
          <h3 className="font-['Fredoka'] text-sm mt-[1vh]">
            Already have an account ?{" "}
            <Link to="/log-in" className="underline">
              Log-In{" "}
            </Link>
            instead.
          </h3>
        </div>
        <div className="w-[50%] h-full bg--300 flex flex-col items-center justify-center">
          <div className="w-[90%] h-[70%] bg--200  ">
            <img className="object-cover scale-82" src={photo} alt="" />
          </div>
          <div className="w-[90%] h-[20%] bg--300">
            <h1 className="mt-[1.5vh] leading-tight text-md font- font-['Fredoka']">
              Experience a unified workspace where conversations turn into
              actionable tasks. Whether you're managing a team or working solo,
              TaskSync keeps everything organized, updated, and moving
              forward—effortlessly.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
