import {inject, Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginFormControls, LoginFormGroup, LoginFormValues} from '../../../shared/models/forms/login-form.model';

@Injectable({ providedIn: 'root' })
export class AuthFormService {
  private readonly fb = inject(FormBuilder);

  /**
   * Creates a form group for user login
   * @returns Typed login form group
   */
  createLoginForm(): LoginFormGroup {
    return this.fb.group<LoginFormControls>({
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
   * @returns Sanitized login form values
   */
  prepareLoginData(formValue: Partial<LoginFormValues>): LoginFormValues {
    return {
      username: formValue.username || '',
      password: formValue.password || ''
    };
  }
}
