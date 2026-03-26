import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-notes',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './view-notes.component.html',
  styleUrl: './view-notes.component.css'
})
export class ViewNotesComponent {

  noteId: any;
  noteDetails: any;
  Form!: FormGroup;
  loading: boolean = false;
  taskId: any;
  userType: any;
  @ViewChild('closeModalAdd') closeModalAdd!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private location: Location, private service: CommonService, private route: ActivatedRoute, private toastr: NzMessageService) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.queryParamMap.get('taskId');
    this.noteId = this.route.snapshot.queryParamMap.get('noteId');
    this.userType = localStorage.getItem('userType');
    this.initForm();
    this.getNotes();
  }

  initForm() {
    this.Form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  getNotes() {
    this.service.get(`user/notes/${this.noteId}`).subscribe({
      next: (resp: any) => {
        this.noteDetails = resp.data;
        this.Form.patchValue({
          title: resp.data.title,
          description: resp.data.description,
        });
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
      formURlData.append('title', title);
      formURlData.append('description', this.Form.value.description);
      // formURlData.append('task_id', this.taskId);

      this.service.patch(`user/notes/${this.noteId}`, formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModalAdd.nativeElement.click();
            this.getNotes();
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

  backClicked() {
    this.location.back();
  }

  deleteTeam() {
    this.service.delete(`user/notes/${this.noteId}`).subscribe({
      next: (resp: any) => {
        this.closeModalDelete.nativeElement.click();
        this.toastr.success(resp.message);
        this.backClicked();
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


}
