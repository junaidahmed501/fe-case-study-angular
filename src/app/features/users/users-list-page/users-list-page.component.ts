import { Component, inject } from '@angular/core';
import { UsersListComponent } from '../users-list/users-list.component';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';

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
  facade = inject(UsersFacadeService);
  router = inject(Router);

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users', id]);
  }

  logout(): void {
    // Implement logout logic here, e.g., clearing the token and redirecting to login
    // this.facade.logout(); // Assuming logout method exists in UsersFacadeService
    this.router.navigate(['/auth']);
  }
}
