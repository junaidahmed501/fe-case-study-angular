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

  user: InputSignal<User | null> = input<User | null>(null);

  onSubmit: OutputEmitterRef<UserFormGroup | null> = output();
  onCancel: OutputEmitterRef<void> = output();

  form = signal<UserFormGroup | null>(null);
  isEditMode = computed(() => !!this.user()?.id);

  constructor() {
    effect(() => {
      const userData = this.user();
      this.form.set(this.facade.createUserForm(userData));
    });
  }

  submit(): void {
    if (this.form()) {
      this.form()?.markAllAsTouched();

      if (this.form()!.valid) {
        this.onSubmit.emit(this.form());
      }
    }
  }
}
