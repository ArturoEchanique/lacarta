// ModalContainerCategoria.tsx
import React from 'react';
import ModalCategoria from '../modalCategoria/ModalCategoria';

interface Props {
  onClose: () => void;
  onCategoriaAdded: () => void;
  idCarta: number;
}

const ModalContainerCategoria: React.FC<Props> = ({ onClose, onCategoriaAdded, idCarta }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <ModalCategoria onClose={onClose} onCategoriaAdded={onCategoriaAdded} idCarta={idCarta}/>
        </div>
      </div>
    </div>
  );
};

export default ModalContainerCategoria;
