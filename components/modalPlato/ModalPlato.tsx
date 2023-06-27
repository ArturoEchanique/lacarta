import React, { useState, useEffect } from 'react';
import { Plato } from '../../types';

interface Props {
  onClose: () => void;
  onPlatoEdited: (plato: Plato) => void;
  idCategoria: number;
  index: number;
  editingPlato: Plato | null;
}

const ModalPlato: React.FC<Props> = ({ onClose, onPlatoEdited, idCategoria, index, editingPlato }) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
    try {
      const endpoint = editingPlato ? '/api/editPlato' : '/api/addPlato';
      const response = await fetch(endpoint, {
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
      onPlatoEdited(updatedPlato);
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
      <button type="submit">{editingPlato ? 'Actualizar plato' : 'Agregar plato'}</button>
      <button onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default ModalPlato;