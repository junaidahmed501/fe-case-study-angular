import {FormControl, FormGroup} from '@angular/forms';

/**
 * Form control types for login form
 */
export interface LoginFormControls {
  username: FormControl<string>;
  password: FormControl<string>;
}

/**
 * Type for login form values
 */
export interface LoginFormValues {
  username: string;
  password: string;
}

/**
 * Login form group type - used for strong typing of form group
 */
export type LoginFormGroup = FormGroup<LoginFormControls>;
