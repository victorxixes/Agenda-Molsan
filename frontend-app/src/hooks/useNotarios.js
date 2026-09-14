import { useEffect, useState } from "react";
import { listarNotarios } from "../api/notarios";

export function useNotarios() {
  const [notarios, setNotarios] = useState([]);

  useEffect(() => {
    listarNotarios().then(res => setNotarios(res.data));
  }, []);

  return notarios;
}
