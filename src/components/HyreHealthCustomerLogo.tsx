import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const HyreHealthCustomerLogo: React.FC<LogoProps> = ({
  className = "",
  size = "medium",
}) => {
  const sizeClasses = {
    small: "h-8",
    medium: "w-auto",
    large: "h-16",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Hyre Health Customer"
        className={`${sizeClasses[size]} object-contain`}
        width={100}
        height={100}
      />
    </div>
  );
};

export default HyreHealthCustomerLogo;
