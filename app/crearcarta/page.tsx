'use client';
import { useState, useEffect, FC } from 'react';
import CartaFormClient from '../../components/CartaFormClient';
import MetaCartaEdit from '../../components/metaCartaEdit/MetaCartaEdit';
import { Card, Title, Text } from '@tremor/react';
import Carta from '../carta';  // Asegúrate de tener un componente CartaTable

interface Carta {
  nombre: string;
  categorias: Categoria[];
}

interface Categoria {
  id: number;
  nombre: string;
  orden: number;
  platos: Plato[];
}

interface Plato {
  nombre: string;
  precio: number;
  ingredientes: string;
}

const CartaPage: FC<{ idCarta: number }> = ({ idCarta = 1 }) => {
  const [carta, setCarta] = useState<Carta | null>(null);
  const [nombre, setNombre] = useState('');
  const [platoAdded, setPlatoAdded] = useState(false);  // Nuevo estado para rastrear cuando se añade un nuevo plato

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getCarta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idCarta }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCarta(data.carta);
    };

    fetchData();
  }, [idCarta, platoAdded]);  // Se ejecuta cuando se monta el componente, cada vez que idCarta cambia y cuando se añade un nuevo plato

  if (!carta) {
    return <div>Loading...</div>;  // Puedes mostrar un spinner de carga aquí
  }

  return (
    <div className="carta">
      <MetaCartaEdit nombreInicial={carta.nombre} cartaID={idCarta} guardarNombre={setNombre} />
      <Card className="mt-6">
        <Carta carta={carta} onPlatoAdded={() => setPlatoAdded(!platoAdded)} /> {/* Pasar la función onPlatoAdded para ser llamada cuando se añada un nuevo plato */}
      </Card>
      <CartaFormClient idCarta={idCarta} />
    </div>
  );
}

export default CartaPage;
