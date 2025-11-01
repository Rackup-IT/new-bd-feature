import { useEffect, useState } from "react";

import { cn } from "../../utils/utils";

interface SnackbarProps {
  message: string;
  className?: string;
  duration?: number;
}

export default function SnackBar(props: SnackbarProps) {
  const [isShowing, setIsShowing] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowing(false);
    }, props.duration || 3000);
    return () => clearTimeout(timer);
  }, [isShowing, props.duration]);

  return (
    <div
      className={cn(
        "bg-amber-300 absolute -bottom-20 left-1/2 -translate-x-1/2 px-10 py-2 rounded-full transition-all duration-500",
        isShowing ? "bottom-12" : "-bottom-20",
        props.className
      )}
    >
      <p className="font-semibold">{props.message}</p>
    </div>
  );
}
