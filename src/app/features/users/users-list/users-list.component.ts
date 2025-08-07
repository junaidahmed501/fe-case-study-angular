import {Component, input, output, OutputEmitterRef} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {User} from '../../../shared/models/user.model';

@Component({
  selector: 'app-users-list',
  imports: [
    MatButton
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input.required<User[]>();

  edit: OutputEmitterRef<string> = output();
}
