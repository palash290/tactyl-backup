import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trial-page',
  imports: [CommonModule],
  templateUrl: './trial-page.component.html',
  styleUrl: './trial-page.component.css'
})
export class TrialPageComponent {

  loading: boolean = false;

  constructor(private service: CommonService, private router: Router) { }

  ngOnInit() { }

  activateTrial(planId: any) {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('plan_id', planId);
    this.service.post('user/purchase-subscription', formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.router.navigateByUrl('/team/dashboard');
      },
      error: (error) => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
