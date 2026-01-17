import { Pollution } from './pollution';
import { User } from './user';

/**
 * Réponse API pour la récupération d'une pollution
 */
export interface PollutionResponse {
  id: number;
  titre: string;
  type_pollution: string;
  description: string;
  date_observation: string | Date;
  location?: string;
  lieu?: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
  discoveredBy?: string;
  discovered_by?: string;
  photo_base_64?: string;
  photo_mime_type?: string;
}

/**
 * Réponse API pour le login
 */
export interface LoginResponse {
  id: number;
  login: string;
  nom: string;
  prenom: string;
}

/**
 * Réponse API pour la suppression
 */
export interface DeleteResponse {
  message?: string;
  success?: boolean;
}
