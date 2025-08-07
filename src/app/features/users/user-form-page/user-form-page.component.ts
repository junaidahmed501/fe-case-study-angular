import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {User} from '../../../shared/models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersFacadeService} from '../../../core/facades/users-facade.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {UserFormModel} from '../../../shared/models/forms/user-form.model';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [
    UserFormComponent
  ],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss'
})
export class UserFormPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(UsersFacadeService);

  // Using the signal pattern for reactive state management
  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(false);
  readonly isCreateMode = signal<boolean>(false);

  // For cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Get the ID parameter from the route
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');

        // Explicitly check for 'create' or for no id
        if (id === 'create') {
          // Create mode - set flag and clear any existing user
          this.isCreateMode.set(true);
          this.user.set(null);
        } else if (id) {
          // Edit mode - fetch the user
          this.isCreateMode.set(false);
          this.loadUser(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUser(userId: string): void {
    this.loading.set(true);
    this.facade.getUserById(userId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (userData) => {
          this.user.set(userData);
        },
        error: () => {
          // Handle error, maybe redirect to users list
          this.router.navigate(['/users']);
        }
      });
  }

  handleSave(form: FormGroup<UserFormModel> | null): void {
    if (form && form.valid) {
      // Use the facade to prepare the user data from the form
      const userData = this.facade.prepareUserDataToSave(form.value, this.user());

      // Use the facade to save the user (works for both create and edit)
      this.facade.saveUser(userData);
      this.goBack();
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
