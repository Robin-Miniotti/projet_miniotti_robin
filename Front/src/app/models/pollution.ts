export class Pollution {
    id:number;
    titre: string;
    type_pollution:string;
    description:string;
    date_observation:Date;
    location:string;
    latitude:number;
    longitude:number;
    photo_url:string;
    discoveredBy:string;
    photo_base_64?:string;
    photo_mime_type?:string;
    
    // Méthode pour obtenir l'URL de l'image (construite ou directe)
    getPhotoUrl(): string | null {
        // Si photo_url existe déjà, l'utiliser
        if (this.photo_url) {
            return this.photo_url;
        }
        // Sinon, construire à partir de base64
        if (this.photo_base_64 && this.photo_mime_type) {
            return `data:${this.photo_mime_type};base64,${this.photo_base_64}`;
        }
        return null;
    }
}