import {Injectable, signal} from '@angular/core';
import {User} from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserStore {
  readonly users = signal<User[]>([]);
  readonly user = signal<User | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  /**
   * Set the users collection in the store
   * @param newUsers Array of users to set
   */
  setUsers(newUsers: User[]): void {
    this.users.set(newUsers);
  }

  /**
   * Set the loading state
   * @param value Loading state boolean
   */
  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  /**
   * Set the error message
   * @param message Error message to set
   */
  setError(message: string): void {
    this.error.set(message);
  }

  /**
   * Add or update a user in the collection
   * If the user exists (by ID), it will be updated, otherwise added
   * @param user The user to add or update
   */
  upsertUser(user: User): void {
    const current = this.users();
    const index = current.findIndex(u => u.id === user.id);
    if (index === -1) {
      this.users.set([...current, user]);
    } else {
      const updated = [...current];
      updated[index] = user;
      this.users.set(updated);
    }
  }
}
