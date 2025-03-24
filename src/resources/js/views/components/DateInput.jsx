export default function DateInput({ id, name, value, onChange }) {
  return (
    <input
      type="date"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
    />
  );
}
