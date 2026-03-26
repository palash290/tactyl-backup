import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {


  allMembers: any;
  userId: any;

  constructor(private location: Location, private service: CommonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.getUsers();
  }

  getUsers() {
    this.service.get(`user/fetchMembersDetailsByThereIds?member_id=${this.userId}`).subscribe({
      next: (resp: any) => {
        this.allMembers = resp.data;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  backClicked() {
    this.location.back();
  }


}
