import {inject, Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../shared/models/user';
import {UserFormModel} from '../../../shared/models/forms/user-form.model';

@Injectable({ providedIn: 'root' })
export class UserFormService {
  private fb = inject(FormBuilder);

  /**
   * Creates a form group for user creation or editing
   * @param user Optional user data to populate the form
   */
  createUserForm(user: User | null = null): FormGroup<UserFormModel> {
    const form = this.fb.group<UserFormModel>({
      username: this.fb.control(user?.username || '', Validators.required),
      role: this.fb.control(user?.role || '', Validators.required),
      password: this.fb.control('')
    });

    // Configure password validation based on whether we're creating or editing
    if (!user?.id) {
      // For new users, password is required
      form.get('password')?.setValidators(Validators.required);
    } else {
      // For existing users, password is optional but if provided must meet requirements
      form.get('password')?.setValidators(
        (control) => control.value ? Validators.minLength(6)(control) : null
      );
    }
    form.get('password')?.updateValueAndValidity();

    return form;
  }

  /**
   * Prepares user data for submission based on form values
   * @param formValue The form values
   * @param existingUser Optional existing user data to merge with
   */
  prepareUserDataToSave(formValue: Partial<Record<keyof UserFormModel, string | null>>, existingUser: User | null = null): Partial<User> {
    const userData: Partial<User> = {
      ...existingUser,
      username: formValue.username || '',
      role: formValue.role || '',
    };

    // Only include password if it was entered
    if (formValue.password) {
      userData.password = formValue.password;
    }

    return userData;
  }

  prepareUserDataToUpdate(formValue: Partial<Record<keyof UserFormModel, string | null>>, existingUser: User | null = null): Partial<User> {
    const userData: Partial<User> = {
      ...existingUser,
      username: formValue.username || '',
      role: formValue.role || '',
    };

    // Only include password if it was entered
    if (formValue.password) {
      userData.password = formValue.password;
    }

    return userData;
  }
}
