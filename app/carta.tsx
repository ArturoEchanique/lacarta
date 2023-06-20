'use client';
import React, { useState, useEffect } from 'react';
import ModalContainer from '../components/modalContainer/ModalContainer';

interface Carta {
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

export default function Carta({ carta, onPlatoAdded }: { carta: Carta, onPlatoAdded: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [categoriaID, setCategoriaID] = useState<number | null>(null); 

  const handleOpenModal = (id: number) => {
    setCategoriaID(id); 
    setShowModal(true);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">{carta.nombre}</h1>
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
                <button onClick={() => handleOpenModal(categoria.id)}>Agregar plato</button> {/* Pasa el ID de la categoría al manejador de eventos */}
              </div>
            </div>
          ))}
        </div>
        {showModal && categoriaID !== null && <ModalContainer idCategoria={categoriaID} onClose={() => {setShowModal(false); setCategoriaID(null);}} onPlatoAdded={onPlatoAdded} />}
      </div>
    </div>
  );
}