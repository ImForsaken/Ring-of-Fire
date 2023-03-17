import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
})
export class ServerListComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get serverList() {
    return this.firestoreService.serverList;
  }

  get subscription() {
    return this.firestoreService.subscription;
  }

  ngOnInit(): void {
    this.firestoreService.getAllIds();
  }

  joinGame(id: string) {
    this.router.navigateByUrl('/game/' + id);
  }
}
