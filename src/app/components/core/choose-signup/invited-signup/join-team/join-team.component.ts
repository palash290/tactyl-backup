import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ValidationErrorService } from '../../../../../services/validation-error.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-join-team',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './join-team.component.html',
  styleUrl: './join-team.component.css'
})
export class JoinTeamComponent {

  Form: FormGroup;
  loading: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(private service: CommonService, private router: Router, private fb: FormBuilder, public validationErrorService: ValidationErrorService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  type: string = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'] || '';
      console.log("Selected Type =", this.type);
    });
  }

  verify() {
    // if (!this.type) {
    //   console.warn("Type missing, redirecting to default...");
    //   return;
    // }

    this.Form.markAllAsTouched();

    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.Form.value.email);
      formURlData.set('password', this.Form.value.password);
      formURlData.set('role', '1');
      // if (this.type == 'individual') {
      //   formURlData.set('role', '1');
      // }
      // if (this.type == 'team') {
      //   formURlData.set('role', '2');
      // }
      this.service.post('user/signIn', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.service.setToken(resp.data);
            this.loading = false;
            this.router.navigate(['/individual/dashboard']);
            // if (this.type == 'team') {
            //   this.router.navigate(['/team/dashboard']);
            // } else if (this.type === 'individual') {
            //   this.router.navigate(['/individual/dashboard']);
            // }
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
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
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
