// src/components/layout/Header.tsx

import SearchBar from "../buttons/SearchBar";
import Notification from "../buttons/Notification";
import UserButton from "../buttons/UserButton";
import { MobileSidebar } from "./mobile-sidebar";
import { MyLogo, MyLogoDark } from "../brand/logo";
import { ThemeToggle } from "../buttons/theme-toggle";

export default function Header() {
  return (
    <header className="bg-background bg-opacity-70 sticky top-0 z-40 w-full border-b border-gray-300">
      <div className="flex items-center py-2">
        <MobileSidebar />
        <div className="relative mx-3 hidden sm:block">
          <MyLogo className='size-10' />
          <MyLogoDark className='size-10'/>
        </div>
        <SearchBar />
        <div className="hidden gap-2 pr-4 lg:ml-4 sm:flex sm:items-center">
          <Notification />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
