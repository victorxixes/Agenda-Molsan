export const getFotoURL = (foto) => {
  if (!foto || foto.trim() === "") {
    return `${import.meta.env.VITE_API_URL}/api/fotos/default.jpg`;
  }

  return `${import.meta.env.VITE_API_URL}/api/fotos/${foto}`;
};

