export default function DateInput({
    id,
    name,
    value = '',
    required = false,
    className = '',
    label,
    error,
    ...props
  }) {
    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${required ? 'required' : ''}`}>
            {label}
          </label>
        )}
        <input
          id={id}
          type="date"
          name={name}
          defaultValue={value}
          required={required}
          className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  }