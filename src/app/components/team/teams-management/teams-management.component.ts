import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { ModalService } from '../../../services/modal.service';
import { PlanService } from '../../../services/plan.service';
declare var bootstrap: any;

@Component({
  selector: 'app-teams-management',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './teams-management.component.html',
  styleUrl: './teams-management.component.css'
})
export class TeamsManagementComponent {

  selectedDrEmail: string[] = [];
  individualMembers: any;
  allTeamsList: any;
  loading: boolean = false;
  teamName: string = '';
  selectedMembers: any[] = [];
  searchText: string = '';
  searchTeamText: string = '';
  sortOrder: string = 'latest';
  filteredData: any[] = [];
  filteredTeamData: any[] = [];
  p: any = 1;
  userEmail: any;
  //userType: any;
  @ViewChild('drEmail') drEmail!: ElementRef<HTMLButtonElement>
  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>


  constructor(
    private service: CommonService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private toastr: NzMessageService,
    public planService: PlanService
  ) { }


  ngOnInit() {
    this.userEmail = localStorage.getItem('teamEmail');
    //this.userType = localStorage.getItem('userType');
    this.getUsers();
    this.getAllTeams();
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  getUsers() {
    this.service.get('user/users/verified').subscribe({
      next: (resp: any) => {
        this.individualMembers = resp.data.filter(
          (user: any) => user.email !== this.userEmail
        );
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getAllTeams() {
    this.service.get('user/teams').subscribe({
      next: (resp: any) => {
        this.allTeamsList = resp.data.map((team: any) => {
          const total_tasks = team.total_tasks || 0;
          const completed_tasks = team.completed_tasks || 0;

          const progress =
            total_tasks > 0
              ? Math.round((completed_tasks / total_tasks) * 100)
              : 0;

          return {
            ...team,
            progress,
            limitedMembers: team.teamMembers?.slice(0, 6) || []
          };
        });

        this.filterTeamList();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


  filterTeamList() {
    this.p = 1;
    let filtered = [...this.allTeamsList];

    // Search filter
    if (this.searchTeamText.trim()) {
      const keyword = this.searchTeamText.trim().toLowerCase();
      filtered = filtered.filter((item: any) =>
        item.team_name?.toLowerCase().includes(keyword)
      );
    }

    // Sort by date
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return this.sortOrder === 'oldest'
        ? dateA - dateB
        : dateB - dateA;
    });

    this.filteredTeamData = filtered;
  }


  openModal() {
    const modalElement = document.getElementById('ct_create_team_modal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
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

  filterTable() {
    this.p = 1;
    let filtered = this.individualMembers;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { name: any; email: any; }) =>
      (item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  // Capture checkbox selection
  // toggleMember(email: string, event: any) {
  //   if (event.target.checked) {
  //     this.selectedMembers.push(email);
  //   } else {
  //     this.selectedMembers = this.selectedMembers.filter(e => e !== email);
  //   }
  // }
  toggleMember(memberId: any, event: any) {
    if (!memberId) {
      return;
    }
    if (event.target.checked) {
      this.selectedMembers.push(memberId);
    } else {
      this.selectedMembers = this.selectedMembers.filter(e => e !== memberId);
    }
  }

  submitForm() {
    const trimmedTeamName = this.teamName?.trim();

    // ✅ Validate team name
    if (!trimmedTeamName) {
      this.toastr.warning('Team name is required');
      return;
    }

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
    //   team_name: trimmedTeamName,
    //   members: allEmails.map(email => ({
    //     email: email
    //   }))
    // };


    // const payload = {
    //   team_name: trimmedTeamName,
    //   user_ids: uniqueUserIds,
    //   emails: uniqueEmails
    // };

    const payload: any = {
      team_name: trimmedTeamName
    };

    if (uniqueUserIds.length > 0) {
      payload.user_ids = uniqueUserIds;
    }

    if (uniqueEmails.length > 0) {
      payload.emails = uniqueEmails;
    }


    this.service.post('user/teams', payload).subscribe({
      next: (resp: any) => {
        this.loading = false;

        if (resp.success == true) {
          this.toastr.success(resp.message || 'Invitations sent successfully!');
          this.selectedMembers = [];
          this.selectedDrEmail = [];
          this.teamName = '';
          this.closeBtn.nativeElement.click();
          this.getAllTeams();
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


}
