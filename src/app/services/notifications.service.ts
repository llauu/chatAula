import { Injectable } from '@angular/core';
import { collection, Firestore, collectionData, query, orderBy, getDocs } from '@angular/fire/firestore';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { FirestoreService } from './firestore.service';
import { Subscription } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private user: any;
  private enable: boolean = false;
  private messagesSub: Subscription | null = null;

  constructor(private firestoreService: FirestoreService, private firestore: Firestore) {}


  init(user: any) {
    this.user = user;

    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        this.listenForNewMessages();
      } else {
        // Show some error
        alert('Error: Debes habilitar las notificaciones');
      }
    });

    this.addListeners();
  }

  private addListeners() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        // alert('Push registration success, token: ' + token.value);
        this.saveToken(token.value);
        this.enable = true;
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  private listenForNewMessages() {
    const col = collection(this.firestore, 'salaChat/4a/mensajes');
    const orderQuery = query(col, orderBy('fecha', 'asc'));
    this.messagesSub = collectionData(orderQuery).subscribe(async (messages: any[]) => {
      console.log("Mensajes recibidos:", messages); // Verificar si llegan los mensajes
  
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.usuario !== this.user.uid) {
          console.log("Nuevo mensaje de otro usuario:", lastMessage.mensaje);
          await this.sendLocalNotification(lastMessage.mensaje);
        }
      }
    });
  }
  
  async testLocalNotification() {
    await this.sendLocalNotification('Mensaje de prueba');
  }
  

  async sendLocalNotification(message: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Nuevo mensaje en el chat',
          body: message,
          id: Date.now(),
          schedule: { at: new Date(new Date().getTime() + 1000) },
        },
      ],
    });
  }

  ngOnDestroy() {
    this.messagesSub?.unsubscribe();
  }

  async saveToken(token: string) {
    const updateDoc = {
      token
    }
    await this.firestoreService.updateDocument(`salaChat/usuarios/usuarios/${this.user.uid}`, updateDoc);
    // Guardar el token en la base de datos de usuarios


    // collection(this.firestore, 'users').doc(this.user.uid).update({
    //   token: token
    // });
  }


  // async sendChatNotificationToOthers(message: string) {
  //   const tokens: string[] = await this.getUserTokensInRoom();

  //   console.log(tokens);
  
  //   tokens.forEach(token => {
  //     fetch("https://fcm.googleapis.com/v1/projects/ionic-app-d39f5/messages:send", {
  //       method: "POST",
  //       headers: {
  //         "Authorization": "Bearer 64cb433d4db0f078134d4bac68066b327164306a",
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         to: token,
  //         notification: {
  //           title: "Nuevo mensaje en el chat",
  //           body: message,
  //           click_action: "FCM_PLUGIN_ACTIVITY",
  //           icon: "fcm_push_icon"
  //         }
  //       })
  //     });
  //   });
  // }
  
  // // Esta función recupera los tokens de los usuarios en la sala
  // async getUserTokensInRoom(): Promise<string[]> {
  //   const tokens: string[] = [];
  //   const snapshot = await getDocs(collection(this.firestore, `salaChat/usuarios/usuarios`));
  //   snapshot.forEach(doc => {
  //     const data = doc.data();
  //     if (data['token']) {
  //       tokens.push(data['token']);
  //     }
  //   });
  //   return tokens;
  // }
  
  
}
