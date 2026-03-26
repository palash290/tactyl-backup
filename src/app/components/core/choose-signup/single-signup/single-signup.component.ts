import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-single-signup',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './single-signup.component.html',
  styleUrl: './single-signup.component.css'
})
export class SingleSignupComponent {

  Form: FormGroup;
  loading: boolean = false;
  passwordMismatch = false;

  constructor(private service: CommonService, private router: Router, private fb: FormBuilder, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.Form = this.fb.group({
      name: ['', [Validators.required]],
      // designation: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      new_password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]],
      confirm_password: ['', Validators.required],
    });
    this.Form.get('confirm_password')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  type: string = '';

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.type = params['type'] || '';
      console.log("Selected Type =", this.type);
    });
  }

  sumbit() {
    // if (!this.type) {
    //   console.warn("Type missing, redirecting to default...");
    //   return;
    // }

    // if (this.type == 'team') {
    //   this.router.navigate(['/team/dashboard']);
    // } else if (this.type === 'individual') {
    //   this.router.navigate(['/individual/dashboard']);
    // }

    // return

    this.Form.markAllAsTouched();
    if (this.Form.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('full_name', this.Form.value.name);
      formURlData.set('password', this.Form.value.new_password);
      formURlData.set('email', this.Form.value.email);

      this.service.post('public/signUp', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.service.setToken(resp.data);
            this.toastr.success(resp.message);
            this.loading = false;
            this.router.navigate(['/verify-email'], {
              queryParams: { email: this.Form.value.email, type: this.type }
            });
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

  isPasswordVisible2: boolean = false;
  isPasswordVisible3: boolean = false;

  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }


  togglePasswordVisibility3() {
    this.isPasswordVisible3 = !this.isPasswordVisible3;
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

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      if (!value) return null;

      const hasUppercase = /[A-Z]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>\[\]\\\/_\-+=;']/.test(value);

      const errors: any = {};
      if (!hasUppercase) {
        errors.uppercaseRequired = true;
      }
      if (!hasSpecial) {
        errors.specialRequired = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

}
