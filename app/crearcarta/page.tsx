'use client';
import { useState, useEffect, FC } from 'react';
import MetaCartaEdit from '../../components/metaCartaEdit/MetaCartaEdit';
import { Categoria, Carta, Plato } from '../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta
import { Card, Title, Text } from '@tremor/react';
import CartaComponent from '../cartaComponent';  // Asegúrate de tener un componente CartaTable


const CartaPage: FC<{ idCarta: number }> = ({ idCarta = 1 }) => {
  const [carta, setCarta] = useState<Carta | null>(null);
  const [nombre, setNombre] = useState('');

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

      let data = await response.json();

      // Ordena las categorías antes de establecer el estado
      data.carta.categorias.sort((a: Categoria, b: Categoria) => a.orden - b.orden);
      console.log("orden de categorias es...: ", data.carta.categorias[0]?.orden, data.carta.categorias[1]?.orden)


      data.carta.categorias.forEach((categoria: Categoria) => {
        console.log("orden de platos 0 y 1 e...: ", categoria.platos[0]?.orden, categoria.platos[1]?.orden)
      });

      data.carta.categorias.forEach((categoria: Categoria) => {
        categoria.platos.sort((a: Plato, b: Plato) => a.orden - b.orden);
      });

      setCarta(data.carta);
      console.log("fetching data again, carta is: ", data.carta)
    };

    fetchData();
  }, [idCarta]);  // Se ejecuta cuando se monta el componente, cada vez que idCarta cambia y cuando se añade un nuevo plato

  if (!carta) {
    return <div>Loading...</div>;  // Puedes mostrar un spinner de carga aquí
  }

  return (
    <div className="carta">
      <MetaCartaEdit nombreInicial={carta.nombre} cartaID={idCarta} guardarNombre={setNombre} />
      <Card className="mt-6">
        <CartaComponent carta={carta} />
      </Card>
    </div>
  );
}

export default CartaPage;
