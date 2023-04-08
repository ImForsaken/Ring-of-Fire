import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  db!: Firestore;
  serverIds$!: Observable<any>;
  serverList: string[] = [];
  collectionRef!: CollectionReference<DocumentData>;
  gameCollections$!: Observable<any>;
  gameId!: string;
  subscription!: Subscription;

  async getAllIds() {
    this.db = getFirestore();
    this.collectionRef = collection(this.db, 'games');
    //gives us a observable object(no data til subscribe)
    this.serverIds$ = collectionData(this.collectionRef, { idField: 'id' });
    //only with a subscribe we can get data from the observable
    this.subscription = this.serverIds$.subscribe((games) => {
      //Mapping data so we can have the id´s as string in a array
      this.serverList = games.map((game: { id: any }) => game.id);
      console.log(this.serverList);
    });
  }

  destroySubscription() {
    this.subscription.unsubscribe();
  }

  getServerChanges() {
    this.route.params.subscribe(async (params) => {
      this.gameId = params['id'];
      //gets complete collection of alle registrated games
      const allGameRef = collection(this.firestore, 'games');
      //gets us a observable so we can allow to track data
      this.gameCollections$ = collectionData(allGameRef);
      // with subscribe we always get notified if changes where made to the collection
      this.gameCollections$.subscribe((game) => {
        console.log('all Games', game);
        // Update the game object or do any other logic here
      });
    });
  }
}
