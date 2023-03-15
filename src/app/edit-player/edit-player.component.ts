import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss'],
})
export class EditPlayerComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}
  allProfilePictures = [
    '1.png',
    '2.png',
    'monkey.png',
    'pinguin.svg',
    'serious-woman.svg',
    'winkboy.svg',
  ];

  ngOnInit() {}
}
