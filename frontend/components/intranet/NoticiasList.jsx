import React from "react";
import { useIntranetStore } from "../../store/intranetStore";
import { useEmpleadosStore } from "../../store/empleadosStore";
import NoticiasForm from "./NoticiasForm";
import NoticiaCard from "./NoticiaCard";

export default function NoticiasList() {
  const { noticias, eliminarNoticia } = useIntranetStore();
  const { empleados } = useEmpleadosStore();

  const safeNoticias = Array.isArray(noticias) ? noticias : [];

  const getNombre = (id) =>
    empleados.find((e) => e.id === id)?.nombre || `Usuario ${id}`;

  return (
    <div>
      <NoticiasForm />

      <div className="mt-4 grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
        {safeNoticias.map((n) => (
          <NoticiaCard
            key={n.id}
            noticia={n}
            creador={getNombre(n.usuario_id)}
            onDelete={() => eliminarNoticia(n.id)}
          />
        ))}
      </div>
    </div>
  );
}
