import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

type SelectVariant = 'default' | 'small';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  error?: string;
  children: ReactNode;
}

const variantStyles: Record<SelectVariant, string> = {
  default: 'w-full border rounded px-3 py-2',
  small: 'border rounded px-3 py-2 text-sm',
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'default', error, className = '', children, ...props }, ref) => {
    const baseStyles = 'focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors bg-white';
    const errorStyles = error ? 'border-red-500' : 'border-gray-300';
    
    return (
      <div className={variant === 'default' ? 'w-full' : ''}>
        <select
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
