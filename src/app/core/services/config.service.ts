import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { BackgroundTaskService } from './background-task.service';
@Injectable()
export class ConfigService {

  data: any;
  constructor(
    private _http: HttpClient,
  ) { }

  loadConfig(): Promise<void>{
    return new Promise((resolve, reject)=>{
      this._http.get("app/shared/config/config.json").subscribe((data:any)=>{
        this.data = data;
        resolve(this.data);
      });
    });
  }
}
