import { useState, useEffect } from "react";

export default function CheckboxGroup({
  options = [],
  selected: initialSelected = [],
  name = "tags",
  max = null,
  showSelectAll = true,
  className = "",
}) {
  const [selectedItems, setSelectedItems] = useState(initialSelected);

  const handleCheck = (id) => {
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];

    if (max && newSelected.length > max) {
      alert(`Solo puedes seleccionar un máximo de ${max} elementos`);
      return;
    }

    setSelectedItems(newSelected);
  };

  return (
    <div
      className={`border border-gray-300 dark:border-gray-700 rounded-md p-4 overflow-y-auto max-h-72 relative max-w-sm mx-auto ${className}`}
      style={{ scrollbarWidth: "thin", scrollbarColor: "#a0aec0 #edf2f7" }}
    >
      {options.map((option) => (
        <div
          key={option.id}
          className="flex items-center gap-4 p-4 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition last:border-b-0"
        >
          <input
            type="checkbox"
            id={`checkbox-${option.id}`}
            name={`${name}[]`}
            value={option.id}
            checked={selectedItems.includes(option.id)}
            onChange={() => handleCheck(option.id)}
            className="h-5 w-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-700 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 mr-2"
          />
          <label
            htmlFor={`checkbox-${option.id}`}
            className="text-gray-700 dark:text-gray-300 flex-1"
          >
            {option.description}
          </label>
        </div>
      ))}
    </div>
  );
}
