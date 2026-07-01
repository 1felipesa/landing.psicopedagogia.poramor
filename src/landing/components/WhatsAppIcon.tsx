import React from 'react';

interface WhatsAppIconProps {
  size?: number;
  className?: string;
}

const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ size = 24, className = '' }) => (
  <img
    src="/whatsapp-icon.svg"
    alt="WhatsApp"
    width={size}
    height={size}
    className={className}
    loading="eager"
  />
);

export default WhatsAppIcon;
