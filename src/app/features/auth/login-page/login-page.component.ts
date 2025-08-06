import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthFacadeService } from '../../../core/facades/auth-facade.service';

// todo: move it out
export interface LoginFormGroupModel {
  username: FormControl<string>
  password: FormControl<string>
}


@Component({
  selector: 'app-login-page',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  readonly error: WritableSignal<string> = signal('');

  readonly form: FormGroup<LoginFormGroupModel> = new FormGroup({
    username: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    password: new FormControl<string>('', { validators: Validators.required, nonNullable: true })
  });

  submit(): void {
    const formValue = this.form.getRawValue();
    this.authFacade.login(formValue.username, formValue.password).subscribe({
      next: () => {
        this.error.set('');
        this.form.reset();
        // Navigation is handled in the authFacade
      },
      error: (err) => {
        console.error('Login failed', err);
        this.error.set('Login failed. Please check your credentials and try again.');
      }
    });
  }
}
