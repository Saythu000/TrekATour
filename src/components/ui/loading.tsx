import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const Loading = ({ size = "md", text, className }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const PageLoading = ({ text = "Loading..." }: { text?: string }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loading size="lg" text={text} />
  </div>
);

export const ButtonLoading = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex items-center gap-2">
    <Loading size="sm" />
    <span>{text}</span>
  </div>
);
