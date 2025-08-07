import {inject, Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginFormModel} from '../../../shared/models/forms/login-form.model';

@Injectable({ providedIn: 'root' })
export class AuthFormService {
  private fb = inject(FormBuilder);

  /**
   * Creates a form group for user login
   */
  createLoginForm(): FormGroup<LoginFormModel> {
    return this.fb.group<LoginFormModel>({
      username: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true
      }),
      password: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true
      })
    });
  }

  /**
   * Prepares login data for submission
   * @param formValue The form values
   */
  prepareLoginData(formValue: Partial<Record<keyof LoginFormModel, string>>): {
    username: string;
    password: string
  } {
    return {
      username: formValue.username || '',
      password: formValue.password || ''
    };
  }
}
