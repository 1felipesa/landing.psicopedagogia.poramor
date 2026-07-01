import React, { InputHTMLAttributes, useState, useId } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: string;
    isPassword?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon: Icon, error, isPassword, className = '', type = 'text', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const [isFocused, setIsFocused] = useState(false);
        const id = useId();

        // Determine input type based on isPassword prop
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className={`space-y-1 ${className}`}>
                <div className="relative group">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Icon
                                className={`h-5 w-5 transition-colors duration-200 ${isFocused || props.value ? 'text-primary' : 'text-on-surface-variant/60'}`}
                            />
                        </div>
                    )}

                    <input
                        id={id}
                        ref={ref}
                        type={inputType}
                        className={`
              block w-full text-on-surface bg-surface-variant/20 border border-outline/20 rounded-2xl
              focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm
              pt-6 pb-2 placeholder:text-transparent
              ${Icon ? 'pl-11' : 'px-4'}
              ${isPassword ? 'pr-12' : 'pr-4'}
              ${error ? 'border-error focus:border-error' : ''}
            `}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />

                    <label
                        htmlFor={id}
                        className={`
              absolute transition-all duration-300 pointer-events-none
              ${Icon ? 'left-11' : 'left-4'}
              ${isFocused || props.value 
                  ? 'top-1.5 text-[10px] uppercase tracking-widest font-bold text-primary' 
                  : 'top-1/2 -translate-y-1/2 text-sm font-medium text-on-surface-variant/70'}
              ${error && (isFocused || props.value) ? 'text-error' : ''}
            `}
                    >
                        {label}
                    </label>

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface p-1 transition-colors"
                        >
                            {showPassword ? (
                                // EyeOff Icon
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                    <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                            ) : (
                                // Eye Icon
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
                {error && <span className="text-xs text-error pl-4">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
