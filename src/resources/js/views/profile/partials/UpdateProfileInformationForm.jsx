import { useState, useRef, useContext, useEffect } from "react";
import InputLabel from "../../components/InputLabel";
import TextInput from "../../components/TextInput";
import InputError from "../../components/InputError";
import PrimaryButton from "../../components/PrimaryButton";
import { AuthContext } from "../../../../../context/AuthContext";
import axios from "../../../../../config/axios";

export default function UpdateProfileInformationForm({ user, tags, onUpdate }) {
  const { updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    province: "",
    canton: "",
    address: "",
    birth_date: "",
    tags: [],
    profile_photo: null,
  });

  const [provinces, setProvinces] = useState([]);
  const [cantons, setCantons] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Cargar provincias al montar el componente
    fetchProvinces();
  }, []);

  useEffect(() => {
    // Cargar cantones cuando cambie la provincia
    if (formData.province) {
      fetchCantons(formData.province);
    }
  }, [formData.province]);

  useEffect(() => {
    // Actualizar el formulario cuando cambien los datos del usuario
    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        province: user.province || "",
        canton: user.canton || "",
        address: user.address || "",
        birth_date: user.birth_date ? formatDate(user.birth_date) : "",
        tags: user.tags?.map((tag) => tag._id) || [],
        profile_photo: null,
      });
    }
  }, [user]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("/api/provinces");
      setProvinces(response.data);
      console.log("Provincias cargadas:", response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCantons = async (provinceId) => {
    try {
      const response = await axios.get(`/api/cantons/province/${provinceId}`);
      setCantons(response.data);
      console.log("Cantones cargados:", response.data);
    } catch (error) {
      console.error("Error fetching cantons:", error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (type === "checkbox") {
      const tagId = parseInt(value);

      if (checked) {
        // Limit to 10 tags
        if (formData.tags.length < 10) {
          setFormData({
            ...formData,
            tags: [...formData.tags, tagId],
          });
        }
      } else {
        setFormData({
          ...formData,
          tags: formData.tags.filter((id) => id !== tagId),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const sendVerificationEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/email/verification-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setEmailVerificationSent(true);
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data object for file upload
    const submitData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        // Convertir los IDs a string antes de enviarlos
        formData[key].forEach((tagId) => {
          submitData.append("tags[]", tagId.toString());
        });
      } else if (key === "profile_photo" && formData[key]) {
        submitData.append(key, formData[key]);
      } else if (key === "birth_date") {
        // Ensure date is in the correct format
        const formattedDate = new Date(formData[key]).toISOString().split('T')[0];
        submitData.append(key, formattedDate);
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Log para depuración
    console.log("Datos a enviar:", {
      name: submitData.get("name"),
      lastname: submitData.get("lastname"),
      email: submitData.get("email"),
      phone: submitData.get("phone"),
      province: submitData.get("province"),
      canton: submitData.get("canton"),
      address: submitData.get("address"),
      birth_date: submitData.get("birth_date"),
      tags: submitData.getAll("tags[]"),
      profile_photo: submitData.get("profile_photo"),
    });

    try {
      // Convertir FormData a objeto plano para enviar como JSON
      const data = {};
      submitData.forEach((value, key) => {
        if (key === "tags[]") {
          if (!data.tags) data.tags = [];
          data.tags.push(value);
        } else {
          data[key] = value;
        }
      });

      const response = await axios.put("/api/users/me", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setStatus("profile-updated");
        
        // Actualizar el contexto global
        updateUser(response.data);
        
        // Recargar los datos
        onUpdate();

        // Hide status message after 2 seconds
        setTimeout(() => {
          setStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    }
  };

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Profile Information
        </h2>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update your account's profile information and email address.
        </p>
      </header>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {/* Error general */}
        {errors.general && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {errors.general}
          </div>
        )}

        {/* Name field */}
        <div>
          <InputLabel htmlFor="name" value="Name" />
          <TextInput
            id="name"
            name="name"
            type="text"
            className="mt-1 block w-full"
            value={formData.name}
            onChange={handleInputChange}
            required
            autoFocus
          />
          <InputError messages={errors.name} className="mt-2" />
        </div>

        {/* Last name field */}
        <div>
          <InputLabel htmlFor="lastname" value="Last Name" />
          <TextInput
            id="lastname"
            name="lastname"
            type="text"
            className="mt-1 block w-full"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.lastname} className="mt-2" />
        </div>

        {/* Email field */}
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.email} className="mt-2" />

          {user && user.email_verified_at === null && (
            <div>
              <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                Your email address is unverified.
                <button
                  onClick={sendVerificationEmail}
                  className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ml-1"
                >
                  Click here to re-send the verification email.
                </button>
              </p>

              {emailVerificationSent && (
                <p className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                  A new verification link has been sent to your email address.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Telephone field */}
        <div>
          <InputLabel htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            name="phone"
            type="text"
            className="mt-1 block w-full"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.phone} className="mt-2" />
        </div>

        {/* Province field */}
        <div>
          <InputLabel htmlFor="province" value="Province" />
          <select
            id="province"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
            required
          >
            <option value="">Select a province</option>
            {provinces.map((province) => (
              <option key={`province-${province._id}`} value={province._id}>
                {province.name}
              </option>
            ))}
          </select>
          <InputError messages={errors.province} className="mt-2" />
        </div>

        {/* Canton field */}
        <div>
          <InputLabel htmlFor="canton" value="Canton" />
          <select
            id="canton"
            name="canton"
            value={formData.canton}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
            required
            disabled={!formData.province}
          >
            <option value="">Select a canton</option>
            {cantons.map((canton) => (
              <option key={`canton-${canton._id}`} value={canton._id}>
                {canton.name}
              </option>
            ))}
          </select>
          <InputError messages={errors.canton} className="mt-2" />
        </div>

        {/* Address field */}
        <div>
          <InputLabel htmlFor="address" value="Address" />
          <TextInput
            id="address"
            name="address"
            type="text"
            className="mt-1 block w-full"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.address} className="mt-2" />
        </div>

        {/* Birth date field */}
        <div>
          <InputLabel htmlFor="birth_date" value="Birth Date" />
          <TextInput
            id="birth_date"
            name="birth_date"
            type="date"
            className="mt-1 block w-full"
            value={formData.birth_date}
            onChange={handleInputChange}
            required
          />
          <InputError messages={errors.birth_date} className="mt-2" />
        </div>

        {/* Chambero Tags Section (Only for Chambero type users) */}
        {user && user.user_type === "chambero" && (
          <div>
            <InputLabel htmlFor="tags" value="Servicios ofrecidos" />
            <div className="mt-2 max-h-[200px] overflow-y-auto p-4 border border-gray-300 dark:border-gray-700 rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-600 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-indigo-400">
              <div className="grid grid-cols-2 gap-3">
                {tags.map((tag) => (
                  <label key={tag._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag._id}
                      checked={formData.tags.includes(tag._id)}
                      onChange={handleInputChange}
                      className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <InputError messages={errors.tags} className="mt-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Selecciona hasta 10 etiquetas que describan tus habilidades y servicios profesionales.
            </p>
          </div>
        )}

        {/* Profile photo field */}
        <div>
          <InputLabel htmlFor="profile_photo" value="Profile Photo" />
          <input
            type="file"
            id="profile_photo"
            name="profile_photo"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleInputChange}
            className="mt-1 block w-full text-gray-700 dark:text-gray-300"
          />
          {user && user.profile_photo && (
            <img
              src={`/storage/${user.profile_photo}`}
              alt="Profile Photo"
              className="mt-2 rounded-full h-20 w-20 object-cover"
            />
          )}
          <InputError messages={errors.profile_photo} className="mt-2" />
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <PrimaryButton type="submit">Save</PrimaryButton>

          {status === "profile-updated" && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
          )}
        </div>
      </form>
    </section>
  );
}
