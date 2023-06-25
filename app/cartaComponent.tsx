'use client';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-headless-accordion";
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
      console.error('An error occurred while updating category order.', error);
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
      console.error('An error occurred while updating plato order.', error);
    }
  }

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

  const handleDeleteCategoria = async (idCategoria: number) => {
    const categoriaIndex = carta.categorias.findIndex((cat) => cat.id === idCategoria);
    const categoriaToDelete = carta.categorias[categoriaIndex];

    // remove categoria from UI immediately
    setCarta(prevCarta => {
      const newCarta = { ...prevCarta };
      newCarta.categorias.splice(categoriaIndex, 1);
      return newCarta;
    });

    try {
      const response = await fetch(`/api/deleteCategoria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idCategoria }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while deleting categoria.', error);
      // if deletion fails, add the categoria back to UI
      setCarta(prevCarta => {
        const newCarta = { ...prevCarta };
        newCarta.categorias.splice(categoriaIndex, 0, categoriaToDelete);
        return newCarta;
      });
    }
  }

  const handleDeletePlato = async (idPlato: number, categoriaId: number) => {
    const categoriaIndex = carta.categorias.findIndex((cat) => cat.id === categoriaId);
    const platoIndex = carta.categorias[categoriaIndex].platos.findIndex(plato => plato.id === idPlato);
    const platoToDelete = carta.categorias[categoriaIndex].platos[platoIndex];

    // remove plato from UI immediately
    setCarta(prevCarta => {
      const newCarta = { ...prevCarta };
      newCarta.categorias[categoriaIndex].platos.splice(platoIndex, 1);
      return newCarta;
    });

    try {
      const response = await fetch(`/api/deletePlato`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idPlato }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while deleting plato.', error);
      // if deletion fails, add the plato back to UI
      setCarta(prevCarta => {
        const newCarta = { ...prevCarta };
        newCarta.categorias[categoriaIndex].platos.splice(platoIndex, 0, platoToDelete);
        return newCarta;
      });
    }
  }

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
              <Accordion>
                {carta.categorias.map((categoria, index) => (
                  <Draggable key={categoria.id} draggableId={String(categoria.id)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <AccordionItem>
                          <AccordionHeader>
                            <div className="flex justify-between items-center">
                              <h2 className="text-xl font-bold mb-4">{categoria.nombre}</h2>
                              <button onClick={() => handleDeleteCategoria(categoria.id)}>Borrar categoria</button>
                            </div>
                          </AccordionHeader>
                          <AccordionBody>
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
                                                <button onClick={() => handleDeletePlato(plato.id, categoria.id)}>Borrar plato</button>                                              </div>
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
                          </AccordionBody>
                        </AccordionItem>
                      </div>
                    )}
                  </Draggable>
                ))}
              </Accordion>
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
