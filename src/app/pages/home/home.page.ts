import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  loading!: HTMLIonLoadingElement;


  constructor(private userService: UserService, private router: Router, private loadingCtrl: LoadingController, private notificationsService: NotificationsService) {
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;
      });
  }

  ingresarSala(sala: string) {
    this.router.navigate([`/../sala${sala}`]);
  }

  cerrarSesion() {
    this.loading.present();

    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .finally(() => {
        this.loading.dismiss();
      });
  }
}
