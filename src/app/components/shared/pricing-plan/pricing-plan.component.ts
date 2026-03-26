import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentPlan, PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-pricing-plan',
  imports: [CommonModule],
  templateUrl: './pricing-plan.component.html',
  styleUrl: './pricing-plan.component.css'
})
export class PricingPlanComponent {

  userPackage: any = 'Silver';
  user_id: any;
  loading: boolean = false;
  plansDetails: CurrentPlan[] = [];
  activePlan: CurrentPlan | null = null;
  upcomingPlan: CurrentPlan | null = null;

  constructor(
    private service: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public planService: PlanService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
    });
    this.getPlans();
    this.getProfilePlans();
  }

  goBack(): void {
    window.history.back();
  }

  hasRestrictedView(): boolean {
    return !this.planService.currentPlan && !!this.planService.lastPlan?.plan_name;
  }

  isTrialExpiredView(): boolean {
    return !this.planService.currentPlan && this.planService.lastPlan?.plan_name === 'Free Trial';
  }

  showBackButton(): boolean {
    return this.isTrialExpiredView();
  }

  get visiblePlanCount(): number {
    let count = 0;
    if (this.canViewBronze()) count++;
    if (this.canViewGold()) count++;
    return count;
  }

  canViewBronze(): boolean {
    if (this.planService.currentPlan?.plan_name === 'Bronze') return false;
    if (!this.hasRestrictedView()) return true;
    const lastPlan = this.planService.lastPlan?.plan_name;
    return lastPlan === 'Bronze' || lastPlan === 'Free Trial';
  }

  canViewGold(): boolean {
    if (!this.hasRestrictedView()) return true;
    const lastPlan = this.planService.lastPlan?.plan_name;
    return lastPlan === 'Gold' || lastPlan === 'Free Trial';
  }

  continueWithoutPlan(): void {
    const lastPlan = this.planService.lastPlan?.plan_name;
    if (lastPlan === 'Bronze') {
      this.router.navigateByUrl('/individual/dashboard');
      return;
    }
    if (lastPlan === 'Gold' || lastPlan === 'Free Trial') {
      this.router.navigateByUrl('/team/dashboard');
      return;
    }
    this.router.navigate(['/pricing-plan'], {
      queryParams: { user_id: this.user_id }
    });
  }

  getPlans() {
    this.service.get('public/plans').subscribe({
      next: (resp: any) => {

      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getProfilePlans() {
    this.service.get('user/profile').subscribe({
      next: (resp: any) => {
        this.plansDetails = resp.data?.plans_datails || [];
        this.computePlanTimeline();
      },
      error: () => {
        this.plansDetails = [];
        this.activePlan = null;
        this.upcomingPlan = null;
      }
    });
  }

  private computePlanTimeline(): void {
    const now = Date.now();
    const activeCandidates = this.plansDetails.filter(plan => this.isPlanActiveNow(plan, now));
    this.activePlan = activeCandidates.sort((a, b) => this.getStartTime(b) - this.getStartTime(a))[0] || null;

    const upcomingCandidates = this.plansDetails
      .filter(plan => this.getStartTime(plan) > now)
      .sort((a, b) => this.getStartTime(a) - this.getStartTime(b));
    this.upcomingPlan = upcomingCandidates[0] || null;
  }

  private isPlanActiveNow(plan: CurrentPlan, now: number): boolean {
    const start = this.getStartTime(plan);
    const end = this.getEndTime(plan);
    if (!start || !end) return false;
    if (plan.is_active === false) return false;
    return start <= now && now <= end;
  }

  private getStartTime(plan: CurrentPlan): number {
    const value = plan.start_time ? Date.parse(plan.start_time) : 0;
    return Number.isNaN(value) ? 0 : value;
  }

  private getEndTime(plan: CurrentPlan): number {
    const value = plan.end_time ? Date.parse(plan.end_time) : 0;
    return Number.isNaN(value) ? 0 : value;
  }

  formatPlanDate(value?: string): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  purchasePlan(planId: any) {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('plan_id', planId);
    this.service.post('user/purchase-subscription-stripe', formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        if (resp.success && resp.data?.payment_url) {
          // 🔹 Redirect to Stripe checkout
          window.location.href = resp.data.payment_url;
        }
      },
      error: (error) => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

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
