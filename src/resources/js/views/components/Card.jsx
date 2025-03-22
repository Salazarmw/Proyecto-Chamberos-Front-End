import { Link } from "react-router-dom";

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
  // Construir la URL de la foto de perfil
  const profilePhotoUrl = profilePhoto.startsWith("http")
    ? profilePhoto
    : `/storage/profile-photos/${profilePhoto}`;

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 max-w-xs w-full h-[350px]">
      <div className="flex items-center gap-4">
        <img
          src={profilePhotoUrl}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.src = "/storage/profile-photos/DefaultImage.jpeg";
          }}
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
          <strong>Teléfono:</strong> {phone || "No disponible"}
        </p>
        <p>
          <strong>Provincia:</strong> {province || "No disponible"}
        </p>
        <p>
          <strong>Cantón:</strong> {canton || "No disponible"}
        </p>
        <p>
          <strong>Dirección:</strong> {address || "No disponible"}
        </p>
      </div>

      <div className="mt-4 flex space-x-2">
        <Link
          to={`/profile/${userId}`}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
        >
          Ver Perfil
        </Link>

        <Link
          to={`/quotations/create?chamberoId=${userId}`}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-center"
        >
          Cotizar
        </Link>
      </div>
    </div>
  );
}
