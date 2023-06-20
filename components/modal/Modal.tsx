import React, { useState } from 'react';

type Plato = {
  nombre: string;
  description: string;
  precio: number;
};

interface Props {
    onClose: () => void;
    onPlatoAdded: () => void;
    idCategoria: number; // Añadido aquí
}
  
const Modal: React.FC<Props> = ({ onClose, onPlatoAdded, idCategoria }) => { // Y aquí
  const [plato, setPlato] = useState<Plato>({ nombre: '', description: '', precio: 0});
  
  const handlePlatoChange = (field: string, value: string | number) => {
    setPlato(prevState => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Hacer una solicitud POST a la ruta API
      const response = await fetch('/api/addPlato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Incluir las categorias en el cuerpo de la solicitud
        body: JSON.stringify({ idCategoria, plato }), // idCategoria es ahora accesible
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aquí puedes manejar la respuesta si todo va bien
      const data = await response.json();
      console.log(data);
      onPlatoAdded(); // Llama a la función cuando se añade un plato
    } catch (error) {
      console.error('An error occurred while fetching the data.', error);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nombre:
          <input type="text" value={plato.nombre} onChange={(e) => handlePlatoChange('nombre', e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Precio:
          <input type="number" value={plato.precio} onChange={(e) => handlePlatoChange('precio', Number(e.target.value))} required />
        </label>
      </div>
      <div>
        <label>
          Ingredientes:
          <input type="text" value={plato.description} onChange={(e) => handlePlatoChange('description', e.target.value)} required />
        </label>
      </div>
      <button type="submit">Agregar plato</button>
      <button onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default Modal;
