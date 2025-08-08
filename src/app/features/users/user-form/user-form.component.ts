import {Component, computed, effect, inject, input, InputSignal, output, OutputEmitterRef, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatHint} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {UsersFacadeService} from '../../../core/facades/users-facade.service';
import {User} from '../../../shared/models/user.model';
import {UserFormGroup} from '../../../shared/models/forms/user-form.model';
import {FormErrorComponent} from '../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatHint,
    FormErrorComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  private facade = inject(UsersFacadeService);

  user: InputSignal<User | null> = input<User | null>(null);

  onSave: OutputEmitterRef<Partial<User>> = output();
  onSubmit: OutputEmitterRef<UserFormGroup | null> = output();
  onCancel: OutputEmitterRef<void> = output();

  // Use a signal for the form to allow for reactive updates
  form = signal<UserFormGroup | null>(null);

  // Computed property for template conditions
  isEditMode = computed(() => !!this.user()?.id);

  constructor() {
    // Use effect to reactively update form when user changes
    effect(() => {
      const userData = this.user();
      // Recreate the form with the updated user data through the facade
      this.form.set(this.facade.createUserForm(userData));
    });
  }

  submit(): void {
    if (this.form()) {
      // // Mark all fields as touched to show validation errors
      // Object.keys(this.form()!.controls).forEach(key => {
      //   const control = this.form()!.get(key);
      //   control?.markAsTouched();
      // });
      this.form()?.markAllAsTouched();

      if (this.form()!.valid) {
        this.onSubmit.emit(this.form());
      }
    }
  }
}
