import { useEffect, useState } from "react";
// Import the logo as a URL since it's a static asset
const trekLogo = "/lovable-uploads/9dd1e66d-925e-4cb2-9533-410bd7596c77.png";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <img 
            src={trekLogo} 
            alt="Trek A Tour" 
            className="w-80 h-auto mx-auto animate-bounce"
          />
        </div>
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-adventure transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-muted-foreground text-sm">Loading your adventure...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;