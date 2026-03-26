import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-team',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.css'
})
export class CreateTeamComponent {

  Form!: FormGroup;
  loading: boolean = false;
  managerId: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;


  constructor(private fb: FormBuilder, private router: Router, private toastr: NzMessageService, private service: CommonService, private route: ActivatedRoute) {
    this.Form = this.fb.group({
      teamName: ['', Validators.required],     // FIXED TEAM NAME
      members: this.fb.array([this.createMember()])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.managerId = params['managerId'] || '';
    });
  }

  get members(): FormArray {
    return this.Form.get('members') as FormArray;
  }

  createMember(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required]
    });
  }

  // addMember() {
  //   if (this.members.length < 5) {
  //     this.members.push(this.createMember());
  //   }
  // }

  removeMember(index: number) {
    if (this.members.length > 1) {
      this.members.removeAt(index);
    }
  }

  submitForm() {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      managerId: this.managerId,
      team_name: this.Form.value.teamName,
      members: this.Form.value.members
    };

    this.service.post('user/createTeam', payload).subscribe({
      next: (resp: any) => {
        this.loading = false;

        if (resp.success === true) {
          this.toastr.success(resp.message || "Invitations sent successfully!");
          this.router.navigate(['/choose-login']);
        } else {
          this.toastr.warning(resp.message || "Failed to send invitation!");
        }
      },
      error: (error) => {
        this.loading = false;

        const msg =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          "Something went wrong!";

        this.toastr.error(msg);
      }
    });
  }


  addMember() {
    const lastMember = this.members.at(this.members.length - 1);

    lastMember.markAllAsTouched();

    if (lastMember.invalid) {
      return;
    }

    const email = lastMember.get('email')?.value;

    if (!email) return;

    this.loading = true;

    const payload = {
      email: email
    };

    this.service.post('user/emailAlreadyExists', payload).subscribe({
      next: (resp: any) => {
        this.loading = false;

        if (resp.success == true) {
          // Email already registered → Add new member row
          if (this.members.length < 5) {
            this.members.push(this.createMember());

            setTimeout(() => {
              this.scrollToBottom();
            }, 100);

            //this.toastr.success("Member added successfully!");
          }
        } else {
          // Not registered → Show warning
          this.toastr.warning(resp.message || "Email is not registered!");
        }
      },
      error: (error) => {
        this.loading = false;

        const msg =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          "Something went wrong!";

        this.toastr.error(msg);
      }
    });
  }

  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }



}
