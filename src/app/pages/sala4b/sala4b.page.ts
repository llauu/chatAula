import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addDoc, collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sala4b',
  templateUrl: './sala4b.page.html',
  styleUrls: ['./sala4b.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class Sala4bPage {
  messageText: string = '';
  messages: any = [];
  user: string | null | undefined = '';
  sub: Subscription | null = null;
  loading!: HTMLIonLoadingElement;


  constructor(private firestore: Firestore, public auth: AuthService, private router: Router, private loadingCtrl: LoadingController) {
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;

        
        this.loading.present();
        this.user = this.auth.getCurrentUser()?.email;
        this.getMessages();
        this.scrollToBottom();
      });
  }




  sendMessage() {
    if(this.messageText !== '' && this.messageText.length <= 21) {
      let col = collection(this.firestore, 'salaChat/4b/mensajes');
      addDoc(col, {'fecha': new Date(), 'usuario': this.user, 'mensaje': this.messageText});

      this.messageText = '';
    }
  }
  
  getMessages() {
    let col = collection(this.firestore, 'salaChat/4b/mensajes');
    const orderQuery = query(col, orderBy('fecha', 'asc'));

    this.messages = [];
    const observable = collectionData(orderQuery);

    this.sub = observable.subscribe((res: any) => {
      this.messages = res;
      
      // Cada vez que haya un nuevo mensaje, envio el scroll hacia abajo de todo
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
