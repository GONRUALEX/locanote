import { Photos } from "./photo";

export interface Notes {
    id?: number;
    title?: string;
    description?: string;
    place?: string;
    longitude?: string;
    latitude?: string;
    dateNote?: Date;
    photos?: Photos[];
}
