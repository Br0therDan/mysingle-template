  // src/types/forms.ts
  export interface Field {
    name: string;
    type: 'text' | 'number' | 'email' | 'textarea' | 'select';
    options?: string[];  // For select fields
  }
  
  export interface EntityFormProps<T> {
    entity: Partial<T>;
    fields: Field[];
    onSubmit: (entity: T) => void;
    onCancel: () => void;
  }
