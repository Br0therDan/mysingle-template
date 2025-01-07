
import useAuth from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CiLogout, CiUser } from "react-icons/ci";
import { useState } from 'react';
import { formatName } from '@/utils/formatName';
import { Link } from '@tanstack/react-router';



export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout()
  };

  return (
    <div className="relative">
      {user && (
        <>
          <Avatar onClick={handleToggleDropdown} className="cursor-pointer h-7 w-7">
            <AvatarImage src={user.profile?.avatar_url} alt={user.profile?.first_name} />
            <AvatarFallback>{formatName(user.full_name)}</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="absolute right-0 p-3 mt-2 w-60 space-y-2 bg-white border rounded-md shadow-lg z-20">
              <div className=" flex px-4 py-2 gap-3 text-sm text-gray-700">
                <div>
                  <Avatar
                    onClick={handleToggleDropdown}
                    className="cursor-pointer h-9 w-9"
                  >
                    <AvatarImage src={user.profile?.avatar_url} alt={user.profile?.first_name} />
                    <AvatarFallback>{formatName(user.full_name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{user.full_name}</h1>
                  <h1 className="block text-xs text-gray-500">{user.email}</h1>
                </div>
              </div>
              <div className="border-t"></div>
              <ul>
                <li className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"> 
                  <Link to='/settings' className='flex'>
                    <CiUser className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                </li>
                <li
                  className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <CiLogout className="h-5 w-5 mr-2" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}