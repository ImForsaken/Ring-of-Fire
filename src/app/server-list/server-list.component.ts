import { Component, OnInit } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  getDocs,
  getFirestore,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
})
export class ServerListComponent implements OnInit {
  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {}

  get serverList() {
    return this.firestoreService.serverList;
  }

  // serverIds$!: Observable<any>;
  // serverList: string[] = [];
  ngOnInit(): void {
    this.firestoreService.getAllIds();
    // this.getAllIds();
  }

  joinGame(id: string) {
    this.router.navigateByUrl('/game/' + id);
  }

  // async getAllIds() {
  //   const db = getFirestore();
  //   const collectionRef = collection(db, 'games');

  //   this.serverIds$ = collectionData(collectionRef, { idField: 'id' });
  //   this.serverIds$.subscribe((games) => {
  //     this.serverList = games.map((game: { id: any }) => game.id);
  //     console.log(this.serverList);
  //   });
  // }
}
