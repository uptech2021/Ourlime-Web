import React from 'react';
import Link from 'next/link';

const SettingsSidebar = () => {
  return (
    <div className="bg-gray-800 text-white hidden md:block">
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
  );
};

export default SettingsSidebar;
