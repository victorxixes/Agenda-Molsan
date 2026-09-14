import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 🔥 debe ser https://agenda-intranet-b.onrender.com/api
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 500,
        data: null,
        message: "Error de red o servidor no disponible",
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
