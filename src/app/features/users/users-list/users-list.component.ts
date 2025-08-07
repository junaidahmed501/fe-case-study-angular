import {Component, input, output, OutputEmitterRef} from '@angular/core';
import {User} from '../../../shared/models/user';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-users-list',
  imports: [
    MatButton
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input<User[]>();

  edit: OutputEmitterRef<number> = output();
}
