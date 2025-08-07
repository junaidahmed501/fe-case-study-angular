import {FormControl} from '@angular/forms';

/**
 * Interface for the user form controls
 */
export interface UserFormGroupModel {
  username: FormControl<string | null>;
  role: FormControl<string | null>;
  password: FormControl<string | null>;
}
