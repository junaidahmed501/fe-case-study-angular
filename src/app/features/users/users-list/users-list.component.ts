import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input<User[]>();

  edit: OutputEmitterRef<number> = output();
}
