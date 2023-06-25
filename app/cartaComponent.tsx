'use client';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-headless-accordion";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import React, { useState, useEffect } from 'react';
import { Categoria, Carta, Plato } from '../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import ModalContainerPlato from '../components/modalContainerPlato/ModalContainerPlato';
import ModalContainerCategoria from '../components/modalContainerCategoria/ModalContainerCategoria';

export default function CartaComponent({ carta: initialCarta }: { carta: Carta }) {
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

  async function toggleCategoriaVisibility(categoriaId: number) {
    const categoriaIndex = carta.categorias.findIndex((cat) => cat.id === categoriaId);
    const updatedCategoria = { ...carta.categorias[categoriaIndex], visible: !carta.categorias[categoriaIndex].visible };

    // Update the UI immediately
    setCarta(prevCarta => {
      const newCarta = { ...prevCarta };
      newCarta.categorias[categoriaIndex] = updatedCategoria;
      return newCarta;
    });

    // Send a request to the backend
    try {
      const response = await fetch('/api/updateCategoriaVisibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idCategoria: updatedCategoria.id, visible: updatedCategoria.visible }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while updating the category visibility.', error);
    }
  }

  async function togglePlatoVisibility(platoId: number, categoriaId: number) {
    const categoriaIndex = carta.categorias.findIndex((cat) => cat.id === categoriaId);
    const platoIndex = carta.categorias[categoriaIndex].platos.findIndex(plato => plato.id === platoId);
    const updatedPlato = { ...carta.categorias[categoriaIndex].platos[platoIndex], visible: !carta.categorias[categoriaIndex].platos[platoIndex].visible };

    // Update the UI immediately
    setCarta(prevCarta => {
      const newCarta = { ...prevCarta };
      newCarta.categorias[categoriaIndex].platos[platoIndex] = updatedPlato;
      return newCarta;
    });

    // Send a request to the backend
    try {
      const response = await fetch('/api/updatePlatoVisibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idPlato: updatedPlato.id, visible: updatedPlato.visible }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('An error occurred while updating the dish visibility.', error);
    }
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
      setCarta(prevCarta => {
        const newCarta = { ...prevCarta };
        newCarta.categorias[categoriaIndex].platos.splice(platoIndex, 1);
        return newCarta;
      });
      console.log(data);
    } catch (error) {
      console.error('An error occurred while deleting plato.', error);
      // if deletion fails, add the plato back to UI
      // setCarta(prevCarta => {
      //   const newCarta = { ...prevCarta };
      //   newCarta.categorias[categoriaIndex].platos.splice(platoIndex, 0, platoToDelete);
      //   return newCarta;
      // });
    }
  }

  const onPlatoAdded = (plato: Plato) => {
    // Encuentra la categoría a la que se debe agregar el plato
    const categoriaIndex = carta.categorias.findIndex((cat) => cat.id === plato.idCategoria);
    if (categoriaIndex === -1) {
      console.error('La categoría no se encontró en la carta.');
      return;
    }

    // Agrega el plato a la categoría y actualiza el estado de la carta
    setCarta(prevCarta => {
      const newCarta = { ...prevCarta };
      newCarta.categorias[categoriaIndex].platos.push(plato);
      return newCarta;
    });
  }

  const onCategoriaAdded = (categoria: Categoria) => {

    setCarta(prevCarta => {
      const newCarta = { ...prevCarta };
      newCarta.categorias.push(categoria);
      return newCarta;
    });
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
                        <AccordionItem key={categoria.id} isActive={categoria.platos.length < 4}>
                          <AccordionHeader>
                            <div className="flex justify-between items-center" style={{ opacity: categoria.visible ? 1 : 0.5 }}>
                              <h2 className="text-xl font-bold mb-4">{categoria.nombre}</h2>
                              <button onClick={() => handleDeleteCategoria(categoria.id)}>Borrar categoria</button>
                              <button onClick={() => toggleCategoriaVisibility(categoria.id)}>
                                {categoria.visible ? 'Ocultar' : 'Mostrar'} categoría
                              </button>
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
                                              <div className="flex items-center justify-between mb-4" key={plato.nombre} style={{ opacity: plato.visible ? 1 : 0.5 }}>
                                                <div className="flex items-center">
                                                  <div className="w-10 h-10 bg-gray-400 rounded-full mr-4" />
                                                  <div>
                                                    <h3 className="font-semibold">{plato.nombre}</h3>
                                                    <p className="text-gray-600">{plato.descripcion}</p>
                                                  </div>
                                                </div>
                                                <p className="font-semibold">{plato.precio}</p>
                                                <button onClick={() => handleDeletePlato(plato.id, categoria.id)}>Borrar plato</button>
                                                <button onClick={() => togglePlatoVisibility(plato.id, categoria.id)}>
                                                  {plato.visible ? 'Ocultar' : 'Mostrar'} plato
                                                </button>
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
        <ModalContainerPlato
          idCategoria={categoriaID}
          index={carta.categorias.find(cat => cat.id === categoriaID)?.platos.length || 0}
          onClose={() => { setShowModalPlato(false); setCategoriaID(null); }}
          onPlatoAdded={onPlatoAdded}
        />
      }
      {showModalCategoria && carta.id !== null &&
        <ModalContainerCategoria
          idCarta={carta.id}
          index={carta.categorias.length || 0}
          onClose={() => { setShowModalCategoria(false); }}
          onCategoriaAdded={onCategoriaAdded}
        />
      }
    </>
  );
}
