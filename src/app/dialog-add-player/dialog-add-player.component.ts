import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss'],
})
export class DialogAddPlayerComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}
  ngOnInit(): void {}

  name: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }
}
