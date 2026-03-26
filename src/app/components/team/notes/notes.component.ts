import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notes',
  imports: [RouterLink],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {

  userType: any;

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
  }


}
