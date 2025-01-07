// src/types/ui.ts
  import { LucideIcon } from 'lucide-react';

  export interface MenuItem {
    name: string;
    icon: LucideIcon;
    href: string;
    roles: string[];
  }
  
  export interface EntityListProps<T> {
    entities: T[];
    columns: (keyof T)[];
    onAdd: () => void;
    onRowClick: (entity: T) => void;
  }
  
  export interface BreadcrumbItems {
    label: string;
    href: string;
  }
