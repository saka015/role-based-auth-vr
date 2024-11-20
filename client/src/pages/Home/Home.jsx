import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen w-full p-10 ">
      <div className="dot-bg shadow-2xl bordder pb-44 flex flex-col justify-center items-center rounded-2xl bg-whte w-full min-h-[90vh] bg-transparent">
        <div className="">
          <h1 className="txt-gr text-center font-bold text-6xl text-indigo-500">
            Seamless Role-Based Access
            <br />
            {/* <span className='text-4xl !text-slate-600'> simplified user management</span> */}
          </h1>
        </div>
        <div className="flex gap-4 mt-8">
          <Link to="/login">
            <button className="px-10 py-3 hover:bg-indigo-600 shadow-xl  transition-all border bg-white rounded-lg hover:text-white text-indigo-600 ">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-10 py-3 bg-indigo-600 shadow-xl transition-all  rounded-lg text-white hover:bg-white border hover:text-indigo-600 ">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home