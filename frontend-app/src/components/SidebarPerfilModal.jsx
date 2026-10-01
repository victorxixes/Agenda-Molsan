import {
  useEffect,
  useCallback,
} from "react";

import ModalEmpleado
  from "./empleados/ModalEmpleado";


export default function EmpleadoPerfilModal({
  id,
  onClose,
}) {

  const idNum = Number(id);

  const idValido =
    Number.isFinite(idNum) &&
    idNum > 0;


  useEffect(() => {

    if (!idValido) {
      return;
    }

    const handleEsc = (event) => {

      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleEsc
      );

    };

  }, [
    idValido,
    onClose,
  ]);


  const handleOverlayClick =
    useCallback(
      (event) => {

        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }

      },
      [onClose]
    );


  if (!idValido) {
    return null;
  }


  /*
   * ModalEmpleado ya contiene su propio
   * overlay. No añadimos otro aquí.
   */

  return (
    <ModalEmpleado
      open={true}
      empleadoId={idNum}
      onClose={onClose}
      onOverlayClick={
        handleOverlayClick
      }
    />
  );
}
