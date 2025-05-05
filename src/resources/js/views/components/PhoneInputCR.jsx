import React from 'react';
import TextInput from './TextInput';
import InputLabel from './InputLabel';
import InputError from './InputError';
import crFlag from '../../../img/cr-flag.png'; // Asegúrate de tener esta imagen

const PhoneInputCR = ({ value, onChange, error, id = "phone", label = "Teléfono", className = "" }) => {
  // Función para manejar cambios y validar solo números y un máximo de 8 dígitos
  const handleChange = (e) => {
    const input = e.target.value;
    // Eliminar cualquier caracter que no sea número
    const numbersOnly = input.replace(/\D/g, '');
    // Limitar a 8 dígitos
    const formatted = numbersOnly.slice(0, 8);
    
    // Llamar al onChange con el valor formateado (sin guiones para almacenamiento)
    onChange(formatted);
  };

  // Formatear el valor para mostrarlo con guión
  const formatDisplayValue = (val) => {
    if (!val) return '';
    
    // Si tiene 5 o más dígitos, insertar guión después del cuarto dígito
    if (val.length > 4) {
      return `${val.substring(0, 4)}-${val.substring(4)}`;
    }
    
    return val;
  };

  return (
    <div className={className}>
      {label && <InputLabel htmlFor={id} value={label} />}
      
      <div className="relative mt-1">
        {/* Wrapper para el input y la bandera */}
        <div className="absolute left-0 top-0 h-full flex items-center pl-2 z-10">
          <div className="flex items-center">
            <img 
              src={crFlag} 
              alt="Costa Rica" 
              className="w-5 h-3 mr-1" 
            />
            <span className="text-gray-400 text-sm mr-2">+506</span>
          </div>
        </div>
        
        <TextInput
          id={id}
          name={id}
          value={formatDisplayValue(value)}
          className="pl-20 w-full" // Aumentado el padding izquierdo
          onChange={handleChange}
          autoComplete="tel"
          placeholder="XXXX-XXXX"
          maxLength={9} // 8 dígitos + 1 guión
        />
      </div>
      
      {error && <InputError message={error} className="mt-2" />}
    </div>
  );
};

export default PhoneInputCR; 