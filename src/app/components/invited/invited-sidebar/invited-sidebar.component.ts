import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-invited-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './invited-sidebar.component.html',
  styleUrl: './invited-sidebar.component.css'
})
export class InvitedSidebarComponent {

    userType: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  @Output() toggleEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.toggleEvent.emit(false); // Emit event to parent component
  }

  
}
