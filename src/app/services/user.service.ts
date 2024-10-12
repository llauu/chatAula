import { inject, Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private notificationService = inject(NotificationsService);
  private user: any;
  private logged: boolean = false;



  constructor(private authService: AuthService) {
    this.getState();
  }


  getState() {
    return new Promise((resolve, reject) => {
      if(this.logged) {
        resolve(this.user);
        return;
      }

      this.authService.authState.subscribe((res) => {
        if(res) {
          this.user = res;
          this.logged = true;

          // Inicializo las notificaciones
          // Cuando se verifique q el user esta logeado hago el init de las notificaciones
          this.notificationService.init(this.user);
        } else {
          this.user = null;
          this.logged = false;
        }
        resolve(this.user);
      });
    });
  }

  getLogged() {
    return this.logged;
  }

  logout() {
    this.logged = false;
    this.user = null;
    return this.authService.logout();
  }
}
