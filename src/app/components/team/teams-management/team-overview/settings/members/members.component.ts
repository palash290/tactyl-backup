import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../../services/common.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalService } from '../../../../../../services/modal.service';
import { SubscriptionModalComponent } from '../../../../../shared/subscription-modal/subscription-modal.component';
import { PlanService } from '../../../../../../services/plan.service';

@Component({
  selector: 'app-members',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent {

  teamMembers: any;
  searchText: string = '';
  filteredData: any[] = [];
  searchAllText: string = '';
  filteredAllData: any[] = [];
  teamId: any;
  selectedMembers: any[] = [];
  individualMembers: any;
  selectedDrEmail: string[] = [];
  loading: boolean = false;
  memberId: any;
  userEmail: any;
  //userType: any;
  is_admin: any;
  userId: any;
  p: any = 1;
  teamPermissions = this.buildDefaultPermissions(false);
  @ViewChild('drEmail') drEmail!: ElementRef<HTMLButtonElement>
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalInv') closeModalInv!: ElementRef;

  constructor(
    private service: CommonService,
    private modalService: ModalService,
    private toastr: NzMessageService,
    private route: ActivatedRoute,
    public planService: PlanService
  ) { }


  ngOnInit() {
    this.teamId = this.route.snapshot.queryParamMap.get('teamId');
    this.is_admin = this.route.snapshot.queryParamMap.get('is_admin');
    // this.userType = localStorage.getItem('userType');
    this.userEmail = localStorage.getItem('teamEmail');
    this.loadPermissions();
    this.getTeamMembers();
    // this.getAllMembers();
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  getTeamMembers() {
    this.service.get(`user/teams/${this.teamId}`).subscribe({
      next: (resp: any) => {
        this.teamMembers = resp.data.team_users;
        this.userId = resp.data.user_id;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getAllMembers() {
    this.service.get(`user/users/verified?team_id=${this.teamId}`).subscribe({
      next: (resp: any) => {
        this.individualMembers = resp.data;

        this.selectedMembers = [
          ...new Set(this.teamMembers.map((item: any) => item.user_id))
        ];

        this.filterAllTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.teamMembers;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { name: any; email: any; }) =>
      (item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  filterAllTable() {
    let filtered = this.individualMembers;

    if (this.searchAllText.trim()) {
      const keyword = this.searchAllText.trim().toLowerCase();
      filtered = filtered.filter((item: { name: any; email: any; }) =>
      (item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredAllData = filtered;
  }

  // Capture checkbox selection
  toggleMember(user_id: string, event: any) {
    if (event.target.checked) {
      this.selectedMembers.push(user_id);
    } else {
      this.selectedMembers = this.selectedMembers.filter(e => e !== user_id);
    }
  }

  removeDrEmail(index: number) {
    this.selectedDrEmail.splice(index, 1);
  }

  addDrEmail(email: string) {
    const trimmedEmail = email.trim();

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!trimmedEmail) {
      return;
    }

    // Check valid email
    if (!emailRegex.test(trimmedEmail)) {
      this.toastr.error('Please enter a valid email address');
      return;
    }

    //
    if (trimmedEmail === this.userEmail) {
      this.toastr.error('Your own email cannot be added.');
      return;
    }

    // Check duplicate email
    if (this.selectedDrEmail.includes(trimmedEmail)) {
      this.toastr.error('Email already added');
      return;
    }

    // Add email
    this.selectedDrEmail.push(trimmedEmail);
    this.drEmail.nativeElement.value = '';
  }

  submitForm() {

    // const allEmails = [...new Set([
    //   ...this.selectedMembers,
    //   ...this.selectedDrEmail
    // ])];

    // if (allEmails.length === 0) {
    //   this.toastr.warning('Please add or select at least one member email');
    //   return;
    // }

    this.loading = true;

    const uniqueUserIds = [...new Set(this.selectedMembers)];
    const uniqueEmails = [...new Set(this.selectedDrEmail)];

    if (uniqueUserIds.length === 0 && uniqueEmails.length === 0) {
      this.toastr.warning('Please add or select at least one member email');
      return;
    }

    // const payload = {
    //   team_id: this.teamId,
    //   members: allEmails.map(email => ({
    //     email: email
    //   }))
    // };
    // 🔥 Build payload dynamically
    const payload: any = {};

    if (uniqueUserIds.length > 0) {
      payload.user_ids = uniqueUserIds;
    }

    if (uniqueEmails.length > 0) {
      payload.emails = uniqueEmails;
    }

    this.service.patch(`user/teams/${this.teamId}`, payload).subscribe({
      next: (resp: any) => {
        this.loading = false;

        if (resp.success == true) {
          this.toastr.success(resp.message || 'Invitations sent successfully!');
          this.selectedMembers = [];
          this.selectedDrEmail = [];
          this.closeBtn.nativeElement.click();
          this.getTeamMembers();
        } else {
          this.toastr.warning(resp.message || 'Failed to send invitation!');
        }
      },
      error: (error) => {
        this.loading = false;

        const msg =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          'Something went wrong!';

        this.toastr.error(msg);
      }
    });
  }

  getId(id: any) {
    this.memberId = id;
  }

  removeMem() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('team_id', this.teamId);
    formURlData.set('user_id', this.memberId);
    this.service.post(`user/teams/remove-member`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.getTeamMembers();
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  reInviteMem() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('team_id', this.teamId);
    formURlData.set('user_id', this.memberId);
    this.service.post(`user/teams/reinvite-member`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.closeModalInv.nativeElement.click();
        this.toastr.success(resp.message);
        this.getTeamMembers();
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
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
