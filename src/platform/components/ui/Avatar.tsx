import React from 'react';

interface AvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
    const getInitials = (fullName: string) => {
        const names = fullName.trim().split(/\s+/);
        if (names.length === 0) return '?';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0).toUpperCase();
        const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

        return `${firstInitial}${lastInitial}`;
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm': return 'text-[10px]';
            case 'md': return 'text-xs';
            case 'lg': return 'text-base';
            case 'xl': return 'text-xl';
            default: return 'text-xs';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'w-8 h-8';
            case 'md': return 'w-10 h-10';
            case 'lg': return 'w-12 h-12';
            case 'xl': return 'w-16 h-16';
            default: return 'w-10 h-10';
        }
    };

    // Generate a consistent color based on name
    const getColor = (name: string) => {
        const colors = [
            'bg-primary-600',
            'bg-purple-600',
            'bg-blue-600',
            'bg-indigo-600',
            'bg-pink-600',
            'bg-teal-600'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div
            className={`
        ${getSizeClasses()} 
        ${getColor(name)} 
        rounded-full flex items-center justify-center text-white font-bold 
        shadow-sm flex-shrink-0 border-2 border-white
        ${className}
      `}
        >
            <span className={getFontSize()}>
                {getInitials(name)}
            </span>
        </div>
    );
};

export default Avatar;
