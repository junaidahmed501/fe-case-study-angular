import {FormControl} from '@angular/forms';

export interface UserFormToSave {
  username: FormControl<string>;
  role: FormControl<string>;
  password: FormControl<string>;
}
