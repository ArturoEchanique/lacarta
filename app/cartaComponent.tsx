'use client';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import React, { useState, useEffect } from 'react';
import { Categoria, Carta, Plato } from '../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import ModalContainer from '../components/modalContainerPlato/ModalContainerPlato';
import ModalContainerCategoria from '../components/modalContainerCategoria/ModalContainerCategoria';

export default function CartaComponent({ carta: initialCarta, onPlatoAdded, onCategoriaAdded }: { carta: Carta, onPlatoAdded: () => void, onCategoriaAdded: () => void }) {
  const [showModalPlato, setShowModalPlato] = useState(false);
  const [categoriaID, setCategoriaID] = useState<number | null>(null);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [carta, setCarta] = useState<Carta>(initialCarta);

  useEffect(() => {
    setCarta(initialCarta);
  }, [initialCarta]);

  const handleOpenModalCategoria = () => {
    setShowModalCategoria(true);
  };

  const handleOpenModalPlato = (id: number) => {
    setCategoriaID(id);
    setShowModalPlato(true);
  };

  const handleOnDragEndCategoria = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(carta.categorias);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({ ...item, orden: index }));

    setCarta((prevCarta) => ({ ...prevCarta, categorias: updatedItems }));
    updateCategoryOrder(updatedItems);
  }

  const handleOnDragEndPlato = (categoryId: number) => (result: DropResult) => {
    if (!result.destination) return;

    const categoryIndex = carta.categorias.findIndex((cat) => cat.id === categoryId);
    const items = Array.from(carta.categorias[categoryIndex].platos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({ ...item, orden: index }));

    setCarta((prevCarta) => {
      const newCategories = [...prevCarta.categorias];
      newCategories[categoryIndex] = { ...newCategories[categoryIndex], platos: updatedItems };
      return { ...prevCarta, categorias: newCategories };
    });

    updatePlatoOrder(updatedItems);
  }

  async function updateCategoryOrder(categorias: Categoria[]) {
    try {
      const response = await fetch('/api/updateCategoriaOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categorias }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while fetching the data.', error);
    }
  }

  async function updatePlatoOrder(platos: Plato[]) {
    try {
      const response = await fetch('/api/updatePlatoOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platos }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while fetching the data.', error);
    }  }

    const handleDeletePlatos = async (cartaid: number) => {
      // Hacer una solicitud DELETE a la ruta API para borrar los platos
      const response = await fetch(`/api/deletePlatos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Incluir los platos en el cuerpo de la solicitud
        body: JSON.stringify({ cartaid }),
      });
  
      // Actualizar el estado de platos a un array vacío
      // setPlatos([]);
    };

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">{carta.nombre}</h1>
        <button onClick={handleOpenModalCategoria}>Agregar categoría</button>
        <button onClick={() => handleDeletePlatos(carta.id)}>Borrar Platos</button>
      </div>
      
      <DragDropContext onDragEnd={handleOnDragEndCategoria}>
        <Droppable droppableId="categorias">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {carta.categorias.map((categoria, index) => (
                <Draggable key={categoria.id} draggableId={String(categoria.id)} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <h2 className="text-xl font-bold mb-4">{categoria.nombre}</h2>
                      <div className="bg-gray-200 p-4 rounded-lg">
                        <DragDropContext onDragEnd={handleOnDragEndPlato(categoria.id)}>
                          <Droppable droppableId={`platos-${categoria.id}`}>
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef}>
                                {categoria.platos.map((plato, index) => (
                                  <Draggable key={plato.nombre} draggableId={plato.nombre} index={index}>
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                        <button onClick={() => handleOpenModalPlato(categoria.id)}>Agregar plato</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {showModalPlato && categoriaID !== null &&
        <ModalContainer
          idCategoria={categoriaID}
          onClose={() => { setShowModalPlato(false); setCategoriaID(null); }}
          onPlatoAdded={onPlatoAdded}
        />
      }
      {showModalCategoria && carta.id !== null &&
        <ModalContainerCategoria
          idCarta={carta.id}
          onClose={() => { setShowModalCategoria(false); }}
          onCategoriaAdded={onCategoriaAdded}
        />
      }
    </>
  );
}
