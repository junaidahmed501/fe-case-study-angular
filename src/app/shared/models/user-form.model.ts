import {FormControl, FormGroup} from '@angular/forms';

/**
 * Form control types for user form
 */
export interface UserFormControls {
  username: FormControl<string | null>;
  role: FormControl<string | null>;
  password: FormControl<string | null>;
}

/**
 * Type for user form values
 */
export interface UserFormValues {
  username: string | null;
  role: string | null;
  password: string | null;
}

/**
 * User form group type - used for strong typing of form group
 */
export type UserFormGroup = FormGroup<UserFormControls>;
