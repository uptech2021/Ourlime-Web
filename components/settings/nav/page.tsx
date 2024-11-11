import React, { useState } from 'react';
import Link from 'next/link';

const SettingsSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4 bg-[#1e2321] text-white">
        <button onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isOpen ? (
            <svg
              className="absolute bottom-0 right-0 cursor-pointer"
              width="50"
              height="50"
              viewBox="0 0 250 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M197.917 93.75V156.25"
                stroke="white"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M156.25 93.7497H125V52.083L52.0833 125L125 197.916V156.25H156.25V93.7497Z"
                stroke="white"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="nav-arrow fixed bottom-0 left-0 z-20 mb-5 cursor-pointer"
              width="50"
              height="50"
              viewBox="0 0 250 250"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M52.083 93.75V156.25"
                stroke="#027823"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M93.75 93.7502H125V52.0835L197.917 125L125 197.917V156.25H93.75V93.7502Z"
                stroke="#027823"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#1e2321] text-white z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        } md:hidden`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">SETTINGS</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings">General</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/notification">Notification Settings</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/social">Social Links</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">PROFILE</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/profile">Profile Settings</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/address">My Addresses</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/avatar">Avatar & Cover</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/download">My Information</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">SECURITY</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/privacy">Privacy</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/password">Password</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/manage">Manage Sessions</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/authentication">Two-factor authentication</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">EARNINGS</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/monetization">Monetization</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="#">My Affiliates</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">OTHER</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/blocked">Blocked Users</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/deleteuser">Delete Account</Link></li>
          </ul>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="bg-[#1e2321] text-white hidden md:block">
        <div className="p-4">
          <h2 className="text-lg font-semibold">SETTINGS</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings">General</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/notification">Notification Settings</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/social">Social Links</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">PROFILE</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/profile">Profile Settings</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/address">My Addresses</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/avatar">Avatar & Cover</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/download">My Information</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">SECURITY</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/privacy">Privacy</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/password">Password</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/manage">Manage Sessions</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/authentication">Two-factor authentication</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">EARNINGS</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/monetization">Monetization</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="#">My Affiliates</Link></li>
          </ul>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">OTHER</h2>
          <ul>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/blocked">Blocked Users</Link></li>
            <li className="py-2"><i className="icon-class"></i> <Link href="/settings/deleteuser">Delete Account</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SettingsSidebar;
