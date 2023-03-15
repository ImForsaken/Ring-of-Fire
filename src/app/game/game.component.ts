import { Component, OnInit, Inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { async, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { update } from '@firebase/database';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game!: Game;
  gameInfo$!: Observable<any>;
  gameCollections$!: Observable<any>;
  newGameList!: Array<any>;
  gameOver: boolean = false;
  gameId!: string;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    await this.newGame();

    this.route.params.subscribe(async (params) => {
      this.gameId = params['id'];
      console.log(params['id']);
      //gets complete collection of alle registrated games
      const allGameRef = collection(this.firestore, 'games');
      //gets us a observable so we can allow to track data
      this.gameCollections$ = collectionData(allGameRef);
      // with subscribe we always get notified if changes where made to the collection
      this.gameCollections$.subscribe((game) => {
        console.log('all Games', game);
        // Update the game object or do any other logic here
      });

      //gets us the specific game from our collection
      const docRef = doc(collection(this.firestore, 'games'), params['id']);
      //allows us to get a observable so we can track changes
      this.gameInfo$ = docData(docRef);
      //subscribe will notify us if changes where made to the specific game
      this.gameInfo$.subscribe((game) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.playerImages = game.playerImages;
        this.game.stack = game.stack;
        this.game.currentCard = game.currentCard;
        this.game.pickCardAnimation = game.pickCardAnimation;
        console.log('current Games', game);
        // Update the game object or do any other logic here
      });

      // const coll = collection(this.firestore, 'games');
      // this.gameCollections$ = collectionData(coll);
      // this.gameCollections$.subscribe(async (game) => {
      //   console.log('game Updated', game);
      // });
    });
  }

  async newGame() {
    this.game = new Game();
    // const coll = collection(this.firestore, 'games');
    // let gameInfo = await addDoc(coll, this.game.toJson());
    // console.log('gameInfo', gameInfo);
    // let gameInfo = await setDoc(doc(coll), this.game.toJson());
  }

  async saveGame() {
    //Vlt add doch stattt updateDoc in zeile 97 benutzen bzw probieren
    // const db = getFirestore();
    // const docRef = doc(collection(this.firestore, 'games'), this.gameId);
    // const docRef = doc(db, 'games', this.gameId);
    // await updateDoc(docRef, this.game.toJson());

    const docRef = doc(this.firestore, 'games', this.gameId);
    const update = this.game.toJson();
    await updateDoc(docRef, update)
      .then(() => {
        console.log('Document updated successfully');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  }

  takeCard() {
    // const card = this.game.stack.length
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.stack.length >= 1) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
      console.log('new Card', this.game.currentPlayer);
      console.log('Game is', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        if (this.game.currentCard) {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }
      }, 1000);
    }
  }

  editPlayer(playerId: number) {
    console.log('edit player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('1.png');
        this.saveGame();
      }
    });
  }
}
