import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-invited-signup',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './invited-signup.component.html',
  styleUrls: ['./invited-signup.component.css']
})
export class InvitedSignupComponent {

  loading: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  jionTeam() {
    this.router.navigateByUrl('/join-team')
  }

}
