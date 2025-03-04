export default function InputError({ messages = [], className = "" }) {
  return messages?.length > 0 ? (
    <ul
      className={`text-sm text-red-600 dark:text-red-400 space-y-1 ${className}`}
    >
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  ) : null;
}
