import { InputHTMLAttributes, forwardRef } from 'react';

type InputVariant = 'default' | 'small';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  error?: string;
}

const variantStyles: Record<InputVariant, string> = {
  default: 'w-full border rounded px-3 py-2',
  small: 'w-full border rounded px-3 py-2 text-sm',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', error, className = '', ...props }, ref) => {
    const baseStyles = 'focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors';
    const errorStyles = error ? 'border-red-500' : 'border-gray-300';
    
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
