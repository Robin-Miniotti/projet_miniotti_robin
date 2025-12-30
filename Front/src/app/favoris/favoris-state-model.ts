import { Favoris } from "./favoris";
import { Pollution } from "../models/pollution";

export interface FavorisStateModel extends Favoris {
    favoris: Pollution[];
}