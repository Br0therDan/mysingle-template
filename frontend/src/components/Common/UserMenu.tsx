
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaUserAstronaut } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import { Link } from "@tanstack/react-router";
import useAuth from "../../hooks/useAuth";

export default function UserMenu() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Desktop only */}
      <div className="hidden md:block fixed top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="p-2 rounded-full bg-primary text-white" aria-label="User Menu">
              <FaUserAstronaut />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <FiUser />
                My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 font-bold flex items-center gap-2"
            >
              <FiLogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
