import React from 'react';
import { Carta } from '../../../types'; // Asegúrate de que la ruta al archivo 'types.ts' sea correcta

export default function VerCartaComponent({ carta }: { carta: Carta }) {

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">{carta.nombre}</h1>
      </div>

      <div>
        {carta.categorias.map((categoria) => (
          <div key={categoria.id} style={{ opacity: categoria.visible ? 1 : 0.5 }}>
            <h2 className="text-xl font-bold mb-4">{categoria.nombre}</h2>

            <div className="bg-gray-200 p-4 rounded-lg">
              {categoria.platos.map((plato) => (
                <div className="flex items-center justify-between mb-4" key={plato.nombre} style={{ opacity: plato.visible ? 1 : 0.5 }}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-400 rounded-full mr-4" />
                    <div>
                      <h3 className="font-semibold">{plato.nombre}</h3>
                      <p className="text-gray-600">{plato.descripcion}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{plato.precio}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
