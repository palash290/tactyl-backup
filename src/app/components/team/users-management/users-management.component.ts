import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-users-management',
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent {

  allMembers: any;
  memberId: any;
  filteredData: any[] = [];
  searchText: string = '';
  p: any = 1;

  constructor(private service: CommonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.memberId = this.route.snapshot.queryParamMap.get('memberId');
    this.getUsers();
  }

  getUsers() {
    this.service.get(`user/fetchAllIndividualsMembers`).subscribe({
      next: (resp: any) => {
        this.allMembers = resp.data;
        this.filterTable();
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  filterTable() {
    this.p = 1;
    let filtered = this.allMembers;

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter((item: { name: any; email: any; }) =>
      (item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword))
      );
    }
    this.filteredData = filtered;
  }


}
