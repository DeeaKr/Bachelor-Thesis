import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  config = new MatSnackBarConfig();

  constructor(
    private snackBar: MatSnackBar
  ) { }


  openSuccesSnackBar(message: string) {
    this.config.panelClass = ['snackbar-success'];
    
    this.config.duration = 5000;
    this.snackBar.open(message, "OK", this.config);
  }

  openFailSnackBar(message: string) {
    this.config.panelClass = ['snackbar-fail'];
    
    this.config.duration = 5000;
    this.snackBar.open(message, "Close", this.config);
  }
}
