import {ChangeDetectionStrategy, Component, inject, OnInit, Signal} from '@angular/core';
import {UsersListComponent} from '../users-list/users-list.component';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {UsersFacadeService} from '../../../core/facades/users-facade.service';
import {AuthFacadeService} from '../../../core/facades/auth-facade.service';
import {User} from '../../../shared/models/user.model';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

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

  ngOnInit(): void {
    this.usersFacade.loadUsers();
  }

  goToNew(): void {
    // todo: use constants for routes
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/users', id]);
  }

  logout(): void {
    this.authFacade.logout();
    this.router.navigate(['/auth']);
  }
}
