import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AuthFacadeService} from '../../../core/facades/auth-facade.service';
import {LoginFormGroup} from '../../../shared/models/forms/login-form.model';
import {FormErrorComponent} from '../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    ReactiveFormsModule,
    MatButton,
    FormErrorComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  readonly error: WritableSignal<string> = signal('');
  readonly form: LoginFormGroup = this.authFacade.createLoginForm();

  submit(): void {
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
    } else {
      this.form.markAllAsTouched()
      // Mark all fields as touched to show validation errors
      // Object.keys(this.form.controls).forEach(key => {
      //   this.form.get(key)?.markAsTouched();
      // });
    }
  }
}
