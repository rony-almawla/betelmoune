import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="bg-white-800 text-black p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-lg font-bold hover:text-gray-400">
          Bel Elmouneh
        </Link>
      </div>
      <nav className="flex-grow">
        <ul className="flex justify-center space-x-4">
          <li>
            <Link to="/categories" className="hover:text-gray-400">
              Categories
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-400">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center">
        <div className="flex items-center bg-white text-gray-800 p-1 rounded mr-4">
          <CiSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="p-1 rounded outline-none bg-gray-200"
          />
        </div>

        <Link to="/signin">
          <button className="bg-blue-500 text-white py-1 px-3 rounded mr-2">
            Sign in
          </button>
        </Link>

        <Link to="/signup">
          <button className="bg-green-500 text-white py-1 px-3 rounded">
            Sign up
          </button>
        </Link>
      </div>
    </header>
  );
}
