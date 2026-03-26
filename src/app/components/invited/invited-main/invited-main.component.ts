import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { InvitedSidebarComponent } from '../invited-sidebar/invited-sidebar.component';

@Component({
  selector: 'app-invited-main',
  imports: [RouterOutlet, InvitedSidebarComponent, HeaderComponent],
  templateUrl: './invited-main.component.html',
  styleUrl: './invited-main.component.css'
})
export class InvitedMainComponent {

}
