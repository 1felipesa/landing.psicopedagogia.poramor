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
            primary: "bg-primary text-on-primary shadow-sm hover:shadow active:scale-[0.98] focus:ring-primary md3-ripple",
            secondary: "bg-primary-container text-on-primary-container hover:bg-primary-container/80 focus:ring-primary md3-ripple",
            outline: "border border-outline text-on-surface hover:bg-surface-variant focus:ring-primary md3-ripple",
            ghost: "text-on-surface hover:bg-surface-variant focus:ring-primary md3-ripple",
            danger: "bg-error text-on-error shadow-sm hover:shadow active:scale-[0.98] focus:ring-error md3-ripple",
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
