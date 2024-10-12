import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, setDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-sala4a',
  templateUrl: './sala4a.page.html',
  styleUrls: ['./sala4a.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class Sala4aPage implements OnInit {
  messageText: string = '';
  messages: any = [];
  user: any;
  sub: Subscription | null = null;
  loading!: HTMLIonLoadingElement;

  constructor(
    private firestore: Firestore,
    public auth: AuthService,
    public userService: UserService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private notificationsService: NotificationsService
  ) {}

  async ngOnInit() {
    this.loadingCtrl.create().then(loading => {
      this.loading = loading;
      this.loading.present();
      this.userService.getState()
        .then(user => {
          this.user = user;
        });
      this.notificationsService.init(this.user);
      this.getMessages();
    });
  }

  sendMessage() {
    if (this.messageText !== '' && this.messageText.length <= 21) {
      let col = collection(this.firestore, 'salaChat/4a/mensajes');
      addDoc(col, { 'fecha': new Date(), 'usuario': this.user.email, 'mensaje': this.messageText })
        .then(() => {
          // Enviar la notificación
          // this.notificationsService.sendNotificationToUsers(this.messageText);
          // this.notificationsService.sendChatNotificationToOthers(this.messageText);
        })
        .finally(() => {
          this.messageText = '';
        });
    }
  }
  
  getMessages() {
    let col = collection(this.firestore, 'salaChat/4a/mensajes');
    const orderQuery = query(col, orderBy('fecha', 'asc'));

    this.messages = [];
    const observable = collectionData(orderQuery);

    this.sub = observable.subscribe((res: any) => {
      this.messages = res;
      // Scroll hacia abajo al recibir nuevos mensajes
      setTimeout(() => {
        this.scrollToBottom();
        this.loading.dismiss();
      }, 0);
    });
  }

  formatUser(user: string): string {
    return user.split('@')[0];
  }

  formatTimestamp(timestamp: any): string {
    const date = timestamp.toDate(); 
    return formatDate(date, 'd MMM. y h:mm a', 'en-US'); 
  }

  scrollToBottom() {
    const chatMessages = document.getElementById('chat');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  volver() {
    this.sub?.unsubscribe();
    this.router.navigate(['/home']);
  }
}
