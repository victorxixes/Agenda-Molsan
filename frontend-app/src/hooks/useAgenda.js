import { useAgendaStore } from "../store/agendaStore";

export const useAgenda = () => {
  const store = useAgendaStore();
  return store;
};

