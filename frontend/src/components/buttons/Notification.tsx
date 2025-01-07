
import { Button } from '@/components/ui/button'
import { FaRegBell } from "react-icons/fa";

export default function Notification() {
  return (
    <div>
        <Button variant="ghost" className='hover:bg-cyan-900' size="icon">
            <span className="sr-only">View notifications</span>
            <FaRegBell className="h-5 w-5" aria-hidden="true" />
        </Button>
    </div>
  )
}


