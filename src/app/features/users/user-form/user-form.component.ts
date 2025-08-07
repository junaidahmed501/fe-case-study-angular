import {Component, effect, inject, input, output, OutputEmitterRef} from '@angular/core';
import {User} from '../../../shared/models/user';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {UserFormService} from '../services/user-form.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  user = input<User | null>(null);

  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();

  private formService = inject(UserFormService);
  form!: FormGroup;

  // Mode indicator for template UI
  get isEditMode(): boolean {
    return !!this.user()?.id;
  }

  constructor() {
    // Initialize the form
    this.form = this.formService.createUserForm(this.user());

    // Use effect to update form when user changes
    effect(() => {
      const userData = this.user();
      if (userData) {
        // Recreate the form with the new user data
        this.form = this.formService.createUserForm(userData);
      } else {
        // Create an empty form for new user
        this.form = this.formService.createUserForm();
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const userData = this.formService.prepareUserData(this.form.value, this.user());
      this.save.emit(userData);
    }
  }
}
