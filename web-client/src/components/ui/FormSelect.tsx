import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import Label from './Label';
import Select from './Select';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  variant?: 'default' | 'small';
  children: ReactNode;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, variant = 'default', children, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <Label required={required} variant={variant === 'small' ? 'small' : 'default'}>
          {label}
        </Label>
        <Select
          ref={ref}
          error={error}
          variant={variant}
          className={className}
          {...props}
        >
          {children}
        </Select>
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
