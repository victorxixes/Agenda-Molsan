import { useIntranetStore } from "../store/intranetStore";

export const useIntranet = () => {
  return useIntranetStore();
};
