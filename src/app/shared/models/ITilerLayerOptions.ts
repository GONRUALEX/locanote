import { CrossOrigin } from "leaflet";

export interface ITilerLayerOptions {
    minZoom?: number;
    maxZoom?: number;
    subdomains?: string | string[];
    errorTileUrl?: string;
    zoomOffSet?: number;
    tms?: boolean;
    zoomReverse?: boolean;
    detectRetina?: boolean;
    crossOrigin?: boolean | CrossOrigin;
    attribution?: string;
}