import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { AccesTokenState } from '../../shared/states/acces-token-state';

// Custom validator for password
function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null;
  }

  const hasNumber = /\d/.test(value);
  const hasMinLength = value.length >= 8;
  const isAlphanumeric = /^[A-Za-z0-9]*$/.test(value);

  const passwordValid = hasNumber && hasMinLength && isAlphanumeric;

  if (!passwordValid) {
    return {
      passwordStrength: {
        hasNumber,
        hasMinLength,
        isAlphanumeric
      }
    };
  }

  return null;
}

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  standalone: true
})
export class LoginScreenComponent implements OnInit {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  showSignUp: boolean = false;
  loginErrorMessage: string = '';
  signUpErrorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      pass: ['', [Validators.required]],
    });

    // Initialize the sign-up form with validators
    this.signUpForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.maxLength(50)]],
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      pass: ['', [Validators.required, passwordValidator]],
    });
  }

  toggleForm(): void {
    this.showSignUp = !this.showSignUp;
    this.loginErrorMessage = '';
    this.signUpErrorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.signUpForm.reset();
  }

  onSubmit(): void {
    this.loginErrorMessage = '';
    this.successMessage = '';

    if (this.loginForm.valid) {
      const { login, pass } = this.loginForm.value;

      this.userService.login(login, pass).subscribe({
        next: (response) => {
          // Handle successful login
          console.log('Login successful:', response);
          
          // Debug: Check if token is in store after a small delay
          setTimeout(() => {
            const token = this.store.selectSnapshot(AccesTokenState.getAccessToken);
            console.log('🔍 DEBUG - Token dans le store après login:', token);
            console.log('🔍 DEBUG - LocalStorage:', localStorage.getItem('@@STATE'));
          }, 100);
          
          this.successMessage = 'Connexion réussie ! Redirection...';
          // Redirect to pollution list after a short delay
          setTimeout(() => {
            this.router.navigate(['/pollutions']);
          }, 1000);
        },
        error: (error) => {
          // Handle login error
          console.error('Login failed:', error);
          if (error.status === 404 || error.status === 401) {
            this.loginErrorMessage = 'Identifiant ou mot de passe incorrect';
          } else if (error.error && error.error.message) {
            this.loginErrorMessage = error.error.message;
          } else {
            this.loginErrorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginErrorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  onSignUp(): void {
    this.signUpErrorMessage = '';
    this.successMessage = '';

    if (this.signUpForm.valid) {
      this.userService.addUser(this.signUpForm.value as User).subscribe({
        next: (response) => {
          // Handle successful sign-up
          console.log('Sign-up successful:', response);
          this.successMessage = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
          // Switch to login form after a short delay
          setTimeout(() => {
            this.showSignUp = false;
            this.signUpForm.reset();
            this.successMessage = '';
          }, 2000);
        },
        error: (error) => {
          console.error('Sign-up failed:', error);
          if (error.status === 409) {
            this.signUpErrorMessage = 'Ce nom d\'utilisateur existe déjà. Veuillez en choisir un autre.';
          } else if (error.error && error.error.message) {
            this.signUpErrorMessage = error.error.message;
          } else {
            this.signUpErrorMessage = 'Erreur lors de la création du compte. Veuillez réessayer.';
          }
        }
      });
    } else {
      this.signUpForm.markAllAsTouched();
      this.signUpErrorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passControl = this.signUpForm.get('pass');
    
    if (passControl && passControl.touched && passControl.errors) {
      const strengthErrors = passControl.errors['passwordStrength'];
      if (strengthErrors) {
        if (!strengthErrors.hasMinLength) {
          errors.push('Le mot de passe doit contenir au minimum 8 caractères');
        }
        if (!strengthErrors.hasNumber) {
          errors.push('Le mot de passe doit contenir au moins 1 chiffre');
        }
        if (!strengthErrors.isAlphanumeric) {
          errors.push('Le mot de passe ne doit contenir que des lettres et des chiffres');
        }
      }
    }
    
    return errors;
  }
}
