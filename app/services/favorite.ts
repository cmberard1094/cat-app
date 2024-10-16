import axiosInstance from "@/app/services/axios";
import { Favorite } from "../types/favorite";

export const favorite = (userId: string, id: string): Promise<Favorite> => {
  return axiosInstance
    .post(`/favourites`, {
      image_id: id,
      sub_id: userId,
    })
    .then((res) => res.data);
};

export const unfavorite = (favoriteId: number): Promise<Favorite> => {
  return axiosInstance
    .delete(`/favourites/${favoriteId}`)
    .then((res) => res.data);
};
