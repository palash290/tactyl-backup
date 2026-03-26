import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { BoardComponent } from './board/board.component';
import { MembersComponent } from './settings/members/members.component';
import { PhasesComponent } from './settings/phases/phases.component';
import { CommonService } from '../../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PlanService } from '../../../../services/plan.service';
@Component({
  selector: 'app-team-overview',
  imports: [CommonModule, FormsModule, OverviewComponent, BoardComponent, MembersComponent,
    PhasesComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.css'
})
export class TeamOverviewComponent {

  Form!: FormGroup;
  teamName: any;
  teamId: any;
  loading: boolean = false;
  userEmail: any;
  //userType: any;
  is_admin: any;
  userId: any;
  dashboardData: any;
  activeMainTab: 'overview' | 'board' | 'settings' = 'overview';
  activeSettingsTab: 'users' | 'permissions' | 'phases' = 'users';
  teamPermissions = this.buildDefaultPermissions(false);

  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(
    private location: Location,
    private service: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NzMessageService,
    public planService: PlanService
  ) { }

  ngOnInit() {
    //this.userType = localStorage.getItem('userType');
    this.userId = localStorage.getItem('user_id');
    this.is_admin = this.route.snapshot.queryParamMap.get('is_admin');
    this.teamId = this.route.snapshot.queryParamMap.get('teamId');
    this.route.queryParams.subscribe(params => {
      this.teamName = params['teamName'];
    });
    this.loadPermissions();
    this.initForm();
    // this.getTeamPermissionsForUsers();
  }

  getTeamPermissionsForUsers() {
    this.service.get(`user/team/user-permissions?team_id=${this.teamId}&user_id=${this.userId}`).subscribe({
      next: (resp: any) => {

      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  initForm() {
    this.Form = new FormGroup({
      name: new FormControl(this.teamName, Validators.required),
    });
  }

  onSubmit() {
    this.Form.markAllAsTouched();

    const first_name = this.Form.value.name?.trim();

    if (!first_name) {
      return;
    }

    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      // formURlData.append('teamId', this.teamId);
      formURlData.append('team_name', this.Form.value.name);

      this.service.patch(`user/teams/${this.teamId}`, formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { teamName: this.Form.value.name },
              queryParamsHandling: 'merge',
              replaceUrl: true
            });
            this.closeModalAdd.nativeElement.click();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.toastr.warning('Please check all the fields!');
    }
  }

  backClicked() {
    this.location.back();
  }

  deleteTeam() {
    this.service.delete(`user/teams/${this.teamId}`).subscribe({
      next: (resp: any) => {
        this.router.navigateByUrl('/team/teams');
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  set() {
    this.activeMainTab = 'settings';
    this.activeSettingsTab = 'users';
  }

  private loadPermissions(): void {
    if (!this.teamId) return;
    const raw = localStorage.getItem(this.getPermissionsStorageKey());
    if (!raw) {
      this.teamPermissions = this.is_admin == '1'
        ? this.buildDefaultPermissions(true)
        : this.buildDefaultPermissions(false);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      this.teamPermissions = {
        ...this.buildDefaultPermissions(false),
        ...parsed
      };
    } catch {
      this.teamPermissions = this.is_admin == '1'
        ? this.buildDefaultPermissions(true)
        : this.buildDefaultPermissions(false);
    }
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

  private getPermissionsStorageKey(): string {
    return `team_permissions_${this.teamId}`;
  }

}
