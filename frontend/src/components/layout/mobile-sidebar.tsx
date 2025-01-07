
import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu } from 'lucide-react'
import { menuItems } from '@/config/RoleBaseNav'
import Logo from '../buttons/Logo';
import { MyLogo } from '../brand/logo';


export function MobileSidebar() {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="block sm:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4">
          <MyLogo color="light" className='w-12 h-12'/>
        </div>
        <ScrollArea className="flex-1">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}