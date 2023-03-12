import { Component, OnInit } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  constructor(private router: Router, private firestore: Firestore) {}
  ngOnInit(): void {}

  async newGame() {
    //Start game
    let game = new Game();
    const coll = collection(this.firestore, 'games');
    await addDoc(coll, game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo['id']);
      })
      .catch((error) => {
        console.error('Error adding game: ', error);
      });

    // let gameInfo = await setDoc(doc(coll), this.game.toJson());
  }
}
