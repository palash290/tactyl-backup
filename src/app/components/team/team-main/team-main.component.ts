import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamsSidebarComponent } from '../teams-sidebar/teams-sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-team-main',
  imports: [RouterOutlet, TeamsSidebarComponent, HeaderComponent],
  templateUrl: './team-main.component.html',
  styleUrl: './team-main.component.css'
})
export class TeamMainComponent {

}
