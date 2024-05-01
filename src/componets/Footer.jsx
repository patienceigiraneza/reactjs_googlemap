import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { FiBell } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-teal-300 to-lime-300 min-h-14 fixed inset-x-0 bottom-0">
      <div className="flex justify-between ">
        <div className="w-1/3 m-auto flex justify-center items-center">
          <FiHeart className="text-white  mt-4 text-2xl cursor-pointer" />
        </div>

        <div className="w-1/3 m-auto flex justify-center items-center">
          {" "}
          <FiAlertCircle  className="text-white  mt-4 text-2xl cursor-pointer" />{" "}
        </div>

        <div className="w-1/3 m-auto flex justify-center items-center">
          {" "}
          <FiBell className="text-white  mt-4 text-2xl cursor-pointer" />{" "}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
