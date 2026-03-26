import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userData: any;
  notifications: any;
  unread_count: any;
  constructor(
    private router: Router,
    private apiService: CommonService,
    public planService: PlanService
  ) { }

  @ViewChild('closeModal') closeModal!: ElementRef;

  userType: any;

  ngOnInit() {
    this.apiService.refreshSidebar$.subscribe(() => {
      this.getProfile();
    });
    this.userType = localStorage.getItem('userType');
    this.getNotifications();
  }

  get isBronze(): boolean {
    return this.planService.isBronze();
  }

  get isTrial(): boolean {
    return this.planService.isTrial();
  }

  get isGold(): boolean {
    return this.planService.isGold();
  }

  get needsPlanPurchase(): boolean {
    return !this.planService.currentPlan && !!this.planService.lastPlan;
  }

  get trialDaysRemaining(): number | null {
    const plan = this.planService.currentPlan;
    if (!plan) return null;

    const endFromApi = plan.end_time ? Date.parse(plan.end_time) : NaN;
    let endTime = Number.isNaN(endFromApi) ? null : endFromApi;

    if (!endTime && plan.start_time && plan.number_of_days !== undefined && plan.number_of_days !== null) {
      const startTime = Date.parse(plan.start_time);
      if (!Number.isNaN(startTime)) {
        const days = Number(plan.number_of_days);
        if (!Number.isNaN(days)) {
          endTime = startTime + days * 24 * 60 * 60 * 1000;
        }
      }
    }

    if (!endTime) return null;

    const msLeft = endTime - Date.now();
    if (msLeft <= 0) return 0;
    return Math.ceil(msLeft / (24 * 60 * 60 * 1000));
  }

  logout() {
    this.router.navigateByUrl('/');
    this.closeModal.nativeElement.click();
    localStorage.clear();
  }

  getProfile() {
    this.apiService.get('user/profile').subscribe({
      next: (resp: any) => {
        this.userData = resp.data;
        localStorage.setItem('teamEmail', resp.data.email);
        localStorage.setItem('user_id', resp.data.user_id);
        this.planService.setCurrentPlan(resp.data.current_plan || null);
        if (resp.data?.plans_datails?.length) {
          this.planService.setLastPlan(
            this.planService.getLastPlanFromDetails(resp.data?.plans_datails, resp.data?.current_plan || null)
          );
        }
        if (resp.data?.free_trial) {
          this.planService.setFreeTrialStatus(resp.data.free_trial);
        }
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getNotifications() {
    this.apiService.get('user/notifications').subscribe({
      next: (resp: any) => {
        this.notifications = resp.data.notifications;
        this.unread_count = resp.data?.unread_count;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  markNotificationAsRead() {
    this.apiService.patch('user/notifications/read', '').subscribe({
      next: (resp: any) => {
        // this.notifications = resp.data;
        this.getNotifications();
      },
      error: (error) => {
        this.notifications = [];
        console.log(error.message);
      }
    });
  }

  getTimeAgo(dateString: string): string {
    const createdDate = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - createdDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 30) {
      return 'just now';
    }

    if (diffMinutes < 1) {
      return `${diffSeconds}s`;
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    }

    if (diffHours < 24) {
      return `${diffHours}h`;
    }

    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  }


}
