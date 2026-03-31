import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        children,
        className = '',
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        disabled,
        ...props
    }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md3-1 hover:shadow-md3-2 active:scale-[0.98] focus:ring-primary-600",
            secondary: "bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-900/60 text-primary-900 dark:text-primary-300 focus:ring-primary-500",
            outline: "border border-outline dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-surface-variant dark:hover:bg-slate-800 focus:ring-slate-500",
            ghost: "text-slate-600 dark:text-slate-400 hover:bg-surface-variant dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:ring-slate-500",
            danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow active:scale-[0.98] focus:ring-red-600",
        };

        const sizes = {
            sm: "text-xs px-3 py-1.5 gap-1.5",
            md: "text-sm px-5 py-2.5 gap-2",
            lg: "text-base px-8 py-3.5 gap-2.5",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" size={size === 'lg' ? 20 : 16} />}
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
