interface ToolbarDividerProps {
  className?: string;
}

const ToolbarDivider = ({ className = "mx-2" }: ToolbarDividerProps) => {
  return <div className={`w-px h-6 bg-gray-200 ${className}`} />;
};

export default ToolbarDivider;
