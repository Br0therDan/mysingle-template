// src/components/layout/Header.tsx

import SearchBar from "../buttons/SearchBar";
import Notification from "../buttons/Notification";
import UserButton from "../buttons/UserButton";

import { MobileSidebar } from './mobile-sidebar';
import { MyLogo } from '../brand/logo';


export default function Header() {

  return (
    <header className='fixed w-full bg-[#083344]'>
      <div className="flex items-center text-white py-2">
        <MobileSidebar />
        <div className="flex-shrink-0 items-center px-3 hidden sm:flex">
          <MyLogo color="dark" className='w-10 h-10'/>
        </div>
        <SearchBar />
        <div className="hidden gap-1 pr-4 lg:ml-4 sm:flex sm:items-center">
          <Notification />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
