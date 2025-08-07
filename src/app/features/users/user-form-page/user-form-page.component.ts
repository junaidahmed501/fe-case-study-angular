import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {User} from '../../../shared/models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersFacadeService} from '../../../core/facades/users-facade.service';
import {Subject, takeUntil} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {UserFormGroupModel} from '../../../shared/models/forms/user-form-group.model';
import {CommonModule} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [
    UserFormComponent,
    CommonModule,
    MatProgressSpinner
  ],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss'
})
export class UserFormPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(UsersFacadeService);

  // Using signals for reactive state management
  readonly userId = signal<string | null>(null);
  readonly user = signal<User | null>(null);
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  // Computed property with correct logic
  readonly isEditMode = computed(() => !!this.userId() && this.userId() !== 'create');

  // For cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Get the ID parameter from the route
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        // Set the userId signal
        this.userId.set(id);

        // If we have an ID and it's not 'create', load the user
        if (id && id !== 'create') {
          this.loadUser(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser(userId: string): void {
    this.facade.getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.user.set(userData);
        },
        error: () => {
          this.router.navigate(['/users']);
        }
      });
  }

  handleSubmit(form: FormGroup<UserFormGroupModel> | null): void {
    if (form && form.valid) {
      if (!this.isEditMode()) {
        // Create mode
        const userData = this.facade.prepareUserDataToSave(form.getRawValue());
        this.facade.saveUser(userData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(result => {
            if (result.success) {
              this.goBack();
            }
            // If not successful, the error is already handled in the facade and displayed via the error signal
          });
      } else {
        // Edit mode
        const userData = this.facade.prepareUserDataToUpdate(this.user()!.id, form.getRawValue());
        this.facade.editUser(userData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(result => {
            if (result.success) {
              this.goBack();
            }
            // If not successful, the error is already handled in the facade and displayed via the error signal
          });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
