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
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { async, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { update } from '@firebase/database';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game!: Game;
  gameInfo$!: Observable<any>;
  newGameList!: Array<any>;
  gameOver: boolean = false;
  docRef!: DocumentReference<DocumentData>;
  gameId!: string;
  // gameCollections$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private firestoreService: FirestoreService
  ) {}

  get destroySubscription() {
    return this.firestoreService.destroySubscription();
  }

  async ngOnInit(): Promise<void> {
    await this.newGame();
    this.firestoreService.destroySubscription();
    this.route.params.subscribe(async (params) => {
      this.gameId = params['id'];
      //gets us the specific game from our collection
      this.docRef = doc(collection(this.firestore, 'games'), params['id']);
      onSnapshot(this.docRef, (docSnap) => {
        console.log('game has been updated', docSnap.data());
      });
      //allows us to get a observable so we can track changes
      this.gameInfo$ = docData(this.docRef);
      //subscribe will notify us if changes where made to the specific game
      this.gameInfo$.subscribe((game) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.playerImages = game.playerImages;
        this.game.stack = game.stack;
        this.game.currentCard = game.currentCard;
        this.game.pickCardAnimation = game.pickCardAnimation;
      });
    });
  }

  async newGame() {
    this.game = new Game();
  }

  async saveGame() {
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
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (this.game.players.length == 0) {
      alert('Please add player');
    } else if (!this.game.pickCardAnimation && this.game.stack.length >= 1) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
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
