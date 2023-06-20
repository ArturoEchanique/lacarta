// MetaCartaEdit.tsx
import { useState, FC } from 'react';
import styles from './MetaCartaEdit.module.css';

type MetaCartaEditProps = {
    nombreInicial: string;
    cartaID: number;
    guardarNombre: (nombre: string) => void;
};

const MetaCartaEdit: FC<MetaCartaEditProps> = ({ nombreInicial, cartaID, guardarNombre }) => {
    const [nombre, setNombre] = useState(nombreInicial);

    const handleGuardar = () => {
        guardarNombre(nombre);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
          // Hacer una solicitud POST a la ruta API
          const response = await fetch('/api/updateCartaName', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Incluir las categorias en el cuerpo de la solicitud
            body: JSON.stringify({ nombre, cartaID }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          // Aquí puedes manejar la respuesta si todo va bien
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error('An error occurred while fetching the data.', error);
        }
      };

    return (
        <div className={styles["carta-formulario"]}>
            <form className={styles["carta-formulario__form"]} onSubmit={handleSubmit}>
                <label htmlFor="nombre-carta" className={styles["carta-formulario__label"]}>
                    Nombre de la Carta:
                </label>
                <input
                    type="text"
                    id="nombre-carta"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={styles["carta-formulario__input"]}
                />
                <input type="submit" value="Guardar" className={styles["carta-formulario__boton"]}/>
                {/* <button type="button" onClick={handleGuardar} className={styles["carta-formulario__boton"]}>
                    Guardar
                </button> */}
            </form>
            <div className={styles["carta-formulario__botones"]}>
                <button type="button" className={styles["carta-formulario__boton-extra"]}>
                    Botón 1
                </button>
                <button type="button" className={styles["carta-formulario__boton-extra"]}>
                    Botón 2
                </button>
            </div>
        </div>
    );
};

export default MetaCartaEdit;