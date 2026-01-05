import React, { useMemo } from "react";
import heroImage from "../assets/homePageImage.png";

const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return "Good Morning";
  if (hr < 17) return "Good Afternoon";
  return "Good Evening";
};

const Home = () => {
  const greeting = useMemo(() => getGreeting(), []);
  const userName = "Mubin";

  return (
    <div className="w-full bg-white overflow-hidden flex font-poppins text-gray-900">

      {/* HEIGHT FIXED */}
      <main className="flex w-full h-[600px] md:h-screen lg:h-[450px] flex-col md:flex-col lg:flex-row">


        {/* IMAGE SECTION */}
        <div className="
  w-full
  lg:w-1/2
  flex
  justify-center
  items-center
  md:items-center
  md:pt-0
  order-1
  md:order-1
  lg:order-2
">

          <img
            src={heroImage}
            alt="Dashboard"
            className="
              max-h-[260px]
              sm:max-h-[300px]
              md:max-h-[700px]
              lg:max-h-[450px]
              w-auto
              object-contain
            "
          />
        </div>

        {/* GREETING SECTION */}
        <div
          className="
            w-full
            lg:w-1/2
            flex
            justify-center
            items-center
            px-6
            md:mt-4
            text-center
            lg:text-left
            order-2
            md:order-2
            lg:order-1
          "
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
              {greeting},
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-600">
              {userName}
            </h2>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
