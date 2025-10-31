import { LabelHTMLAttributes, ReactNode } from 'react';

type LabelVariant = 'default' | 'small' | 'inline';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  variant?: LabelVariant;
  required?: boolean;
  children: ReactNode;
}

const variantStyles: Record<LabelVariant, string> = {
  default: 'block text-sm font-medium text-gray-700 mb-1',
  small: 'text-sm text-gray-600',
  inline: 'flex items-center gap-2 cursor-pointer',
};

export default function Label({
  variant = 'default',
  required = false,
  children,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
