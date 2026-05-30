"use client";

import { useState } from "react";
import Link from "next/link";

const MainHeader = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="border-b border-cyber-gray-border py-4 px-8 flex items-center justify-between sticky top-0 bg-white z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-tighter">cyber</h1>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="grow  max-w-md mx-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </span>
          <input
            className="block w-full pl-10 pr-3 py-2 border-none bg-gray-100 rounded-lg focus:ring-0 text-sm outline-none"
            placeholder="Search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-500">
        <Link className="text-black" href="/">
          Home
        </Link>
        <Link className="hover:text-black transition" href="#">
          About
        </Link>
        <Link className="hover:text-black transition" href="#">
          Contact Us
        </Link>
        <Link className="hover:text-black transition" href="#">
          Blog
        </Link>
      </nav>

      {/* Icons */}
      <div className="flex items-center space-x-6 ml-8">
        {/* Wishlist */}
        <button className="text-gray-600 hover:text-black transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
        {/* Cart */}
        <button className="text-gray-600 hover:text-black transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
        {/* User */}
        <button className="text-gray-600 hover:text-black transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
