import {Component, input, output, OutputEmitterRef} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {User} from '../../../shared/models/user.model';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-users-list',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  users = input.required<User[]>();
  edit: OutputEmitterRef<string> = output();

  displayedColumns: string[] = ['username', 'role', 'actions'];
}
