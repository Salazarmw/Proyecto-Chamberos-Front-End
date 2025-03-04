import { useState, useRef, useEffect } from "react";

export default function Dropdown({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-white dark:bg-gray-700",
  trigger,
  children,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const alignmentClasses = {
    left: "ltr:origin-top-left rtl:origin-top-right start-0",
    top: "origin-top",
    right: "ltr:origin-top-right rtl:origin-top-left end-0",
  }[align];

  const widthClasses =
    {
      48: "w-48",
    }[width] || width;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div
          className={`absolute z-50 mt-2 ${widthClasses} rounded-md shadow-lg ${alignmentClasses}`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
