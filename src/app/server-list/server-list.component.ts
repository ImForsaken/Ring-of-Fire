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

  ngOnInit(): void {
    this.firestoreService.getAllIds();
  }

  joinGame(id: string) {
    this.router.navigateByUrl('/game/' + id);
  }
}
