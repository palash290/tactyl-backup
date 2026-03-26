import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalService } from '../../../../services/modal.service';
import { SubscriptionModalComponent } from '../../../shared/subscription-modal/subscription-modal.component';
import { PlanService } from '../../../../services/plan.service';

@Component({
  selector: 'app-task-details',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {

  Form!: FormGroup;
  completeForm!: FormGroup;
  notesForm!: FormGroup;
  taskId: any;
  teamId: any;
  taskDetails: any;
  noteList: any;
  loading: boolean = false;
  minDate: any;
  teamMembersList: any;
  phaseList: any;
  boardId: any;
  //userType: any;
  taskName: any;
  actualTime: any;
  user_id: any;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;
  @ViewChild('closeModalAddNotes') closeModalAddNotes!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalComplete') closeModalComplete!: ElementRef;

  constructor(
    private location: Location,
    private modalService: ModalService,
    private service: CommonService,
    private route: ActivatedRoute,
    private toastr: NzMessageService,
    public planService: PlanService
  ) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
    this.taskId = this.route.snapshot.queryParamMap.get('taskId');
    this.teamId = this.route.snapshot.queryParamMap.get('teamId');
    this.boardId = this.route.snapshot.queryParamMap.get('boardId');
    //this.userType = localStorage.getItem('userType');
    this.getTaskDetails(this.taskId);
    this.getAllMembers();
    this.getNotes();
    this.initForm();
    this.getPhaes();
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

    this.notesForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });

    this.completeForm = new FormGroup({
      actualHours: new FormControl('', numberOnlyValidator),
      actualMinutes: new FormControl('', minutesRangeValidator)
    });

    this.Form = new FormGroup({
      title: new FormControl('', Validators.required),
      // selectedTeamId: new FormControl('', Validators.required),
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
        validators: this.dateRangeValidator as any
      }
    );
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  getAllMembers() {
    this.service
      .get(`user/teams/${this.teamId}`)
      .subscribe({
        next: (resp: any) => {
          // keep only team members
          const teamUsers = resp.data.team_users || [];

          this.teamMembersList = teamUsers.filter(
            (member: any) => member.status === 'Accepted'
          );
        },
        error: (error) => {
          console.log(error.message);
        },
      });
  }

  getPhaes() {
    this.service.get(`user/phases?team_id=${this.teamId}`).subscribe({
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
      formURlData.append('team_id', this.teamId);
      formURlData.append('assign_to', this.Form.value.memberId);
      formURlData.append('phase_id', this.Form.value.phaseId);
      formURlData.append('start_date', this.formatDateTime(this.Form.value.startDate));
      formURlData.append('due_date', this.formatDateTime(this.Form.value.endDate));
      formURlData.append('priority', this.Form.value.priority);
      formURlData.append('is_private', this.Form.value.isPrivate ? '1' : '0');
      formURlData.append('estimated_hours', this.Form.value.estimatedHours);
      formURlData.append('estimated_minutes', this.Form.value.estimatedMinutes);
      formURlData.append('is_urgent', this.Form.value.is_urgent ? '1' : '0');
      formURlData.append('goal_relevant', this.Form.value.isGoalRevelant ? '1' : '0');

      this.service.post(`user/tasks/${this.taskId}`, formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.getTaskDetails(this.taskId);
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.getTaskDetails(this.taskId);
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

  getTaskDetails(taskId: any) {
    this.loading = true;
    this.service.get(`user/tasks/${taskId}`).subscribe({
      next: (resp: any) => {
        this.taskDetails = resp.data;
        this.taskName = resp.data.title;
        this.actualTime = `${resp.data.estimated_hours} hr ${resp.data.estimated_minutes} min`;
        this.Form.patchValue({
          title: resp.data.title,
          description: resp.data.description || '',
          phaseId: resp.data.phase_id,
          priority: resp.data.priority,
          startDate: this.toDateOnly(resp.data.start_date),
          endDate: this.toDateOnly(resp.data.due_date),
          memberId: resp.data.assigned_to.user_id,
          isGoalRevelant: resp.data.goal_relevant,
          is_urgent: resp.data.is_urgent,
          estimatedMinutes: resp.data.estimated_minutes,
          estimatedHours: resp.data.estimated_hours,
          isPrivate: resp.data.is_private
        });
        this.loading = false;
      },
      error: (error) => {
        console.log(error.message);
        this.loading = false;
      }
    });
  }

  getNotes() {
    this.service.get(`user/notes?task_id=${this.taskId}`).subscribe({
      next: (resp: any) => {
        this.noteList = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmitNotes() {
    this.notesForm.markAllAsTouched();

    const title = this.notesForm.value.title?.trim();

    if (!title) {
      return;
    }

    if (this.notesForm.valid) {
      this.loading = true;
      const formURlData: any = new URLSearchParams();
      formURlData.append('title', title);
      formURlData.append('description', this.notesForm.value.description);
      formURlData.append('task_id', this.taskId);

      this.service.post('user/notes', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAddNotes.nativeElement.click();
            this.getNotes();
            // this.boardId = null;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.getNotes();
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

  deleteTask() {
    this.loading = true;
    this.service.get(`user/deleteTaskByThereId?id=${this.taskId}`).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.backClicked();
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  submitTask() {
    if (this.completeForm.invalid) {
      this.completeForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { actualHours, actualMinutes } = this.completeForm.value;

    const formURlData: any = new URLSearchParams();
    formURlData.set('actual_hours', actualHours);
    formURlData.set('actual_minutes', actualMinutes);
    formURlData.set('task_id', Number(this.taskId));

    this.service.post('user/task-complete', formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.closeModalComplete.nativeElement.click();
        resp.success
          ? this.toastr.success(resp.message)
          : this.toastr.warning(resp.message);
        this.getTaskDetails(this.taskId);
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(
          error.error?.message || error.message || 'Something went wrong!'
        );
      },
    });
  }

  backClicked() {
    this.location.back();
  }

  private formatDateTime(value: string): string {
    if (!value) return '';

    const date = new Date(value);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = '00';

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }

  dateValidation() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  dateRangeValidator(group: FormGroup) {
    const from = group.get('startDate')?.value;
    const to = group.get('endDate')?.value;

    if (from && to && to < from) {
      return { dateInvalid: true };
    }

    return null;
  }

  private toDateOnly(value: string): string {
    if (!value) return '';
    return value.split('T')[0]; // YYYY-MM-DD
  }


}
