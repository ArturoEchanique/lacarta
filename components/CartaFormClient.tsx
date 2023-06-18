// CartaFormClient.tsx
'use client';
import { useState, FC } from 'react';

type Plato = {
  nombre: string;
  description: string;
  precio: number;
};

type Categoria = {
  nombre: string;
  orden: number;
  platos: Plato[];
};

const CartaFormClient: FC<{ idCarta: number }> = ({ idCarta }) => {
  const [nombre, setNombre] = useState('');
  // const [platos, setPlatos] = useState<Plato[]>([{ nombre: '', description: '', precio: 0 }]);
  const [categorias, setCategorias] = useState<Categoria[]>([{ nombre: '', orden: 0, platos: [{ nombre: '', description: '', precio: 0 }] }]);

  // Handle category changes
  const handleCategoriaChange = (index: number, value: string) => {
    const newCategorias = [...categorias];
    newCategorias[index].nombre = value;
    setCategorias(newCategorias);
  };

  // Handle platillo changes within categories
  const handlePlatoChange = (indexCategoria: number, indexPlato: number, nombre: string, description: string, precio: number) => {
    const newCategorias = [...categorias];
    newCategorias[indexCategoria].platos[indexPlato].nombre = nombre;
    newCategorias[indexCategoria].platos[indexPlato].description = description;
    newCategorias[indexCategoria].platos[indexPlato].precio = precio;
    setCategorias(newCategorias);
  };

  // Add a new platillo to a specific category
  const addPlato = (indexCategoria: number) => {
    const newCategorias = [...categorias];
    newCategorias[indexCategoria].platos.push({ nombre: '', description: '', precio: 0 });
    setCategorias(newCategorias);
  };

  // Add a new category
  const addCategoria = () => {
    setCategorias([...categorias, { nombre: '', orden: categorias.length + 1, platos: [{ nombre: '', description: '', precio: 0 }] }]);
  };

  const handleDeletePlatos = async () => {
    // Hacer una solicitud DELETE a la ruta API para borrar los platos
    const response = await fetch(`/api/deletePlatos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Incluir los platos en el cuerpo de la solicitud
      body: JSON.stringify({ idCarta }),
    });

    // Actualizar el estado de platos a un array vacío
    // setPlatos([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // console.log({ nombre, idCarta, categorias });

    try {
      // Hacer una solicitud POST a la ruta API
      const response = await fetch('/api/updateCarta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Incluir las categorias en el cuerpo de la solicitud
        body: JSON.stringify({ nombre, idCarta, categorias }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aquí puedes manejar la respuesta si todo va bien
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while fetching the data.', error);
    }
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
      {categorias.map((categoria, indexCategoria) => (
        <div key={indexCategoria}>
          <label>
            Nombre de la Categoria:
            <input
              type="text"
              value={categoria.nombre}
              onChange={(e) => handleCategoriaChange(indexCategoria, e.target.value)}
            />
          </label>
          {categoria.platos.map((plato, indexPlato) => (
            <div key={indexPlato}>
              <label>
                Nombre del Plato:
                <input
                  type="text"
                  value={plato.nombre}
                  onChange={(e) => handlePlatoChange(indexCategoria, indexPlato, e.target.value, plato.description, plato.precio)}
                />
              </label>
              <label>
                Ingredientes:
                <input
                  type="text"
                  value={plato.description}
                  onChange={(e) => handlePlatoChange(indexCategoria, indexPlato, plato.nombre, e.target.value, plato.precio)}
                />
              </label>
              <label>
                Precio:
                <input
                  type="number"
                  value={plato.precio}
                  onChange={(e) => handlePlatoChange(indexCategoria, indexPlato, plato.nombre, plato.description, Number(e.target.value))}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={() => addPlato(indexCategoria)}>
            Añadir Plato
          </button>
        </div>
      ))}
      <button type="button" onClick={addCategoria}>
        Añadir Categoria
      </button>
      <button type="button" onClick={handleDeletePlatos}>
        Borrar Platos
      </button>
      <input type="submit" value="Guardar Carta" />
    </form>
  );
};

export default CartaFormClient;