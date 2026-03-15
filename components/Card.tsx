
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20 ${className}`}>
      {children}
    </div>
  );
};

export default Card;