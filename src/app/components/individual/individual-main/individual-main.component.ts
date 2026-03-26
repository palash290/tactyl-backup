import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndividualSidebarComponent } from '../individual-sidebar/individual-sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-individual-main',
  imports: [RouterOutlet, IndividualSidebarComponent, HeaderComponent],
  templateUrl: './individual-main.component.html',
  styleUrl: './individual-main.component.css'
})
export class IndividualMainComponent {

}
