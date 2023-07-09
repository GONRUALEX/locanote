import { Injectable } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  useLocation?: [number, number];
  constructor(public geolocation: Geolocation) {
    this.getGeolocation();
  }

  /*public async getUserLocation(): Promise<[number,number]>{
    return new Promise((resolve, reject)=>{
      navigator.geolocation.getCurrentPosition(({coords})=>{
        this.useLocation = [ coords.longitude, coords.latitude]
        console.log("Ubicación", this.useLocation)
        resolve(this.useLocation);
      },
      ( err )=>{
        console.log("Error geolocalización", err);
        reject();
      });
    });
  }*/

  getGeolocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log("geolocation current", resp)
        this.useLocation = [resp.coords.latitude, resp.coords.longitude];
        resolve(this.useLocation);
        console.log(resp.coords.latitude, resp.coords.longitude)
      }).catch((error) => {
        console.log("Error en la geolocalización", error)
        reject();
      })
    })


    /*let watch = this.geolocation.watchPosition();
    watch.subscribe((data)=>{
      console.log("geolocalización watch",data)
    })*/
  }

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }
}
