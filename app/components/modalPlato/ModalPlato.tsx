import React, { useState, useEffect } from 'react';
import { Plato } from '../../../types';

interface Props {
  onClose: () => void;
  onCompleted: (plato: Plato) => void;
  idCategoria: number;
  index: number;
  editingPlato: Plato | null;
}

const ModalPlato: React.FC<Props> = ({ onClose, onCompleted, idCategoria, index, editingPlato }) => {
  const [plato, setPlato] = useState<Plato>(editingPlato || {
    id: 0,
    idCategoria: idCategoria,
    nombre: '',
    precio: 0,
    descripcion: '',
    orden: index,
    visible: true
  });
  useEffect(() => {
    setPlato(editingPlato || { id: 0, idCategoria: idCategoria, nombre: '', precio: 0, descripcion: '', orden: index, visible: true });
  }, [editingPlato, idCategoria, index]);

  const handlePlatoChange = (field: string, value: string | number) => {
    setPlato(prevState => ({ ...prevState, [field]: value }));
  };

  const handleAddPlato = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();

    try {
      const response = await fetch('/api/addPlato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plato }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const addedPlato = { ...plato, id: data.plato.plato_id };
      onCompleted(addedPlato);
      console.log(data);
    } catch (error) {
      console.error('An error occurred while adding the data.', error);
    }
  };

  const handleEditPlato = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();

    try {
      const response = await fetch('/api/editPlato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plato }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const updatedPlato = { ...plato, id: data.plato.plato_id };
      onCompleted(updatedPlato);
      console.log(data);
    } catch (error) {
      console.error('An error occurred while editing the data.', error);
    }
  };

  // Y ahora en el form puedes utilizar la función correspondiente de la siguiente manera:

  return (
    <form onSubmit={editingPlato ? handleEditPlato : handleAddPlato}>
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
      <button type="submit">{editingPlato ? 'Actualizar plato' : 'Agregar plato'}</button>
      <button onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default ModalPlato;