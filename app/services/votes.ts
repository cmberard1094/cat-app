import axiosInstance from "@/app/services/axios";
import { Vote } from "../types/votes";

export const vote = (
  userId: string,
  id: string,
  value: number
): Promise<Vote> => {
  return axiosInstance
    .post(`/votes`, {
      image_id: id,
      sub_id: userId,
      value,
    })
    .then((res) => res.data);
};
