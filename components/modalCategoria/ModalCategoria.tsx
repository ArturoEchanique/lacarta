// ModalCategoria.tsx
import React, { useState } from 'react';
import { Categoria } from '../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta

interface Props {
  onClose: () => void;
  onCategoriaAdded: (categoria: Categoria) => void;
  idCarta: number;
  index:number;
}

const ModalCategoria: React.FC<Props> = ({ onClose, onCategoriaAdded, idCarta, index }) => {
  const [categoria, setCategoria] = useState<Categoria>({ id: 0, nombre: '', platos: [], orden: index });

  const handleCategoriaChange = (field: string, value: string) => {
    setCategoria(prevState => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
    try {
      const response = await fetch('/api/addCategoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idCarta, categoria }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Actualiza el objeto categoria con el ID recibido del servidor
      const updatedCategoria = { ...categoria, id: data.categoria.categoria_id };
  
      onCategoriaAdded(updatedCategoria);
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
          <input type="text" value={categoria.nombre} onChange={(e) => handleCategoriaChange('nombre', e.target.value)} required />
        </label>
      </div>
      <button type="submit">Agregar categoría</button>
      <button onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default ModalCategoria;
