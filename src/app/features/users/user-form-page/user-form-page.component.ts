import {ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersFacadeService} from '../../../core/facades/users-facade.service';
import {Subject, takeUntil} from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {User} from '../../../shared/models/user.model';
import {UserFormGroup} from '../../../shared/models/forms/user-form.model';
import {ROUTES} from '../../../shared/constants/routes.constants';

@Component({
  selector: 'app-user-form-page',
  imports: [
    UserFormComponent,
    CommonModule,
    MatProgressSpinner
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  goBack(): void {
    this.router.navigate([ROUTES.USERS]);
  }

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
