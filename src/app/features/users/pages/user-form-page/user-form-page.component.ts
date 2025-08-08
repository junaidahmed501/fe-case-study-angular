import {ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCard} from '@angular/material/card';
import {UserFormComponent} from '../../components/user-form/user-form.component';
import {UsersFacadeService} from '../../../../core/facades/users-facade.service';
import {User} from '../../../../shared/models/user.model';
import {APP_ROUTES} from '../../../../shared/constants/routes.constants';
import {UserFormGroup} from '../../../../shared/models/user-form.model';

/**
 * Container component for user creation and editing
 * Handles form initialization, data loading, and saving
 */
@Component({
  selector: 'app-user-form-page',
  imports: [
    UserFormComponent,
    CommonModule,
    MatProgressSpinner,
    MatCard
  ],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(UsersFacadeService);

  readonly userId = signal<string | null>(null);
  readonly user = signal<User | null>(null);
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly isEditMode = computed(() => !!this.userId() && this.userId() !== 'create');

  private readonly destroy$ = new Subject<void>();

  /**
   * Initializes component by extracting route params and loading user data if in edit mode
   */
  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        this.userId.set(id);

        if (id && id !== 'create') {
          this.loadUser(id);
        }
      });
  }

  /**
   * Cleans up subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles form submission for user creation or update
   * @param form The validated user form group
   */
  handleSubmit(form: UserFormGroup | null): void {
    if (form && form.valid) {
      const formValues = form.getRawValue();
      const currentUserId = this.isEditMode() ? this.user()?.id : undefined;

      const userData = this.facade.prepareUserData(formValues, currentUserId);

      this.facade.saveUser(userData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result.success) {
            this.goBack();
          }
        });
    }
  }

  /**
   * Navigates back to users list
   */
  goBack(): void {
    this.router.navigate([APP_ROUTES.USERS]);
  }

  /**
   * Loads user data for editing by ID
   * @param userId ID of user to load
   */
  private loadUser(userId: string): void {
    this.facade.getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.user.set(userData);
        },
        error: () => {
          this.goBack();
        }
      });
  }
}
