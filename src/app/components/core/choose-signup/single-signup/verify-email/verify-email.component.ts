import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '../../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { ValidationErrorService } from '../../../../../services/validation-error.service';

@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, CommonModule, RouterLink,
    NzFlexDirective, NzInputOtpComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {


  Form: FormGroup;
  atValues: any;
  htmlText: string = '';
  loading: boolean = false;
  isLoadingResend: boolean = false;
  email: any;
  type: any;

  constructor(private fb: FormBuilder, private toastr: NzMessageService,
    private service: CommonService, private router: Router, private route: ActivatedRoute, public validationErrorService: ValidationErrorService
  ) {
    this.Form = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.email = params['email'] || '';
      this.type = params['type'] || '';
    });
  }


  onSubmit() {
    this.Form.markAllAsTouched()
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('otp', this.Form.value.otp);
      formURlData.set('email', this.email);
      this.service
        .post('public/verify-otp', formURlData.toString())
        .subscribe({
          next: (resp: any) => {
            if (resp.success == true) {
              this.loading = false;
              this.toastr.success(resp.message);
              this.router.navigateByUrl('/login');
            } else {
              this.loading = false;
              this.toastr.warning(resp.message);
            }
          },
          error: (error: any) => {
            this.loading = false;

            const msg =
              error.error?.message ||
              error.error?.error ||
              error.message ||
              "Something went wrong!";

            this.toastr.error(msg);
          }
        })
    }
  }


  resendOtp() {
    this.isLoadingResend = true
    const formURlData = new URLSearchParams()
    formURlData.set('email', this.email)
    this.service
      .post('public/resend-otp', formURlData.toString())
      .subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.isLoadingResend = false;
            this.toastr.success(resp.message);
          } else {
            this.isLoadingResend = false;
            this.toastr.warning(resp.message);
          }
        },
        error: (error: any) => {
          this.isLoadingResend = false;
          this.toastr.warning(error || 'Something went wrong!');
        }
      })
  }


}
