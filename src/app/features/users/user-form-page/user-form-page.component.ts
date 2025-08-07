import {Component, inject, input, OnInit, signal} from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {User} from '../../../shared/models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersFacadeService} from '../../../core/facades/users-facade.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-user-form-page',
  imports: [
    UserFormComponent
  ],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss'
})
export class UserFormPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(UsersFacadeService);

  readonly id = input<string | 'create'>('create');

  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    // Get the ID parameter from the route
    // this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');
    const userId = this.id();

      if (userId && userId !== 'create') {
        // Edit user mode - fetch the user
        // const userId = Number(id);
        // if (!isNaN(userId)) {
          this.loadUser(userId);
        // } else {
          // Invalid ID, redirect
          // this.router.navigate(['/users']);
        // }
      } else {
        // Create user mode - no need to fetch data
        // Keep user signal as null, which will create a new user form
        this.user.set(null);
      }
    // });
  }


  handleSave(user: Partial<User>) {
    this.facade.saveUser(user);
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  private loadUser(userId: string): void {
    this.loading.set(true);
    this.facade.getUserById(userId).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (userData) => {
        this.user.set(userData);
      },
      error: (err) => {
        // Handle error, maybe redirect to users list
        this.router.navigate(['/users']);
      }
    });
  }
}
