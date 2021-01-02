import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'warrant-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: {
      message: string,
      success?: boolean
    }
  ) { }

  ngOnInit(): void {
  }

}
