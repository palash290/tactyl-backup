import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-individual-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './individual-sidebar.component.html',
  styleUrl: './individual-sidebar.component.css'
})
export class IndividualSidebarComponent {

  // userType: any;

  constructor(private router: Router, public planService: PlanService) { }

  ngOnInit() {
    // this.userType = localStorage.getItem('userType');
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  @Output() toggleEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.toggleEvent.emit(false); // Emit event to parent component
  }


}
