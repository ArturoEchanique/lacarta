'use client';
import React, { useState, useEffect } from 'react';
import ModalContainer from '../components/modalContainerPlato/ModalContainerPlato';
import ModalContainerCategoria from '../components/modalContainerCategoria/ModalContainerCategoria';

interface Carta {
  id: number
  nombre: string;
  categorias: Categoria[];
}

interface Categoria {
  id: number; // Asegúrate de que el objeto de la categoría tiene un campo 'id'
  nombre: string;
  platos: Plato[];
}

interface Plato {
  nombre: string;
  precio: number;
  ingredientes: string;
}

export default function Carta({ carta, onPlatoAdded, onCategoriaAdded }: { carta: Carta, onPlatoAdded: () => void, onCategoriaAdded: () => void }) {  
  const [showModalPlato, setShowModalPlato] = useState(false);
  const [categoriaID, setCategoriaID] = useState<number | null>(null); 
  const [showModalCategoria, setShowModalCategoria] = useState(false);

  const handleOpenModalCategoria = () => {
    setShowModalCategoria(true);
  };
  
  const handleOpenModalPlato = (id: number) => {
    setCategoriaID(id); 
    setShowModalPlato(true);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">{carta.nombre}</h1>
          <button onClick={handleOpenModalCategoria}>Agregar categoría</button>
        </div>
        <div className="mt-8">
          {carta.categorias.map((categoria) => (
            <div key={categoria.nombre}>
              <h2 className="text-xl font-bold mb-4">{categoria.nombre}</h2>
              <div className="bg-gray-200 p-4 rounded-lg">
                {categoria.platos.map((plato) => (
                  <div className="flex items-center justify-between mb-4" key={plato.nombre}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full mr-4" />
                      <div>
                        <h3 className="font-semibold">{plato.nombre}</h3>
                        <p className="text-gray-600">{plato.ingredientes}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{plato.precio}</p>
                  </div>
                ))}
                <button onClick={() => handleOpenModalPlato(categoria.id)}>Agregar plato</button> {/* Pasa el ID de la categoría al manejador de eventos */}
              </div>
            </div>
          ))}
        </div>
        {showModalPlato && categoriaID !== null && <ModalContainer idCategoria={categoriaID} onClose={() => {setShowModalPlato(false); setCategoriaID(null);}} onPlatoAdded={onPlatoAdded} />}
        {showModalCategoria && carta.id !== null && <ModalContainerCategoria idCarta={carta.id} onClose={() => {setShowModalCategoria(false);}} onCategoriaAdded={onCategoriaAdded} />}
      </div>
    </div>
  );
}