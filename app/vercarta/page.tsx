import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '../../lib/planetscale';
import Carta from '.././carta';  // Asegúrate de tener un componente CartaTable

export const dynamic = 'force-dynamic';

export default async function CartaPage({
  idCarta
}: {
  idCarta: number;
}) {

  idCarta = 1
  
  const carta = await queryBuilder
    .selectFrom('cartas')
    .select(['nombre', 'descripcion'])
    .where('carta_id', '=', idCarta)
    .execute();

  const platos = await queryBuilder
    .selectFrom('platos')
    .select(['nombre', 'precio', 'ingredientes'])
    .where('carta_id', '=', idCarta)
    .execute();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>{carta[0]?.nombre} ff</Title>
      <Text>
        {carta[0]?.descripcion}
      </Text>
      <Card className="mt-6">
        {/* @ts-expect-error Server Component */}
        <Carta platos={platos} />
      </Card>
    </main>
  );
}

