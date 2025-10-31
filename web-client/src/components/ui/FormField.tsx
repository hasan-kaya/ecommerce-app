import { InputHTMLAttributes, forwardRef } from 'react';
import Label from './Label';
import Input from './Input';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  variant?: 'default' | 'small';
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, variant = 'default', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <Label required={required} variant={variant === 'small' ? 'small' : 'default'}>
          {label}
        </Label>
        <Input
          ref={ref}
          error={error}
          variant={variant}
          className={className}
          {...props}
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
