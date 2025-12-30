import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  providers: [UserServiceService],
  standalone: true
})
export class LoginScreenComponent implements OnInit {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  showSignUp: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      pass: ['', Validators.required],
    });

    // Initialize the sign-up form with validators
    this.signUpForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      login: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  toggleForm(): void {
    this.showSignUp = !this.showSignUp;
  }

  onSubmit(): void {
    console.log('Login form data:', this.loginForm.value);
    if (this.loginForm.valid) {
      const { login, pass } = this.loginForm.value;

      this.userService.login(login, pass).subscribe({
        next: (response) => {
          // Handle successful login          
          console.log('Login successful:', response);
          // Redirect to pollution list
          this.router.navigate(['/pollutions']);
        },
        error: (error) => {
          // Handle login error
          console.error('Login failed:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignUp(): void {
    console.log('Sign-up form data:', this.signUpForm.value);
    if (this.signUpForm.valid) {
      this.userService.addUser(this.signUpForm.value as User).subscribe({
        next: (response) => {
          // Handle successful sign-up                      
          console.log('Sign-up successful:', response);
          // Optionally redirect to login or auto-login
          this.showSignUp = false;
          this.signUpForm.reset();
        },
        error: (error) => {        
          console.error('Sign-up failed:', error);
        }
      });
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }
}
