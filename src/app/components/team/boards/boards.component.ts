import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../../services/common.service';
import { ModalService } from '../../../services/modal.service';
import { SubscriptionModalComponent } from '../../shared/subscription-modal/subscription-modal.component';

@Component({
  selector: 'app-boards',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, SubscriptionModalComponent],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.css'
})
export class BoardsComponent {

  Form!: FormGroup;
  boardList: any;
  loading: boolean = false;
  // teamId: any;
  filteredData: any[] = [];
  searchText: string = '';
  p: any = 1;
  boardId: any;
  selectedBoardId: any = '';
  // userType: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;

  constructor(
    private service: CommonService,
    private toastr: NzMessageService,
    private modalService: ModalService
  ) { }


  ngOnInit() {
    // this.userType = localStorage.getItem('userType');
    this.initForm();
    this.getBoards();
  }

  openSubs(): void {
    this.modalService.openSubscribeModal();
  }

  initForm() {
    this.Form = new FormGroup({
      title: new FormControl('', Validators.required),
      colour: new FormControl(''),
      description: new FormControl(''),
    });
  }

  fetchBoardDetails(id: any) {
    this.service.get(`user/boards/${id}`).subscribe({
      next: (resp: any) => {
        this.boardId = id;
        this.Form.patchValue({
          title: resp.data.board_name,
          description: resp.data.board_description || '',
          colour: resp.data.board_color
        });
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  reset() {
    this.boardId = '';
    this.Form.patchValue({
      title: '',
      description: '',
      colour: ''
    });
  }

  getBoards() {
    this.service.get(`user/boards`).subscribe({
      next: (resp: any) => {
        this.boardList = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.boardList;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { board_name: any; }) =>
        (item.board_name?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
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
      formURlData.append('board_name', title);
      formURlData.append('board_description', this.Form.value.description);
      formURlData.append('board_color', this.Form.value.colour || '#000000');
      // formURlData.append('team_id', 0);

      this.service.post(this.boardId ? `user/boards/${this.boardId}` : 'user/boards', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getBoards();
            this.boardId = null;
            // this.service.triggerRefresh();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.getBoards();
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
  reassignBoardList: any;
  isPhaseExists: boolean = false;

  getId(item: any) {
    this.id = item.board_id;
    this.isPhaseExists = item.total_phases > 0 ? true : false;

    this.service.get(`user/boards`).subscribe({
      next: (resp: any) => {

        this.reassignBoardList = resp.data.filter(
          (board: any) => board.board_id !== this.id
        );

        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }


  deleteBoard() {
    if (!this.selectedBoardId && this.isPhaseExists) {
      this.toastr.warning('Please select board first.');
      return
    }
    this.loading = true;
    const formURlData = new URLSearchParams();
    if (this.selectedBoardId) {
      formURlData.append('assign_board_id', this.selectedBoardId);
    }

    this.service.post(`user/delete-boards/${this.id}`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.getBoards();
        // this.service.triggerRefresh();
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
