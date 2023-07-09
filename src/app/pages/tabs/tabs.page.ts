import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  constructor( protected translateService: TranslateService, private platform: Platform) {
    platform.ready().then(() => {
      /*Keyboard.show().then(() => {
          document.body.classList.add('keyboard-is-open');
      });

      Keyboard.hide().then(() => {
          document.body.classList.remove('keyboard-is-open');
      });*/
});
  }

}
