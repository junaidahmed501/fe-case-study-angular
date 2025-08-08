import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AuthFacadeService} from '../../../core/facades/auth-facade.service';
import {LoginFormGroup} from '../../../shared/models/forms/login-form.model';
import {FormErrorComponent} from '../../../shared/components/form-error/form-error.component';
import {MatError} from '@angular/material/form-field';

/**
 * Login page component that handles user authentication
 * Displays login form and manages authentication flow
 */
@Component({
  selector: 'app-login-page',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatCard,
    ReactiveFormsModule,
    MatButton,
    FormErrorComponent,
    MatError
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  readonly error: WritableSignal<string> = signal('');
  readonly form: LoginFormGroup = this.authFacade.createLoginForm();
  readonly loading = this.authFacade.loading;

    /**
   * Handles form submission for login
   * Validates form and authenticates user via auth facade
   */
  submit(): void {
      this.form.markAllAsTouched();
    if (this.form.valid) {
      const loginData = this.authFacade.prepareLoginData(this.form.getRawValue());
      this.authFacade.login(loginData.username, loginData.password).subscribe({
        next: () => {
          this.error.set('');
          this.form.reset();
          this.router.navigate(['/users']);
        },
        error: () => {
          this.error.set('Login failed. Please check your credentials and try again.');
        }
      });
    }
  }
}
