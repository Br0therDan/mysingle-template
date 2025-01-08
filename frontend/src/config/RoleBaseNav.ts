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
      roles: ['Superuser', 'User'] 
    },
    { 
      name: 'Items', 
      icon: Gift, 
      href: '/items',
      roles: ['Superuser', 'User'] 
    },
    { 
      name: 'Profile', 
      icon: Building2,
      href: '/profile',
      roles: ['Superuser', 'User'] 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      href: '/settings',
      roles: ['Superuser', 'User'] 
    },
    { 
      name: 'Admin', 
      icon: UsersRound, 
      href: '/admin',
      roles: ['Superuser'] 
    },
]