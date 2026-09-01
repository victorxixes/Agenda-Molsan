import { useAuthStore } from "../store/authStore";
import axios from "../api/axios";

export default function Layout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ⭐ AUTOCONECTAR AL ENTRAR EN EL ERP
  useEffect(() => {
    if (user?.id) {
      axios.post(`/mensajes/conectar/${user.id}`).catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen flex bg-white text-[#1F3A5F]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
