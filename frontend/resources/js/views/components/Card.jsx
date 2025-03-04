import { Link } from "@inertiajs/react";

export default function Card({
  title,
  description,
  phone,
  province,
  canton,
  address,
  profilePhoto,
  userId,
}) {
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 max-w-xs w-full h-[350px]">
      <div className="flex items-center gap-4">
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Teléfono:</strong> {phone}
        </p>
        <p>
          <strong>Provincia:</strong> {province}
        </p>
        <p>
          <strong>Cantón:</strong> {canton}
        </p>
        <p>
          <strong>Dirección:</strong> {address}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Link
          href={route("profile.show", userId)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
        >
          Ver Perfil
        </Link>
        <Link
          href={route("quotations.create", { chamberoId: userId })}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-center"
        >
          Cotizar
        </Link>
      </div>
    </div>
  );
}
