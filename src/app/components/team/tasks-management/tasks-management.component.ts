import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { ModalService } from '../../../services/modal.service';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-tasks-management',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './tasks-management.component.html',
  styleUrl: './tasks-management.component.css'
})
export class TasksManagementComponent {

  Form!: FormGroup;
  teamList: any;
  teamMembers: any;
  membersList: any[] = [];
  loading: boolean = false;
  taskId: any
  phaseList: any;
  minDate: any;
  taskList: any;
  p: any = 1;
  selectedPriority: string = '';
  selectedRecent: string = 'DESC';
  selectedTeamId: string = '';
  searchText: string = '';
  taskVisibility: 'all' | 'private' = 'all';
  user_id: any;
  //userType: any;
  //showPrivateTask: boolean = false;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(
    private service: CommonService,
    private toastr: NzMessageService,
    private modalService: ModalService,
    public planService: PlanService
  ) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
    //this.userType = localStorage.getItem('userType');
    this.initForm();
    this.getTeams();
    this.getAllTasks()
    this.dateValidation();
    // this.getPhaes();
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  dateValidation() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  getAllTasks() {
    let params = new URLSearchParams();

    if (this.selectedPriority) {
      params.append('priority', this.selectedPriority);
    }

    if (this.selectedRecent) {
      params.append('order', this.selectedRecent);
    }

    if (this.searchText?.trim()) {
      params.append('search', this.searchText.trim());
    }

    if (this.selectedTeamId) {
      params.append('team_id', this.selectedTeamId);
    }

    // params.append('is_private', this.showPrivateTask ? '1' : '0');
    if (this.taskVisibility == 'private') {
      params.append('is_private', '1');
    } else {
      params.append('is_private', '0');
    }


    this.service.get(`user/tasks?${params.toString()}`).subscribe({
      next: (resp: any) => {
        this.taskList = resp.data;
      },
      error: (error) => {
        console.log(error.message);
        this.taskList = [];
      }
    });
  }

  initForm() {
    const numberOnlyValidator = [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ];

    const minutesRangeValidator = [
      ...numberOnlyValidator,
      Validators.min(0),
      Validators.max(60),
    ];

    this.Form = new FormGroup(
      {
        title: new FormControl('', Validators.required),
        selectedTeamId: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        priority: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('', Validators.required),
        isPrivate: new FormControl(false),
        isGoalRevelant: new FormControl(false),
        memberId: new FormControl('', Validators.required),
        phaseId: new FormControl('', Validators.required),

        estimatedHours: new FormControl('', numberOnlyValidator),
        estimatedMinutes: new FormControl('', minutesRangeValidator),

        is_urgent: new FormControl(false),
      },
      {
        validators: this.dateRangeValidator as any,
      }
    );
  }


  fetchPhaseDetails(item: any) {
    this.taskId = item.task_id;
    this.onTeamChange('', item.team_id)
    this.Form.patchValue({
      title: item.title,
      description: item.description || '',
      selectedTeamId: item.team_id,
      memberId: item.assigned_to.user_id,
      phaseId: item.phase_id,
      priority: item.priority,
      startDate: this.toDateOnly(item.start_date),
      endDate: this.toDateOnly(item.due_date),
      isPrivate: item.is_private,
      isGoalRevelant: item.goal_relevant,
      estimatedMinutes: item.estimated_minutes,
      estimatedHours: item.estimated_hours,
      is_urgent: item.is_urgent,
    });
  }

  private toDateOnly(value: string): string {
    if (!value) return '';
    return value.split('T')[0]; // YYYY-MM-DD
  }

  reset() {
    this.taskId = '';
    this.Form.patchValue({
      title: '',
      description: '',
      estimated_minutes: '',
      estimated_hours: '',
      selectedTeamId: '',
      memberId: '',
      phaseId: '',
      priority: '',
      startDate: '',
      endDate: '',
      isPrivate: false,
      isGoalRevelant: false,
      is_urgent: false
    });
  }

  dateRangeValidator(group: FormGroup) {
    const from = group.get('startDate')?.value;
    const to = group.get('endDate')?.value;

    if (from && to && to < from) {
      return { dateInvalid: true };
    }

    return null;
  }

  getTeams() {
    this.service.get('user/teams').subscribe({
      next: (resp: any) => {
        this.teamList = resp.data
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onTeamChange(event: any, itamId?: any) {
    if (!itamId) {
      // debugger
      const selectedTeamId = event.target.value;
      if (selectedTeamId) {
        this.getMembers(selectedTeamId);
        this.getPhaes(selectedTeamId)
        // Optional: reset selected member when team changes
        this.Form.get('memberId')?.setValue('');
      } else {
        this.membersList = [];
      }
    } else {
      const selectedTeamId = itamId;
      if (selectedTeamId) {
        this.getMembers(selectedTeamId);
        this.getPhaes(selectedTeamId)
        // Optional: reset selected member when team changes
        this.Form.get('memberId')?.setValue('');
      } else {
        this.membersList = [];
      }
    }
  }

  getMembers(selectedTeamId: any) {
    this.service.get(`user/teams/${selectedTeamId}`).subscribe({
      next: (resp: any) => {
        // this.membersList = resp.data;
        const teamUsers = resp.data.team_users || [];

        this.membersList = teamUsers.filter(
          (member: any) => member.status === 'Accepted'
        );
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getPhaes(selectedTeamId: any) {
    this.service.get(`user/phases?team_id=${selectedTeamId}`).subscribe({
      next: (resp: any) => {
        this.phaseList = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    this.Form.markAllAsTouched();

    const title = this.Form.value.title?.trim();

    if (!title) {
      return;
    }

    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.append('title', title);
      formURlData.append('description', this.Form.value.description);
      formURlData.append('team_id', this.Form.value.selectedTeamId);
      formURlData.append('assign_to', this.Form.value.memberId);
      formURlData.append('phase_id', this.Form.value.phaseId);
      formURlData.append('start_date', this.Form.value.startDate);
      formURlData.append('due_date', this.Form.value.endDate);
      formURlData.append('priority', this.Form.value.priority);
      formURlData.append('is_private', this.Form.value.isPrivate ? '1' : '0');
      formURlData.append('goal_relevant', this.Form.value.isGoalRevelant ? '1' : '0');
      formURlData.append('estimated_hours', this.Form.value.estimatedHours);
      formURlData.append('estimated_minutes', this.Form.value.estimatedMinutes);
      formURlData.append('is_urgent', this.Form.value.is_urgent ? '1' : '0');

      this.service.post(this.taskId ? `user/tasks/${this.taskId}` : 'user/tasks', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getAllTasks();
            this.taskId = null;
            this.Form.reset();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.getAllTasks();
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

  id: any;

  getId(id: any) {
    this.id = id;
  }

  deleteTask() {
    this.service.get(`user/tasks/${this.id}`).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.getAllTasks();
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  exportToCSV() {
    if (!this.taskList || this.taskList.length === 0) {
      return;
    }

    const headers = [
      'S.No',
      'Task Title',
      'Team',
      'Assignee',
      'Priority',
      'Phase',
      'Created At'
    ];

    const rows = this.taskList.map((item: any, index: number) => [
      index + 1,
      `"${item.title || ''}"`,
      `"${item.team_name || ''}"`,
      `"${item.assigned_by.full_name || ''}"`,
      item.priority || '',
      `"${item.phase.phase_name || ''}"`,
      this.formatDate(item.created_at)
    ]);

    const csvContent =
      headers.join(',') + '\n' +
      rows.map((row: any) => row.join(',')).join('\n');

    this.downloadCSV(csvContent, 'task-list.csv');
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  downloadCSV(csv: string, fileName: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }


}
