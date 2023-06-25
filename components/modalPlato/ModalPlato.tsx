import React, { useState } from 'react';
import { Plato } from '../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta


interface Props {
  onClose: () => void;
  onPlatoAdded: (plato: Plato) => void;
  idCategoria: number; // Añadido aquí
  index: number;
}

const ModalPlato: React.FC<Props> = ({ onClose, onPlatoAdded, idCategoria, index }) => { // Y aquí
  const [plato, setPlato] = useState<Plato>({ id: 0, idCategoria: idCategoria, nombre: '', precio: 0, descripcion: '', orden: index });

  const handlePlatoChange = (field: string, value: string | number) => {
    setPlato(prevState => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
    try {
      // Hacer una solicitud POST a la ruta API
      const response = await fetch('/api/addPlato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Incluir las categorias en el cuerpo de la solicitud
        body: JSON.stringify({ plato }), // idCategoria es ahora accesible
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aquí puedes manejar la respuesta si todo va bien
      const data = await response.json();
      onPlatoAdded(plato); // Llama a la función cuando se añade un plato
      console.log(data);
    } catch (error) {
      console.error('An error occurred while fetching the data.', error);
    }
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
          descripcion:
          <input type="text" value={plato.descripcion} onChange={(e) => handlePlatoChange('descripcion', e.target.value)} required />
        </label>
      </div>
      <button type="submit">Agregar plato</button>
      <button onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default ModalPlato;
