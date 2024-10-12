import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { UserService } from './services/user.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  firstTime: boolean = true;

  constructor(private userService: UserService, private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkState();
      }
    });
  }
  
  async checkState() {
    if(this.firstTime) {
      const user = await this.userService.getState();

      if(user) {
        console.log('PRIMERA VEZ')
        this.firstTime = false;
        this.router.navigate(['/home']);
      }
    }
  }
}
