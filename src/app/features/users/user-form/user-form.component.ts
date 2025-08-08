import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal
} from '@angular/core';
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

/**
 * Presentational component that renders user form fields
 * Handles form display, validation, and user interactions
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
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
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  private readonly facade = inject(UsersFacadeService);

  /**
   * User data to populate the form
   */
  user: InputSignal<User | null> = input<User | null>(null);

  /**
   * Event emitted when form is submitted
   */
  onSubmit: OutputEmitterRef<UserFormGroup | null> = output();

  /**
   * Event emitted when form is cancelled
   */
  onCancel: OutputEmitterRef<void> = output();

  /**
   * Form group for user data
   */
  form = signal<UserFormGroup | null>(null);

  /**
   * Whether we're in edit mode (has existing user ID)
   */
  isEditMode = computed(() => !!this.user()?.id);

  constructor() {
    effect(() => {
      const userData = this.user();
      this.form.set(this.facade.createUserForm(userData));
    });
  }

  /**
   * Handles form submission event to either create or update a user
   * Validates the form before emitting submission event
   */
  submit(): void {
    if (this.form()) {
      this.form()?.markAllAsTouched();

      if (this.form()!.valid) {
        this.onSubmit.emit(this.form());
      }
    }
  }
}
