import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputLabel from "../components/InputLabel";
import TextInput from "../components/TextInput";
import InputError from "../components/InputError";
import DropdownRegister from "../components/DropdownRegister";
import DateInput from "../components/DateInput";
import PhoneInputCR from "../components/PhoneInputCR";
import axios from "../../config/axios";
import {
  fetchProvinces,
  fetchCantons,
} from "../../../../services/locationService";

export default function ChamberoRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    address: "",
    birth_date: new Date().toISOString().split("T")[0],
    password: "",
    password_confirmation: "",
    tags: [],
  });

  const [cantons, setCantons] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [message, setMessage] = useState(null);

  // Function to check if user is at least 18 years old
  const isAdult = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  // Function to validate phone number
  const validatePhone = async (phone) => {
    try {
      const response = await axios.get(`/api/auth/check-phone/${phone}`);
      return !response.data.exists; // Returns true if phone is available
    } catch (error) {
      console.error("Error checking phone:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitial(true);
      try {
        const provincesResponse = await axios.get("/api/provinces");
        setProvinces(
          provincesResponse.data.map((province) => ({
            value: province._id,
            label: province.name,
          }))
        );

        const tagsResponse = await axios.get("/api/tags");
        console.log("Tags response:", tagsResponse.data);
        const tagsData = tagsResponse.data.tags || tagsResponse.data;
        setAvailableTags(tagsData);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError(
          "Error al cargar los datos iniciales. Por favor, recargue la página."
        );
      } finally {
        setLoadingInitial(false);
      }
    };

    loadInitialData();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setFormData({
      ...formData,
      province: provinceId,
      canton: "",
    });

    if (provinceId) {
      try {
        const response = await axios.get(`/api/cantons/province/${provinceId}`);
        setCantons(
          response.data.map((canton) => ({
            value: canton._id,
            label: canton.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching cantons:", error);
        setError("Error al cargar los cantones.");
      }
    } else {
      setCantons([]);
    }
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => {
      if (prev.tags.includes(tagId)) {
        return {
          ...prev,
          tags: prev.tags.filter((id) => id !== tagId),
        };
      }
      return {
        ...prev,
        tags: [...prev.tags, tagId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});
    setMessage(null);

    // Validate age
    if (!isAdult(formData.birth_date)) {
      setErrors({ birth_date: "Debes ser mayor de 18 años para registrarte" });
      setLoading(false);
      return;
    }

    // Validate phone number
    const isPhoneAvailable = await validatePhone(formData.phone);
    if (!isPhoneAvailable) {
      setErrors({ phone: "Este número de teléfono ya está registrado" });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Las contraseñas no coinciden" });
      setLoading(false);
      return;
    }

    if (formData.tags.length === 0) {
      setErrors({
        tags: "Debe seleccionar al menos una categoría de servicio",
      });
      setLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        user_type: "chambero",
      };

      console.log("Registrando chambero:", userData);

      const response = await axios.post("/api/auth/register", userData);
      console.log("Respuesta del registro:", response.data);

      setMessage(
        "Registro exitoso. Por favor, verifica tu correo electrónico para activar tu cuenta."
      );
      setFormData({
        name: "",
        lastname: "",
        email: "",
        phone: "",
        province: "",
        canton: "",
        address: "",
        birth_date: new Date().toISOString().split("T")[0],
        password: "",
        password_confirmation: "",
        tags: [],
      });
    } catch (error) {
      console.error("Error en el registro:", error);

      if (error.response) {
        console.log("Error response:", error.response);

        if (error.response.data) {
          if (error.response.data.errors) {
            setErrors(error.response.data.errors);
          } else {
            setError(error.response.data.message || "Error en el registro");
          }
        } else {
          setError(
            `Error ${error.response.status}: ${error.response.statusText}`
          );
        }
      } else if (error.request) {
        setError("No se recibió respuesta del servidor. Verifica tu conexión.");
      } else {
        setError("Ocurrió un error durante el registro. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      {/* Name */}
      <div>
        <InputLabel htmlFor="name" value="Nombre" />
        <TextInput
          id="name"
          name="name"
          value={formData.name}
          className="block mt-1 w-full"
          autoComplete="name"
          autoFocus={true}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <InputError message={errors.name} className="mt-2" />}
      </div>

      {/* Last Name */}
      <div className="mt-4">
        <InputLabel htmlFor="lastname" value="Apellido" />
        <TextInput
          id="lastname"
          name="lastname"
          value={formData.lastname}
          className="block mt-1 w-full"
          autoComplete="lastname"
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value })
          }
        />
        {errors.lastname && (
          <InputError message={errors.lastname} className="mt-2" />
        )}
      </div>

      {/* Email */}
      <div className="mt-4">
        <InputLabel htmlFor="email" value="Correo electrónico" />
        <TextInput
          id="email"
          type="email"
          name="email"
          value={formData.email}
          className="block mt-1 w-full"
          autoComplete="username"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <InputError message={errors.email} className="mt-2" />}
      </div>

      {/* Phone */}
      <div className="mt-4">
        <PhoneInputCR
          value={formData.phone}
          onChange={(phone) => setFormData({ ...formData, phone: phone })}
          error={errors.phone}
        />
      </div>

      {/* Province */}
      <div className="mt-4">
        <InputLabel htmlFor="province" value="Provincia" />
        <DropdownRegister
          id="province"
          name="province"
          value={formData.province}
          options={provinces}
          onChange={handleProvinceChange}
        />
        {errors.province && (
          <InputError message={errors.province} className="mt-2" />
        )}
      </div>

      {/* Canton */}
      <div className="mt-4">
        <InputLabel htmlFor="canton" value="Cantón" />
        <DropdownRegister
          id="canton"
          name="canton"
          value={formData.canton}
          options={cantons}
          onChange={(e) => setFormData({ ...formData, canton: e.target.value })}
        />
        {errors.canton && (
          <InputError message={errors.canton} className="mt-2" />
        )}
      </div>

      {/* Address */}
      <div className="mt-4">
        <InputLabel htmlFor="address" value="Dirección" />
        <TextInput
          id="address"
          name="address"
          value={formData.address}
          className="block mt-1 w-full"
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        {errors.address && (
          <InputError message={errors.address} className="mt-2" />
        )}
      </div>

      {/* Tags/Categorías */}
      <div className="mt-4">
        <InputLabel htmlFor="tags" value="Servicios ofrecidos" />
        <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 dark:border-gray-700 rounded-md">
          {loadingInitial ? (
            <p className="text-gray-500 italic col-span-2">
              Cargando categorías...
            </p>
          ) : availableTags && availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <label key={tag._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag._id)}
                  onChange={() => handleTagChange(tag._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {tag.name}
                </span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 italic col-span-2">
              No hay categorías disponibles
            </p>
          )}
        </div>
        {errors.tags && <InputError message={errors.tags} className="mt-2" />}
      </div>

      {/* Birth Date */}
      <div className="mt-4">
        <InputLabel htmlFor="birth_date" value="Fecha de nacimiento" />
        <DateInput
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={(e) =>
            setFormData({ ...formData, birth_date: e.target.value })
          }
        />
        {errors.birth_date && (
          <InputError message={errors.birth_date} className="mt-2" />
        )}
      </div>

      {/* Password */}
      <div className="mt-4">
        <InputLabel htmlFor="password" value="Contraseña" />
        <TextInput
          id="password"
          type="password"
          name="password"
          value={formData.password}
          className="block mt-1 w-full"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {errors.password && (
          <InputError message={errors.password} className="mt-2" />
        )}
      </div>

      {/* Password Confirmation */}
      <div className="mt-4">
        <InputLabel
          htmlFor="password_confirmation"
          value="Confirmar contraseña"
        />
        <TextInput
          id="password_confirmation"
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          className="block mt-1 w-full"
          onChange={(e) =>
            setFormData({ ...formData, password_confirmation: e.target.value })
          }
        />
        {errors.password_confirmation && (
          <InputError message={errors.password_confirmation} className="mt-2" />
        )}
      </div>

      {/* Error general */}
      {error && (
        <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Mensaje de éxito */}
      {message && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
          {message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end mt-4">
        <Link
          to="/login"
          className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          ¿Ya estás registrado?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="ml-4 inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </div>
    </form>
  );
}
