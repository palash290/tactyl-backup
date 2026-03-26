import { Component } from '@angular/core';
import { CommonService } from '../../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../../../services/plan.service';

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {

  dashboardData: any;
  teamId: any;
  userType: any;
  activeLogs: any;
  userId: any;
  team_admin_id: any;
  teamPermissions = this.buildDefaultPermissions(false);

  constructor(
    private service: CommonService,
    private route: ActivatedRoute,
    public planService: PlanService
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    this.userType = localStorage.getItem('userType');
    this.teamId = this.route.snapshot.queryParamMap.get('teamId');
    this.getTeamDashboard();
  }

  getTeamPermissionsForUsers() {
    this.service.get(`user/team/user-permissions?team_id=${this.teamId}&user_id=${this.userId}`).subscribe({
      next: (resp: any) => {
        const permissions = Array.isArray(resp?.data) ? resp.data : [];
        const permissionNames = permissions
          .map((item: any) => (item?.name || '').toString().trim())
          .filter((name: string) => !!name);

        if (this.isTeamAdmin()) {
          this.setAllPermissions(true);
        } else if (this.hasGoldOrTrialAccess()) {
          this.applyPermissionsFromNames(permissionNames);
        } else {
          this.setAllPermissions(true);
        }

        this.persistPermissions();
      },
      error: (error) => {
        console.log(error.message);
        if (this.isTeamAdmin()) {
          this.setAllPermissions(true);
        } else if (this.hasGoldOrTrialAccess()) {
          this.setAllPermissions(false);
        } else {
          this.setAllPermissions(true);
        }
        this.persistPermissions();
      }
    });
  }

  getTeamDashboard() {
    this.service.get(`user/teams/${this.teamId}/dashboard`).subscribe({
      next: (resp: any) => {
        this.dashboardData = resp.data;
        this.team_admin_id = resp.data.team_admin_id;
        this.getTeamPermissionsForUsers();
        // this.getLogs();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  // getLogs() {
  //   this.service.get(`user/fetchLogsByTeamId?team_id=${this.teamId}`).subscribe({
  //     next: (resp: any) => {
  //       this.activeLogs = resp.data;
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     }
  //   });
  // }

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
      return `${diffSeconds}s ago`;
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }

  private hasGoldOrTrialAccess(): boolean {
    return this.planService.hasActiveGoldAccess();
  }

  private isTeamAdmin(): boolean {
    if (!this.userId || !this.team_admin_id) return false;
    return String(this.userId) === String(this.team_admin_id);
  }

  private buildDefaultPermissions(value: boolean) {
    return {
      canEditTeam: value,
      canDeleteTeam: value,
      canInviteMembers: value,
      canAddBoard: value,
      canEditBoard: value,
      canDeleteBoard: value,
      canAddPhase: value,
      canEditPhase: value,
      canDeletePhase: value,
      canAddTask: value,
      canEditTask: value,
      canDeleteTask: value
    };
  }

  private setAllPermissions(value: boolean): void {
    this.teamPermissions = this.buildDefaultPermissions(value);
  }

  private applyPermissionsFromNames(names: string[]): void {
    this.setAllPermissions(false);

    const normalized = new Set(
      names.map(name => name.toLowerCase())
    );

    if (normalized.has('team')) {
      this.teamPermissions.canEditTeam = true;
      this.teamPermissions.canDeleteTeam = true;
      this.teamPermissions.canInviteMembers = true;
    }

    if (normalized.has('board')) {
      this.teamPermissions.canAddBoard = true;
      this.teamPermissions.canEditBoard = true;
      this.teamPermissions.canDeleteBoard = true;
    }

    if (normalized.has('phase')) {
      this.teamPermissions.canAddPhase = true;
      this.teamPermissions.canEditPhase = true;
      this.teamPermissions.canDeletePhase = true;
    }

    if (normalized.has('tasks')) {
      this.teamPermissions.canAddTask = true;
      this.teamPermissions.canEditTask = true;
      this.teamPermissions.canDeleteTask = true;
    }
  }

  private persistPermissions(): void {
    if (!this.teamId) return;
    localStorage.setItem(this.getPermissionsStorageKey(), JSON.stringify(this.teamPermissions));
  }

  private getPermissionsStorageKey(): string {
    return `team_permissions_${this.teamId}`;
  }


}
