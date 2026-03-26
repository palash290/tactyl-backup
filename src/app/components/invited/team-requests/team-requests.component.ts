import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-team-requests',
  imports: [CommonModule],
  templateUrl: './team-requests.component.html',
  styleUrl: './team-requests.component.css'
})
export class TeamRequestsComponent {

  allRequests: any;
  id: any;
  loading: boolean = false;
  erroeMsg: any;
  @ViewChild('closeModalAccept') closeModalAccept!: ElementRef;
  @ViewChild('closeModalReject') closeModalReject!: ElementRef;

  constructor(private service: CommonService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.getAllRequests();
  }

  getAllRequests() {
    this.service.get('user/invitations').subscribe({
      next: (resp: any) => {
        this.allRequests = resp.data.reverse();
        // this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
        this.erroeMsg = error.message;
      }
    });
  }


  getId(id: any) {
    this.id = id;
  }

  accept() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('team_user_id', this.id);
    formURlData.set('action', 'accept');
    this.service.post(`user/invitations/respond`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.closeModalAccept.nativeElement.click();
        this.toastr.success(resp.message);
        this.getAllRequests();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  reject() {
    this.loading = true;
    const formURlData = new URLSearchParams();
    formURlData.set('team_user_id', this.id);
    formURlData.set('action', 'reject');
    this.service.post(`user/invitations/respond`, formURlData.toString()).subscribe({
      next: (resp: any) => {
        this.closeModalReject.nativeElement.click();
        this.toastr.success(resp.message);
        this.getAllRequests();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
