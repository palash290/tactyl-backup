import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-choose-signup',
  imports: [RouterLink],
  templateUrl: './choose-signup.component.html',
  styleUrl: './choose-signup.component.css'
})
export class ChooseSignupComponent {

  selectedRole: string | null = null;

  constructor(private router: Router) { }

  selectRole(role: string) {
    debugger
    this.selectedRole = role;
    if (this.selectedRole == 'invited') {
      localStorage.setItem('userType', 'individual');
    } else {
      localStorage.setItem('userType', this.selectedRole);
    }

  }

  continue() {
    if (!this.selectedRole) {
      //alert("Please select a role");
      return;
    }

    if (this.selectedRole === 'individual') {
      this.router.navigate(['/single-signup'], {
        queryParams: { type: 'individual' }
      });
    } else if (this.selectedRole === 'team') {
      this.router.navigate(['/team-signup'], {
        queryParams: { type: 'team' }
      });
    } else if (this.selectedRole === 'invited') {
      this.router.navigate(['/join-team'], {
        queryParams: { type: 'invited' }
      });
    }
  }


}
