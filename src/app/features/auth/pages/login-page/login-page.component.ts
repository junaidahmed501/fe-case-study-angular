import {ChangeDetectionStrategy, Component, inject, OnDestroy, signal, WritableSignal} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {Subject, takeUntil} from 'rxjs';
import {MatError} from '@angular/material/form-field';
import {FormErrorComponent} from '../../../../shared/components/form-error/form-error.component';
import {AuthFacadeService} from '../../../../core/facades/auth-facade.service';
import {LoginFormGroup} from '../../../../shared/models/login-form.model';

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
export class LoginPageComponent implements OnDestroy {
  private readonly authFacade = inject(AuthFacadeService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

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
      this.authFacade.login(loginData.username, loginData.password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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

  /**
   * Cleans up subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
