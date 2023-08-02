import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { CancelOptions, Channel, LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class BackgroundTaskService {
  taskId: any;
  location: number[];

  constructor(private geolocationService: GeolocationService) {

  }

  async requestNotificationPermission() {

    let granted = await LocalNotifications.checkPermissions();

    if (granted.display == 'granted') {
      this.initTaskBackground();
    } else {
      granted = await LocalNotifications.requestPermissions();
      if (granted.display == 'granted') {
        this.initTaskBackground();
      } else {
        console.log('No se concedieron los permisos de notificación');
      }
    }
  }

  async initTaskBackground(): Promise<void> {
    let taskId = BackgroundTask.beforeExit(async () => {
      let start = new Date().getTime();
      let count = 0;
      for (var i = 0; i < 1e18; i++) {
        if (count > 100) { 
          break;
        }
        if ((new Date().getTime() - start) % 2000 === 0) {
          LocalNotifications.schedule({
            notifications: [{
              title: "Last Known Location",
              body: " Latitude: ",
              id: count,
              schedule: {
                at: new Date(Date.now() + 1000 * 10)
              },
              sound: null,
              attachments: null,
              actionTypeId: "",
              extra: null
            }]
          });
        }
        count++;
      }
      
    });  
  }

  async notification(id: number = Math.floor(Math.random() * 100), title: string = "Notificación de localización",
    body: string = "Cuerpo de la notificación", largeBody: string = "body largo", summaryText: string = "Location positive") {
    let options: ScheduleOptions = {
      notifications: [
        {
          id: Math.floor(Math.random() * 100),
          title: title,
          body: body,
          largeBody: largeBody,
          summaryText: summaryText,
          largeIcon: 'res://drawable/bell',
          smallIcon: 'res://drawable/chat',
        }
      ]
    }

    try {
      await LocalNotifications.schedule(options);
    } catch (err) {
      alert(JSON.stringify(err))
    }
  }

  async cancelNotification(id: number) {
    let op: CancelOptions = {
      notifications: [{ id: id }]
    }
  }

  async removeAllDeliveredNotifications() {
    await LocalNotifications.removeAllDeliveredNotifications();
  }

  async getDeliveredNotifications() {
    LocalNotifications.getDeliveredNotifications().then((res) => {
      alert(JSON.stringify(res));
    })
  }

  async createChannel() {
    let channel: Channel = {
      id: "channel1",
      description: "first channel",
      name: "Channel 1",
      visibility: 1
    }
  }

  finishTaskBackground(): void {
    this.taskId.finish();
  }

  findGeolocation(): void {
    this.geolocationService.getGeolocation().then((data) => {
      this.location = data;
    });
  }



}
