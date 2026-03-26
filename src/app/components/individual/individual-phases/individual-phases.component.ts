import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../../services/common.service';
import { ModalService } from '../../../services/modal.service';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';

@Component({
  selector: 'app-individual-phases',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './individual-phases.component.html',
  styleUrl: './individual-phases.component.css'
})
export class IndividualPhasesComponent {

  Form!: FormGroup;
  boardList: any;
  phaseList: any;
  loading: boolean = false;
  // teamId: any;
  filteredData: any[] = [];
  searchText: string = '';
  p: any = 1;
  selectedPhaseId: any = '';
  phaseId: any;
  // userType: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService, private modalService: ModalService) { }


  ngOnInit() {
    // this.userType = localStorage.getItem('userType');
    this.initForm();
    this.getPhaes();
    this.getBoards();
  }

  initForm() {
    this.Form = new FormGroup({
      title: new FormControl('', Validators.required),
      boardId: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  fetchBoardDetails(item: any) {
    this.phaseId = item.phase_id;
    this.Form.patchValue({
      title: item.phase_name,
      description: item.phase_description || '',
      boardId: item.board_id
    });
  }

  reset() {
    this.phaseId = '';
    this.Form.patchValue({
      title: '',
      description: '',
      boardId: ''
    });
  }

  getPhaes() {
    this.service.get(`user/phases`).subscribe({
      next: (resp: any) => {
        this.phaseList = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.phaseList;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { phase_name: any; }) =>
        (item.phase_name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }

  getBoards() {
    this.service.get(`user/boards`).subscribe({
      next: (resp: any) => {
        this.boardList = resp.data;
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
      const formURlData: any = new URLSearchParams();
      formURlData.append('phase_name', title);
      formURlData.append('phase_description', this.Form.value.description);
      formURlData.append('board_id', this.Form.value.boardId);
      // formURlData.append('team_id', 0);

      this.service.post(this.phaseId ? `user/phases/${this.phaseId}` : 'user/phases', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getPhaes();
            this.phaseId = null;
            // this.service.triggerRefresh();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.getPhaes();
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
  isTaskExists: boolean = false;
  reassignPhasedList: any;

  getId(item: any) {
    this.id = item.phase_id;
    this.isTaskExists = item.total_tasks > 0 ? true : false;

    this.service.get(`user/phases`).subscribe({
      next: (resp: any) => {

        this.reassignPhasedList = resp.data.filter(
          (board: any) => board.phase_id !== this.id
        );

        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  deleteTeam() {
    if (!this.selectedPhaseId && this.isTaskExists) {
      this.toastr.warning('Please select phase first.');
      return
    }
    this.loading = true;
    const formURlData = new URLSearchParams();
    if (this.selectedPhaseId) {
      formURlData.append('assign_phase_id', this.selectedPhaseId);
    }

    this.service.post(`user/delete-phases/${this.id}`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.getPhaes();
        // this.service.triggerRefresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
