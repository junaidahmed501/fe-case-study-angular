import {ChangeDetectionStrategy, Component, input, output, OutputEmitterRef} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {User} from '../../../../shared/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
  readonly users = input.required<User[]>();
  readonly edit: OutputEmitterRef<string> = output();

  readonly displayedColumns: string[] = ['username', 'role', 'actions'];
}
