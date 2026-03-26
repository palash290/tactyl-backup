import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-permissions',
  imports: [CommonModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent {

  teamId: any;
  userId: any;
  permissions: Array<{ permission_id: number; name: string }> = [];
  selectedPermissionIds = new Set<number>();
  saving: boolean = false;
  loading: boolean = false;

  constructor(
    private service: CommonService,
    private toastr: NzMessageService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.teamId = this.route.snapshot.queryParamMap.get('teamId');
    this.userId = this.route.snapshot.queryParamMap.get('memberId');
    this.getTeamPermissionsForUsers();
  }

  getTeamPermissions() {
    this.service.get(`public/team-permissions`).subscribe({
      next: (resp: any) => {
        const list = Array.isArray(resp) ? resp : resp?.data;
        this.permissions = (Array.isArray(list) ? list : [])
        .filter((item: any) => item.permission_id !== 4);
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getTeamPermissionsForUsers() {
    this.service.get(`user/team/user-permissions?team_id=${this.teamId}&user_id=${this.userId}`).subscribe({
      next: (resp: any) => {
        const list = Array.isArray(resp?.data) ? resp.data : [];
        this.selectedPermissionIds = new Set(
          list.map((item: any) => item.permission_id)
        );
        this.getTeamPermissions();
      },
      error: (error) => {
        console.log(error.message);
        this.getTeamPermissions();
      }
    });
  }

  togglePermission(permissionId: number, event: any) {
    if (event.target.checked) {
      this.selectedPermissionIds.add(permissionId);
    } else {
      this.selectedPermissionIds.delete(permissionId);
    }
  }

  isPermissionSelected(permissionId: number) {
    return this.selectedPermissionIds.has(permissionId);
  }

  submitPermissions() {
    if (!this.userId || !this.teamId) {
      this.toastr.warning('Missing team or user information');
      return;
    }

    const permissionIds = Array.from(this.selectedPermissionIds);
    if (permissionIds.length === 0) {
      this.toastr.warning('Please select at least one permission');
      return;
    }

    const payload = {
      team_id: Number(this.teamId),
      user_id: Number(this.userId),
      permission_ids: permissionIds
    };

    this.loading = true;

    this.saving = true;
    this.service.post(`user/teams/user-permissions`, payload).subscribe({
      next: (resp: any) => {
        this.saving = false;
        this.loading = false;
        if (resp?.success === true) {
          this.toastr.success(resp.message || 'Permissions updated');
        } else {
          this.toastr.warning(resp?.message || 'Failed to update permissions');
        }
      },
      error: (error) => {
        this.loading = false;
        this.saving = false;
        const msg =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          'Something went wrong!';
        this.toastr.error(msg);
      }
    });
  }

  backClicked() {
    this.location.back();
  }


}
