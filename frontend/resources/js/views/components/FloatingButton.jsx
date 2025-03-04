export default function FloatingButton({ onClick }) {
  return (
    <div className="fixed left-4 bottom-4 z-50">
      <button
        onClick={onClick}
        className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none"
      >
        <span className="text-2xl">⚙️</span>
      </button>
    </div>
  );
}
