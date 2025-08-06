import {Component, inject, Signal} from '@angular/core';
import { UsersListComponent } from '../users-list/users-list.component';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';
import {AuthFacadeService} from '../../../core/facades/auth-facade.service';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'app-users-list-page',
  imports: [
    UsersListComponent,
    MatButton
  ],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss'
})
export class UsersListPageComponent {
  private readonly router = inject(Router);
  private readonly usersFacade = inject(UsersFacadeService);
  private readonly authFacade = inject(AuthFacadeService);

  usersSignal: Signal<User[]> = this.usersFacade.users;
  loading: Signal<boolean> = this.usersFacade.loading;

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users', id]);
  }

  logout(): void {
    // Implement logout logic here, e.g., clearing the token and redirecting to login
    this.authFacade.logout(); // Assuming logout method exists in UsersFacadeService
    // todo: this is not needed when redirect is already part of logout process.
    // check if it's a good idea to put the routing within facade
    this.router.navigate(['/auth']);
  }
}
