import {ChangeDetectionStrategy, Component, inject, OnInit, Signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {UsersListComponent} from '../../components/users-list/users-list.component';
import {UsersFacadeService} from '../../../../core/facades/users-facade.service';
import {AuthFacadeService} from '../../../../core/facades/auth-facade.service';
import {User} from '../../../../shared/models/user.model';
import {APP_ROUTES} from '../../../../shared/constants/routes.constants';

/**
 * Container component for the users list view
 * Manages data fetching, navigation, and user actions
 */
@Component({
  selector: 'app-users-list-page',
  imports: [
    UsersListComponent,
    MatButton,
    MatIcon,
    MatProgressSpinner
  ],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly usersFacade = inject(UsersFacadeService);
  private readonly authFacade = inject(AuthFacadeService);

  readonly usersSignal: Signal<User[]> = this.usersFacade.users;
  readonly loading: Signal<boolean> = this.usersFacade.loading;

  /**
   * Loads users data when component initializes
   */
  ngOnInit(): void {
    this.usersFacade.loadUsers();
  }

  /**
   * Navigates to create user page
   */
  goToNew(): void {
    this.router.navigate([APP_ROUTES.USER_CREATE]);
  }

  /**
   * Navigates to edit page for specific user
   * @param id ID of the user to edit
   */
  goToEdit(id: string): void {
    this.router.navigate([APP_ROUTES.getUserEdit(id)]);
  }

  /**
   * Logs the user out and redirects to login page
   */
  logout(): void {
    this.authFacade.logout();
    this.router.navigate([APP_ROUTES.AUTH]);
  }
}
