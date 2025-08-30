import { CheckCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../../components/loading-spinner/loading_spinner";
import { cn } from "../../../utils/utils";

interface StatusDropDownProps {
  current: string | undefined;
  onChange: (newStatus: string) => void;
  onDelete: () => void;
  isLoading?: boolean;
  showSuccess?: boolean;
  lastUpdated?: string;
}

export default function StatusDropDown(props: StatusDropDownProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(props.current || "Draft");
  const ref = useRef<HTMLDivElement>(null);

  // Handle status change with debouncing
  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (isLoading) return;

      // Optimistic update
      setCurrentStatus(newStatus);
      setIsLoading(true);
      setShowSuccess(false);

      // Call the parent handler
      props.onChange(newStatus);
    },
    [isLoading, props]
  );

  // Reset loading and success states
  useEffect(() => {
    if (props.isLoading) {
      setIsLoading(true);
      setShowSuccess(false);
    } else if (props.showSuccess) {
      setIsLoading(false);
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1200);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setShowSuccess(false);
    }
  }, [props.isLoading, props.showSuccess]);

  // Update current status if prop changes
  useEffect(() => {
    setCurrentStatus(props.current || "Draft");
  }, [props]);

  // Handle click outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Get status color classes
  const getStatusClasses = (status: string) => {
    return cn(
      "px-3 py-1 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 relative",
      status === "Published" && "bg-green-500 text-white focus:ring-green-500",
      status === "Draft" && "bg-gray-500 text-white focus:ring-gray-500",
      isLoading && "opacity-70 cursor-wait",
      showSuccess && "ring-2 ring-green-500"
    );
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <div className="relative group">
        {/* Status pill with tooltip */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={getStatusClasses(currentStatus)}
          aria-label={`Current status: ${currentStatus}. Click to change.`}
          aria-busy={isLoading}
          aria-live="polite"
        >
          <span className="flex items-center justify-center gap-1">
            {isLoading ? (
              <LoadingSpinner className="w-4 h-4" />
            ) : showSuccess ? (
              <CheckCircle
                data-testid="check-circle"
                className="w-4 h-4 text-white"
              />
            ) : null}
            {currentStatus}
          </span>

          {/* Tooltip for last updated */}
          {props.lastUpdated && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Last updated: {new Date(props.lastUpdated).toLocaleString()}
            </div>
          )}
        </button>
      </div>

      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10 overflow-hidden">
          {/* Published option */}
          <li>
            <button
              onClick={() => {
                handleStatusChange("Published");
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2",
                currentStatus === "Published" &&
                  "bg-gray-100 text-green-600 font-medium"
              )}
              aria-label="Set status to Published"
              disabled={isLoading}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  currentStatus === "Published" ? "bg-green-500" : "bg-gray-300"
                )}
              ></span>
              Published
            </button>
          </li>

          {/* Draft option */}
          <li>
            <button
              onClick={() => {
                handleStatusChange("Draft");
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2",
                currentStatus === "Draft" &&
                  "bg-gray-100 text-gray-600 font-medium"
              )}
              aria-label="Set status to Draft"
              disabled={isLoading}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  currentStatus === "Draft" ? "bg-gray-500" : "bg-gray-300"
                )}
              ></span>
              Draft
            </button>
          </li>

          {/* Divider */}
          <li className="h-px bg-gray-200 my-1" role="separator" />

          {/* Delete option - visually separated */}
          <li>
            <button
              onClick={() => {
                props.onDelete();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 flex items-center gap-2"
              aria-label="Delete this post"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
