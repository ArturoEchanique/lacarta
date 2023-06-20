// ModalCategoria.tsx
import React, { useState } from 'react';

type Categoria = {
  nombre: string;
};

interface Props {
    onClose: () => void;
    onCategoriaAdded: () => void;
    idCarta: number; // Añadido aquí
}

const ModalCategoria: React.FC<Props> = ({ onClose, onCategoriaAdded, idCarta }) => {
  const [categoria, setCategoria] = useState<Categoria>({ nombre: '' });

  const handleCategoriaChange = (field: string, value: string) => {
    setCategoria(prevState => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      console.log(data);
      onCategoriaAdded(); 
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
          <input type="text" value={categoria.nombre} onChange={(e) => handleCategoriaChange('nombre', e.target.value)} required />
        </label>
      </div>
      <button type="submit">Agregar categoría</button>
      <button onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default ModalCategoria;
