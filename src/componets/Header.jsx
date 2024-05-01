import React from "react";

function Header() {
  return (
    <div className="bg-gradient-to-br from-teal-200 to-lime-200 py-4 h-12 capitalize flex justify-between items-center w-full text-xl">
      <ul className="flex ml-4">
        <li className="px-4"> Track </li>
        <li className="px-4"> About </li>
      </ul>

      <div className="pr-16">Startup</div>
    </div>
  );
}

export default Header;
