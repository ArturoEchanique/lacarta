// CartaFormClient.tsx
'use client';
import { useState, FC } from 'react';

type Plato = {
  nombre: string;
  precio: number;
};

const CartaFormClient: FC<{idCarta: number}> = ({idCarta}) => {
  const [nombre, setNombre] = useState('');
  const [platos, setPlatos] = useState<Plato[]>([{ nombre: '', precio: 0 }]);

  const handleNombrePlatoChange = (index: number, value: string) => {
    const newPlatos = [...platos];
    newPlatos[index].nombre = value;
    setPlatos(newPlatos);
  };

  const handlePrecioPlatoChange = (index: number, value: number) => {
    const newPlatos = [...platos];
    newPlatos[index].precio = value;
    setPlatos(newPlatos);
  };

  const addPlato = () => {
    setPlatos([...platos, { nombre: 'sdfsdf', precio: 0 }]);
  };

  const handleDeletePlatos = async () => {
    // Hacer una solicitud DELETE a la ruta API para borrar los platos
    const response = await fetch(`/api/deletePlatos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Incluir los platos en el cuerpo de la solicitud
      body: JSON.stringify({idCarta}),
    });

    // Actualizar el estado de platos a un array vacío
    setPlatos([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Hacer una solicitud POST a la ruta API
    const response = await fetch('/api/updateCarta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Incluir los platos en el cuerpo de la solicitud
      body: JSON.stringify({ nombre, idCarta, platos }),
    });
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <label>
        Nombre de la Carta:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </label>
      {platos.map((plato, index) => (
        <div key={index}>
          <label>
            Nombre del Plato:
            <input
              type="text"
              value={plato.nombre}
              onChange={(e) => handleNombrePlatoChange(index, e.target.value)}
            />
          </label>
          <label>
            Precio del Plato:
            <input
              type="number"
              value={plato.precio}
              onChange={(e) => handlePrecioPlatoChange(index, Number(e.target.value))}
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={addPlato}>
        Añadir Plato
      </button>
      <button type="button" onClick={handleDeletePlatos}>
        Borrar Platos
      </button>
      <input type="submit" value="Guardar Carta" />
    </form>
  );
};

export default CartaFormClient;