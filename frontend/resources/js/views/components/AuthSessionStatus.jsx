export default function AuthSessionStatus({ status, className, children }) {
  return (
    status && (
      <div
        className={`font-medium text-sm text-green-600 dark:text-green-400 ${className}`}
      >
        {status}
      </div>
    )
  );
}
