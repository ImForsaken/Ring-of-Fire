import { Component, OnInit, Inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getFirestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game!: Game;
  gameCollections$!: Observable<any>;
  newGameList!: Array<any>;
  currentCard!: string;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      console.log(params['id']);
      // const coll = collection(this.firestore, 'games');
      // this.gameCollections$ = collectionData(coll);
      // this.gameCollections$.subscribe(async (newGameHosted) => {
      //   console.log('a new game has been hosted', newGameHosted);
      // });

      const db = getFirestore();
      const docRef = doc(db, 'games', params['id']);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async newGame() {
    this.game = new Game();
    // const coll = collection(this.firestore, 'games');
    // let gameInfo = await addDoc(coll, this.game.toJson());
    // console.log('gameInfo', gameInfo);
    // let gameInfo = await setDoc(doc(coll), this.game.toJson());
  }

  async takeCard() {
    // const card = this.game.stack.length
    if (!this.pickCardAnimation && this.game.stack.length >= 1) {
      this.currentCard = this.game.stack.pop() || '';
      this.pickCardAnimation = true;
      // console.log('new Card', this.currentCard);
      // console.log('Game is', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        if (this.currentCard.length >= 1) {
          this.game.playedCards.push(this.currentCard);
        }
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        console.log('The dialog was closed', name);
      }
    });
  }
}
