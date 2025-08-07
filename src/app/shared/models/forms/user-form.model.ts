import {FormControl} from '@angular/forms';

/**
 * Interface for the user form controls with proper typing
 */
export interface UserFormModel {
  username: FormControl<string | null>;
  role: FormControl<string | null>;
  password: FormControl<string | null>;
}
