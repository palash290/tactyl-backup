import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CommonService } from '../../../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-team-member',
  imports: [CommonModule],
  templateUrl: './view-team-member.component.html',
  styleUrl: './view-team-member.component.css'
})
export class ViewTeamMemberComponent {

  allMembers: any;
  memberId: any;
  teamId: any;
  // taskList: any;

  constructor(private location: Location, private service: CommonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.memberId = this.route.snapshot.queryParamMap.get('memberId');
    this.teamId = this.route.snapshot.queryParamMap.get('teamId');
    this.getUsers();
  }

  getUsers() {
    this.service.get(`user/teams/${this.teamId}/user-details?user_id=${this.memberId}`).subscribe({
      next: (resp: any) => {
        this.allMembers = resp.data.users[0];
        // this.getUsertasks();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  // getUsertasks() {
  //   this.service.get(`user/fetchUsersTaskByTherUserId?team_id=${this.teamId}&user_id=${this.memberId}`).subscribe({
  //     next: (resp: any) => {
  //       this.taskList = resp.data.users_tasks || [];
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     }
  //   });
  // }

  backClicked() {
    this.location.back();
  }


}
