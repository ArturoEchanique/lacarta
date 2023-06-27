// ModalContainerPlato.tsx
import React from 'react';
import ModalPlato from '../modalPlato/ModalPlato';
import { Plato } from '../../types';

interface Props {
  onClose: () => void;
  onCompleted: (plato: Plato) => void;
  idCategoria: number;
  index: number;
  editingPlato: Plato | null; // Aquí es donde permitimos que `editingPlato` pueda ser `null`
}

const ModalContainerPlato: React.FC<Props> = ({ onClose, onCompleted, idCategoria, index, editingPlato }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <ModalPlato
            onClose={onClose}
            onCompleted={onCompleted}
            idCategoria={idCategoria}
            index={index}
            editingPlato={editingPlato}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalContainerPlato;