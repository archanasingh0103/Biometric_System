import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {

    console.log("Button clicked");

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log("Form Invalid");
      return;
    }

    this.loading = true;

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log(payload);

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = "Invalid credentials";
      }
    });
  }


//   login() {
//   if (this.loginForm.invalid) return;

//   const payload = {
//     loginName: this.loginForm.value.loginName.trim(),
//     password: this.loginForm.value.password.trim()
//   };

//   console.log(payload);

//   this.authService.login(payload).subscribe({
//     next: (res:any) => {
//       localStorage.setItem('token', res.token);
//       this.router.navigate(['/dashboard']);
//     },
//     error: (err) => {
//       console.log(err);
//       this.errorMessage = err?.error?.message || 'Invalid credentials ❌';
//     }
//   });
// }
}
