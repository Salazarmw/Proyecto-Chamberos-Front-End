export default function DropdownRegister({
  id,
  name,
  label,
  options = [],
  required = false,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
        {...props}
      >
        <option value="">Seleccione {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
}
