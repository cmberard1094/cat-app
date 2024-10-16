import { Favorite } from "./favorite";
import { Vote } from "./votes";

export interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds: [];
  vote?: Vote;
  favourite?: Favorite;
}
