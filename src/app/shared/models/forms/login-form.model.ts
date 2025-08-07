import {FormControl} from '@angular/forms';

/**
 * Interface for the login form controls with proper typing
 */
export interface LoginFormModel {
  username: FormControl<string>;
  password: FormControl<string>;
}
