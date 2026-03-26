import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonService } from '../../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalService } from '../../../../services/modal.service';
import { SubscriptionModalComponent } from '../../../shared/subscription-modal/subscription-modal.component';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './my-task-details.component.html',
  styleUrl: './my-task-details.component.css'
})
export class MyTaskDetailsComponent {

  taskId: any;
  Form!: FormGroup;
  notesForm!: FormGroup;
  loading: boolean = false;
  userId: any;
  phaseList: any;
  minDate: any;
  taskDetails: any;
  noteList: any;
  userType: any;
  completeForm!: FormGroup;
  actualTime: any;
  @ViewChild('closeModalComplete') closeModalComplete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;
  @ViewChild('closeModalAddNotes') closeModalAddNotes!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(
    private service: CommonService,
    private location: Location,
    private route: ActivatedRoute,
    private toastr: NzMessageService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.userId = localStorage.getItem('user_id');
    this.taskId = this.route.snapshot.queryParamMap.get('taskId');
    this.getTaskDetails();
    this.initForm();
    this.dateValidation();
    this.getPhaes();
    this.getNotes();
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
      estimatedHours: new FormControl('', numberOnlyValidator),
      estimatedMinutes: new FormControl('', minutesRangeValidator),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      isPrivate: new FormControl(false),
      isGoalRevelant: new FormControl(false),
      is_urgent: new FormControl(false),
      // memberId: new FormControl('', Validators.required),
      phaseId: new FormControl('', Validators.required)
    },
      {
        validators: this.dateRangeValidator as any   // <-- FIX
      }
    );
  }

  getTaskDetails() {
    // this.loading = true;
    this.service.get(`user/tasks/${this.taskId}`).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.taskDetails = resp.data;
        this.actualTime = `${resp.data.estimated_hours} hr ${resp.data.estimated_minutes} min`;
        this.Form.patchValue({
          title: resp.data.title,
          description: resp.data.description || '',
          phaseId: resp.data.phase_id,
          priority: resp.data.priority,
          startDate: this.toDateOnly(resp.data.start_date),
          endDate: this.toDateOnly(resp.data.due_date),
          //isPrivate: item.is_private,
          isGoalRevelant: resp.data.goal_relevant,
          estimatedMinutes: resp.data.estimated_minutes,
          estimatedHours: resp.data.estimated_hours,
          is_urgent: resp.data.is_urgent,
        });
      },
      error: (error) => {
        this.loading = false;
        console.log(error.message);
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

  backClicked() {
    this.location.back();
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  dateValidation() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure two-digit month
    const day = today.getDate().toString().padStart(2, '0'); // Ensure two-digit day
    this.minDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  }

  dateRangeValidator(group: FormGroup) {
    const from = group.get('startDate')?.value;
    const to = group.get('endDate')?.value;

    if (from && to && to < from) {
      return { dateInvalid: true };
    }

    return null;
  }

  deleteTask() {
    this.service.delete(`user/deleteTaskByThereId?id=${this.taskId}`).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.router.navigateByUrl('/individual/my-task');
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getPhaes() {
    this.service.get(`user/phases`).subscribe({
      next: (resp: any) => {
        const phases = Array.isArray(resp.data) ? resp.data : [];
        this.phaseList = phases.filter((phase: any) => phase.team_id == null);
        // this.filterTable();
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
      // formURlData.append('team_id', '0');
      formURlData.append('assign_to', this.userId);
      formURlData.append('phase_id', this.Form.value.phaseId);
      formURlData.append('start_date', this.Form.value.startDate);
      formURlData.append('due_date', this.Form.value.endDate);
      formURlData.append('priority', this.Form.value.priority);
      formURlData.append('estimated_hours', this.Form.value.estimatedHours);
      formURlData.append('estimated_minutes', this.Form.value.estimatedMinutes);
      // formURlData.append('is_private', this.Form.value.isPrivate ? '1' : '0');
      formURlData.append('is_private', '0');
      formURlData.append('goal_relevant', this.Form.value.isGoalRevelant ? '1' : '0');
      formURlData.append('is_urgent', this.Form.value.is_urgent ? '1' : '0');

      this.service.post(`user/tasks/${this.taskId}`, formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.getTaskDetails();
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.taskId = null;
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
            // this.service.triggerRefresh();
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

  submitTask() {
    if (this.completeForm.invalid) {
      this.completeForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { actualHours, actualMinutes } = this.completeForm.value;

    const formURlData = new URLSearchParams();
    formURlData.set('actual_hours', actualHours);
    formURlData.set('actual_minutes', actualMinutes);
    formURlData.set('task_id', this.taskId);

    this.service.post('user/task-complete', formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.closeModalComplete.nativeElement.click();
        resp.success
          ? this.toastr.success(resp.message)
          : this.toastr.warning(resp.message);
        this.getTaskDetails();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(
          error.error?.message || error.message || 'Something went wrong!'
        );
      },
    });
  }

  private toDateOnly(value: string): string {
    if (!value) return '';
    return value.split('T')[0]; // YYYY-MM-DD
  }


}
