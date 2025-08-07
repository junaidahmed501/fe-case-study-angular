import {inject, Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CreateUserDto, UpdateUserDto, User} from '../../../shared/models/user.model';
import {UserFormGroup, UserFormValues} from '../../../shared/models/forms/user-form.model';
import {noTestUsernameValidator} from '../../../shared/validators/username.validators';

@Injectable({ providedIn: 'root' })
export class UserFormService {
  private fb = inject(FormBuilder);

  /**
   * Creates a form group for user creation or editing
   * @param user Optional user data to populate the form
   */
  createUserForm(user: User | null = null): UserFormGroup {
    // Create the form with basic validators
    const form = this.fb.group({
      username: this.fb.control(
        user?.username || '',
        [Validators.required, noTestUsernameValidator()]
      ),
      role: this.fb.control(user?.role || '', Validators.required),
      password: this.fb.control('')
    });

    // Set password validation based on whether we're creating or editing
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
   * Prepares user data from form values
   * @param formValues Form values from the user form
   * @param userId Optional user ID for updates
   */
  prepareUserData(formValues: UserFormValues, userId?: string): CreateUserDto | UpdateUserDto {
    // Base user data from form
    const baseUserData = {
      username: formValues.username || '',
      role: formValues.role || '',
    };

    // For updating an existing user (with ID)
    if (userId) {
      const updateData: UpdateUserDto = {
        id: userId,
        ...baseUserData
      };

      // Only include password if provided (not empty)
      if (formValues.password) {
        updateData.password = formValues.password;
      }

      return updateData;
    }

    // For creating a new user
    return {
      ...baseUserData,
      password: formValues.password || '',
    };
  }
}
