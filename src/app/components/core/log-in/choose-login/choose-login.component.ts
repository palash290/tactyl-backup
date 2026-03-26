import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-choose-login',
  imports: [RouterLink],
  templateUrl: './choose-login.component.html',
  styleUrl: './choose-login.component.css'
})
export class ChooseLoginComponent {

  constructor(private router: Router) { }

  selectedType: string | null = null;

  selectRole(type: string) {
    this.selectedType = type;
    localStorage.setItem('userType', this.selectedType);
  }

  continue() {
    if (!this.selectedType) {
      //alert("Please select a type.");
      return;
    }

    this.router.navigate(['/login'], {
      queryParams: { type: this.selectedType }
    });
  }


}
