import React, { TextareaHTMLAttributes, useState } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className={`space-y-1 ${className}`}>
                <div className="relative group">
                    <textarea
                        ref={ref}
                        className={`
              block w-full text-slate-900 dark:text-white bg-surface-variant/30 dark:bg-slate-800 rounded-t-lg border-b-2 
              appearance-none focus:outline-none focus:ring-0 peer transition-all resize-none
              pt-6 pb-2 px-4 min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-slate-500
              ${error
                                ? 'border-red-500 focus:border-red-600'
                                : 'border-slate-400 dark:border-slate-700 focus:border-primary-600 dark:focus:border-primary-400'
                            }
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
                        className={`
              absolute duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4
              cursor-text pointer-events-none transition-all
              ${error ? 'text-red-500 peer-focus:text-red-600' : 'text-slate-500 dark:text-slate-400 peer-focus:text-primary-600 dark:peer-focus:text-primary-400'}
            `}
                    >
                        {label}
                    </label>
                </div>
                {error && <span className="text-xs text-red-500 pl-4">{error}</span>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
