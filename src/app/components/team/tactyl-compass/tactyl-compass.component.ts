import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterLink } from '@angular/router';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';
import { ModalService } from '../../../services/modal.service';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-tactyl-compass',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SubscriptionModalComponent],
  templateUrl: './tactyl-compass.component.html',
  styleUrl: './tactyl-compass.component.css'
})
export class TactylCompassComponent {

  loading: boolean = false;
  list: any[] = [];
  filteredList: any[] = [];

  // Compass buckets
  doNow: any[] = [];
  doNext: any[] = [];
  doLater: any[] = [];
  doLast: any[] = [];

  // Filters
  searchText: string = '';
  selectedTeam: string = '';
  selectedBoard: string = '';
  selectedPhase: string = '';

  teams: any[] = [];
  boards: any[] = [];
  phases: any[] = [];
  completeForm!: FormGroup;
  userType: any;
  @ViewChild('closeModalComplete') closeModalComplete!: ElementRef;

  constructor(
    private service: CommonService,
    private toastr: NzMessageService,
    private modalService: ModalService,
    public planService: PlanService
  ) { }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    const numberOnlyValidator = [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ];

    const minutesRangeValidator = [
      ...numberOnlyValidator,
      Validators.min(0),
      Validators.max(60),
    ];

    this.service.get('user/teams').subscribe((res: any) => this.teams = res.data);
    this.service.get('user/boards').subscribe((res: any) => this.boards = res.data);
    this.service.get('user/phases').subscribe((res: any) => this.phases = res.data);

    this.getDetails();

    this.completeForm = new FormGroup({
      actualHours: new FormControl('', numberOnlyValidator),
      actualMinutes: new FormControl('', minutesRangeValidator)
    });
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  /* ================= API FETCH ================= */

  getDetails() {
    this.loading = true;
    this.service.get(`user/tasks-compass`).subscribe({
      next: (resp: any) => {
        this.list = resp.data || [];
        this.filteredList = [...this.list];

        this.buildCompass(this.filteredList);

        this.buildEstimatedHoursBuckets(this.filteredList);
        this.loading = false;
      },
      error: (err) => {
        console.log(err)
        this.loading = false;
      }

    });
  }

  /* ================= COMPASS (ACTION SCORE) ================= */

  buildCompass(tasks: any[]) {

    this.doNow = [];
    this.doNext = [];
    this.doLater = [];
    this.doLast = [];

    tasks.forEach(task => {

      const score = Number(task.action_score) || 0;

      if (score >= 7) {
        this.doNow.push(task);
      }
      else if (score >= 5) {
        this.doNext.push(task);
      }
      else if (score >= 3) {
        this.doLater.push(task);
      }
      else {
        this.doLast.push(task);
      }
    });

    // 🔹 Sort by highest Action Score
    this.doNow.sort((a, b) => b.action_score - a.action_score);
    this.doNext.sort((a, b) => b.action_score - a.action_score);
    this.doLater.sort((a, b) => b.action_score - a.action_score);
    this.doLast.sort((a, b) => b.action_score - a.action_score);
  }


  getQuadrant(score: number): string {
    if (score >= 7) return 'Do Now';
    if (score >= 5) return 'Do Next';
    if (score >= 3) return 'Do Later';
    return 'Do Last';
  }

  /* ================= ESTIMATED HOURS (PRIORITY + URGENCY ONLY) ================= */

  doNowHoursTasks: any[] = [];
  doNextHoursTasks: any[] = [];
  doLaterHoursTasks: any[] = [];
  doLastHoursTasks: any[] = [];

  buildEstimatedHoursBuckets(tasks: any[]) {

    this.doNowHoursTasks = [];
    this.doNextHoursTasks = [];
    this.doLaterHoursTasks = [];
    this.doLastHoursTasks = [];

    tasks.forEach(task => {

      const isP1P2 = ['P1', 'P2'].includes(task.priority);
      const isP3P4 = ['P3', 'P4'].includes(task.priority);
      const isUrgent = task.is_urgent === 1;

      if (isP1P2 && isUrgent) {
        this.doNowHoursTasks.push(task);
      }

      if (isP1P2 && !isUrgent) {
        this.doNextHoursTasks.push(task);
      }

      if (isP3P4 && isUrgent) {
        this.doLaterHoursTasks.push(task);
      }

      if (isP3P4 && !isUrgent) {
        this.doLastHoursTasks.push(task);
      }
    });
  }


  /* ================= HOURS CALCULATION ================= */

  getTaskMinutes(task: any): number {
    const hrs = Number(task.estimated_hours) || 0;
    const mins = Number(task.estimated_minutes) || 0;
    return (hrs * 60) + mins;
  }


  getTotalHours(tasks: any[]): string {

    const totalMinutes = tasks.reduce((sum, task) => {
      return sum + this.getTaskMinutes(task);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }


  // 🔹 Search + Filter handler
  applyFilters() {
    this.filteredList = this.list.filter(task => {

      const searchMatch =
        !this.searchText ||
        task.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        task.board_name?.toLowerCase().includes(this.searchText.toLowerCase());
      task.phase_name?.toLowerCase().includes(this.searchText.toLowerCase());

      const teamMatch =
        !this.selectedTeam || task.team_id == this.selectedTeam;

      const boardMatch =
        !this.selectedBoard || task.board_id == this.selectedBoard;

      const phaseMatch =
        !this.selectedPhase || task.phase_id == this.selectedPhase;

      return searchMatch && teamMatch && boardMatch && phaseMatch;
    });

    this.buildCompass(this.filteredList);
  }

  onTeamChange() {
    if (!this.selectedTeam) {
      this.selectedBoard = '';
      this.selectedPhase = '';
    }
    this.applyFilters();
  }

  onBoardChange() {
    if (!this.selectedBoard) {
      this.selectedPhase = '';
    }
    this.applyFilters();
  }

  taskName: any;
  actualTime: any;
  taskId: any;

  getTaskDet(det: any) {
    this.taskName = det.title;
    this.taskId = det.id;
    this.actualTime = `${det.estimated_hours} hr ${det.estimated_minutes} min`;
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

    this.service.post('user/changeTaskStatus', formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.closeModalComplete.nativeElement.click();
        resp.success
          ? this.toastr.success(resp.message)
          : this.toastr.warning(resp.message);
        this.getDetails();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(
          error.error?.message || error.message || 'Something went wrong!'
        );
      },
    });
  }


}
