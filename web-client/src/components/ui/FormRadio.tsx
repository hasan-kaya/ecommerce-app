import { InputHTMLAttributes, ReactNode } from 'react';

interface FormRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | ReactNode;
  description?: string;
  variant?: 'default' | 'card';
}

export default function FormRadio({
  label,
  description,
  variant = 'default',
  className = '',
  children,
  ...props
}: FormRadioProps) {
  const variantStyles = {
    default: 'flex items-center gap-2 cursor-pointer',
    card: 'flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50',
  };

  return (
    <label className={`${variantStyles[variant]} ${className}`}>
      <input
        type="radio"
        className={variant === 'card' ? 'mt-1' : ''}
        {...props}
      />
      <div className="flex-1">
        {typeof label === 'string' ? (
          <>
            <div className={variant === 'card' ? 'font-semibold' : ''}>{label}</div>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </>
        ) : (
          label
        )}
        {children}
      </div>
    </label>
  );
}
