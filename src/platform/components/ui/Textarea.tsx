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
              block w-full text-on-surface bg-surface-variant/20 border border-outline/20 rounded-2xl
              focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none
              pt-6 pb-2 px-4 min-h-[120px] placeholder:text-transparent
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
                        className={`
              absolute transition-all duration-300 pointer-events-none left-4
              ${isFocused || props.value 
                  ? 'top-1.5 text-[10px] uppercase tracking-widest font-bold text-primary' 
                  : 'top-4 text-sm font-medium text-on-surface-variant/70'}
              ${error && (isFocused || props.value) ? 'text-error' : ''}
            `}
                    >
                        {label}
                    </label>
                </div>
                {error && <span className="text-xs text-error pl-4">{error}</span>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
