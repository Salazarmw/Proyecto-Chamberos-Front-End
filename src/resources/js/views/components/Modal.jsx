import { useEffect, useState } from "react";

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
};

export default function Modal({
  name,
  show = false,
  maxWidth = "2xl",
  children,
  focusable = false,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(show);

  useEffect(() => {
    setIsOpen(show);
    if (show) {
      document.body.classList.add("overflow-y-hidden");
      if (focusable) {
        setTimeout(() => {
          const firstFocusable = modalRef.current?.querySelector(
            'a, button, input:not([type="hidden"]), textarea, select, details, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }, 100);
      }
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [show, focusable]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
    }
  };

  return (
    <div
      className={`fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div
        className="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
        onClick={() => {
          setIsOpen(false);
          onClose?.();
        }}
      />

      <div
        className={`mb-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full ${maxWidthClasses[maxWidth]} sm:mx-auto`}
      >
        {children}
      </div>
    </div>
  );
}
