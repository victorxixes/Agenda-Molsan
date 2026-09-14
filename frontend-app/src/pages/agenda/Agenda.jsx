const guardarCita = async (payload) => {
  try {
    let creada;

    if (modalModo === "crear") {
      creada = await crear(payload, year, month);
      if (creada?.id) {
        marcarResaltada(creada.id);
        notify("Cita creada correctamente.");
      }
    } else if (citaSeleccionada) {
      const editada = await editar(citaSeleccionada.id, payload, year, month);
      if (editada?.id) {
        marcarResaltada(editada.id);
        notify("Cita actualizada correctamente.");
      }
    }

    setMostrarModal(false);
  } catch (err) {
    console.error("ERROR AL GUARDAR CITA:", err);
    notify("Error al guardar la cita.");
  }
};

const borrarCita = async () => {
  if (!citaSeleccionada) return;

  try {
    await eliminar(citaSeleccionada.id, year, month);
    notify("Cita eliminada.");
    setMostrarModal(false);
  } catch (err) {
    console.error("ERROR AL ELIMINAR CITA:", err);
    notify("Error al eliminar la cita.");
  }
};
