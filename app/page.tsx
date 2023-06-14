import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '../lib/planetscale';
import Search from './search';
import UsersTable from './table';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  const nombre = 'sdfsdxxxxxxxxf'
  await queryBuilder
  .updateTable('cartas')
  .set( {nombre} )
  .where('carta_id', '=', 1)
  .execute();
  const users = await queryBuilder
    .selectFrom('usuarios')
    .select(['user_id', 'username', 'email'])
    .where('username', 'like', `%${search}%`)
    .execute();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>
        A list of users retrieved from a MySQL database (PlanetScale).
      </Text>
      <Search />
      <Card className="mt-6">
        {/* @ts-expect-error Server Component */}
        <UsersTable users={users} />
      </Card>
    </main>
  );
}
