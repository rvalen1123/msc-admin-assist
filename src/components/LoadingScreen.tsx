import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Loading screen component displayed during data fetching or authentication
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center p-8 mx-auto space-y-4">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium text-gray-700">{message}</h2>
      </div>
    </div>
  );
};

export default LoadingScreen; 