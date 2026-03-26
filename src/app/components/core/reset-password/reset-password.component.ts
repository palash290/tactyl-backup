import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  Form!: FormGroup;
  passwordMismatch = false;
  loading: boolean = false;
  isPasswordVisible2: boolean = false;
  isPasswordVisible3: boolean = false;
  forgot_code: any;

  constructor(private service: CommonService, private toastr: NzMessageService, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.forgot_code = localStorage.getItem('forgot_code');
  }

  initForm() {
    this.Form = new FormGroup({
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', Validators.required),
    });
    //, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    this.Form.get('confirm_password')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  ngOnDestroy() {
    localStorage.setItem('forgot_code', '');
  }

  submitForm() {
    this.Form.markAllAsTouched();

    const newPassword = this.Form.value.new_password?.trim();

    if (!newPassword) {
      return;
    }

    if (this.Form.valid && !this.passwordMismatch) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('newPassword', this.Form.value.new_password);
      formURlData.set('forgot_code', this.forgot_code);
      this.service.post('public/reset-password', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toastr.success(resp.message);
            console.log(resp.message);
            this.Form.reset();
            this.loading = false;
            this.router.navigateByUrl('/');
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastr.warning(error.message);
          console.error('Login error:', error.message);
        }
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.Form.get('new_password')?.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return { passwordMismatch: true };
      } else {
        this.passwordMismatch = false;
        return null;
      }
    };
  }

  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }

  togglePasswordVisibility3() {
    this.isPasswordVisible3 = !this.isPasswordVisible3;
  }


}
