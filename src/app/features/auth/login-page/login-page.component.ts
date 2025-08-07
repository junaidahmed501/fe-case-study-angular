import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AuthFacadeService} from '../../../core/facades/auth-facade.service';
import {LoginFormModel} from '../../../shared/models/forms/login-form.model';

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
    MatButton
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly router = inject(Router);

  readonly error: WritableSignal<string> = signal('');
  readonly form: FormGroup<LoginFormModel> = this.authFacade.createLoginForm();

  submit(): void {
    if (this.form.valid) {
      const loginData = this.authFacade.prepareLoginData(this.form.value);
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
