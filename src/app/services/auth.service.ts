import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        signOut, authState, updateProfile, updateEmail,
        sendEmailVerification, reauthenticateWithCredential, 
      verifyBeforeUpdateEmail,
      updatePassword, sendPasswordResetEmail,
      deleteUser, signInWithRedirect,
      GoogleAuthProvider, OAuthProvider, FacebookAuthProvider,
      OAuthCredential, signInWithCredential, getRedirectResult,
    } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firestoreService: FirestoreService = inject(FirestoreService);
  auth: Auth = inject(Auth);
  authState = authState(this.auth);

  constructor() {
    this.auth.languageCode = 'es';    
  }

  async createUser(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    // await this.sendEmailVerification();
    return user;
  }
  
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    // await this.notificationsPushService.deleteToken();
    await signOut(this.auth);
  }

  getCurrentUser() {
      return this.auth.currentUser;
  }

  // updateProfile(data: {displayName?: string, photoURL?: string}) {
  //    return updateProfile(this.auth.currentUser, data)
  // }

  // updateEmail(email: string) {
  //   return updateEmail(this.auth.currentUser, email)
  // }

  // verifyBeforeUpdateEmail(email: string) {
  //   return verifyBeforeUpdateEmail(this.auth.currentUser, email)
  // }

  // reauthenticateWithCredential(password: string) {
  //   const credential = GoogleAuthProvider.credential(null, password);
  //   return reauthenticateWithCredential(this.auth.currentUser, credential)
  // }

  // sendEmailVerification() {
  //   return sendEmailVerification(this.auth.currentUser)
  // }

  // updatePassword(newPasword: string) {
  //   return updatePassword(this.auth.currentUser, newPasword)
  // }

  // sendPasswordResetEmail(email: string) {
  //   return sendPasswordResetEmail(this.auth, email);
  // }

  // deleteUser() {
  //   return deleteUser(this.auth.currentUser);
  // }
}
