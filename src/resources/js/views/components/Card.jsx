import { Link } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function Card({ user }) {
  // Si no hay usuario, no renderizar nada
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[450px]">
      {/* Imagen de perfil */}
      <div className="flex justify-center pt-8">
        <div className="w-32 h-32 rounded-full border-4 border-indigo-600 dark:border-indigo-400 overflow-hidden shadow-lg">
          {user.profile_photo ? (
            <img
              src={user.profile_photo}
              alt={`${user.name} ${user.lastname}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://chambero-profile-bucket.s3.us-east-2.amazonaws.com/Profile_avatar_placeholder_large.png"
              alt="Imagen por defecto"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Contenedor principal con scroll personalizado */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-600 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-indigo-400">
        {/* Información del usuario */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate text-center">
            {user.name} {user.lastname}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate text-center">
            {user.email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate text-center">
            {user.phone}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 text-center">
            {user.address}
          </p>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1 justify-center">
            {user.tags?.map((tag) => (
              <span
                key={tag._id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Botones - Siempre en la parte inferior */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <Link to={`/profile/${user._id}`} className="flex-1 min-w-[120px]">
            <PrimaryButton className="w-full">Ver Perfil</PrimaryButton>
          </Link>
          <Link to={`/quotations/create/${user._id}`} className="flex-1 min-w-[120px]">
            <SecondaryButton className="w-full">Cotizar</SecondaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
