export const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-blue-300 border-t-blue-600 animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
