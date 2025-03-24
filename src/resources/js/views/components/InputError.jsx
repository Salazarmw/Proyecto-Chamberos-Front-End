export default function InputError({ message, className = "" }) {
  return (
    <div
      className={`text-sm text-red-600 dark:text-red-400 space-y-1 ${className}`}
    >
      {message}
    </div>
  );
}
