import { MenuItem } from '@/types/ui'
import { 
    Home,
    Settings,
    UsersRound,
    Gift,
    Building2,

  } from 'lucide-react'
  

  export const menuItems: MenuItem[] = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      href: '/',
      roles: ['admin', 'parent', 'child'] 
    },
    { 
      name: 'Items', 
      icon: Gift, 
      href: '/items',
      roles: ['admin', 'parent', 'child'] 
    },
    { 
      name: 'Profile', 
      icon: Building2,
      href: '/edit-profile',
      roles: ['admin', 'parent', 'child'] 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      href: '/settings',
      roles: ['admin', 'parent', 'child'] 
    },
    { 
      name: 'Admin', 
      icon: UsersRound, 
      href: '/admin',
      roles: ['admin', 'parent', 'child'] 
    },
]