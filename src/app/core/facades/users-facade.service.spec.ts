import {TestBed} from '@angular/core/testing';
import {firstValueFrom, of, throwError} from 'rxjs';

import {UsersFacadeService} from './users-facade.service';
import {UserStore} from '../stores/users.store';
import {UsersService} from '../services/users.service';
import {UserFormService} from '../../features/users/services/user-form.service';
import {CreateUserDto, UpdateUserDto, User} from '../../shared/models/user.model';
import {FormGroup} from '@angular/forms';
import {signal} from '@angular/core';


describe('UsersFacadeService', () => {
  let facade: UsersFacadeService;
  let mockUserStore: Partial<UserStore>;
  let mockUsersService: Partial<UsersService>;
  let mockFormService: Partial<UserFormService>;

  const mockUsers: User[] = [
    { id: '1', username: 'user1', role: 'admin' },
    { id: '2', username: 'user2', role: 'user' }
  ];

  const mockUser: User = { id: '1', username: 'user1', role: 'admin' };
  const mockFormValues = { username: 'user1', role: 'admin', password: 'password' };
  const mockCreateDto: CreateUserDto = { username: 'user1', role: 'admin', password: 'password' };
  const mockUpdateDto: UpdateUserDto = { id: '1', username: 'user1', role: 'admin' };

  beforeEach(() => {
    mockUserStore = {
      users: signal(mockUsers),
      loading: signal(false),
      error: signal(''),
      setLoading: jest.fn(),
      setUsers: jest.fn(),
      setError: jest.fn(),
      upsertUser: jest.fn()
    };

    mockUsersService = {
      getUsers: jest.fn().mockReturnValue(of(mockUsers)),
      getUserById: jest.fn().mockReturnValue(of(mockUser)),
      addUser: jest.fn().mockReturnValue(of(mockUser)),
      editUser: jest.fn().mockReturnValue(of(mockUser))
    };

    mockFormService = {
      createUserForm: jest.fn().mockReturnValue(new FormGroup({})),
      prepareUserData: jest.fn().mockImplementation((formValues, userId) => {
        return userId ? mockUpdateDto : mockCreateDto;
      })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UserStore, useValue: mockUserStore },
        { provide: UsersService, useValue: mockUsersService },
        { provide: UserFormService, useValue: mockFormService }
      ]
    });

    facade = TestBed.inject(UsersFacadeService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('loadUsers', () => {
    it('should set loading state, fetch users, and update store on success', () => {
      facade.loadUsers();

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.getUsers).toHaveBeenCalled();
      expect(mockUserStore.setUsers).toHaveBeenCalledWith(mockUsers);
      expect(mockUserStore.setError).toHaveBeenCalledWith('');
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle errors when loading users', () => {
      mockUsersService.getUsers = jest.fn().mockReturnValue(
        throwError(() => new Error('Failed to load users'))
      );

      facade.loadUsers();

      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.getUsers).toHaveBeenCalled();
      expect(mockUserStore.setError).toHaveBeenCalledWith('Failed to load users');
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('getUserById', () => {
    it('should set loading state and return user data on success', async () => {
      const user = await firstValueFrom(facade.getUserById('1'));
      expect(user).toEqual(mockUser);
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUserStore.setError).toHaveBeenCalledWith('');
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle errors when getting a user', async () => {
      mockUsersService.getUserById = jest.fn().mockReturnValue(
        throwError(() => new Error('User not found'))
      );

      await expect(firstValueFrom(facade.getUserById('1'))).rejects.toThrow('User not found');
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(true);
      expect(mockUsersService.getUserById).toHaveBeenCalledWith('1');
      expect(mockUserStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('saveUser', () => {
    it('should create user when no ID is provided', (done) => {
      const userData = { username: 'newUser', role: 'user', password: 'pass' };

      facade.saveUser(userData).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockUser);
        expect(mockUsersService.addUser).toHaveBeenCalledWith(userData);
        expect(mockUserStore.upsertUser).toHaveBeenCalledWith(mockUser);
        expect(mockUserStore.setError).toHaveBeenCalledWith('');
        done();
      });
    });

    it('should update user when ID is provided', (done) => {
      const userData = { id: '1', username: 'updatedUser', role: 'admin' };

      facade.saveUser(userData).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockUser);
        expect(mockUsersService.editUser).toHaveBeenCalledWith(userData);
        expect(mockUserStore.upsertUser).toHaveBeenCalledWith(mockUser);
        expect(mockUserStore.setError).toHaveBeenCalledWith('');
        done();
      });
    });

    it('should handle errors when creating a user', (done) => {
      mockUsersService.addUser = jest.fn().mockReturnValue(
        throwError(() => new Error('Create failed'))
      );
      const userData = { username: 'newUser', role: 'user', password: 'pass' };

      facade.saveUser(userData).subscribe(result => {
        expect(result.success).toBe(false);
        expect(result.error).toContain('Failed to create user');
        expect(mockUsersService.addUser).toHaveBeenCalledWith(userData);
        expect(mockUserStore.setError).toHaveBeenCalled();
        done();
      });
    });

    it('should handle errors when updating a user', (done) => {
      mockUsersService.editUser = jest.fn().mockReturnValue(
        throwError(() => new Error('Update failed'))
      );
      const userData = { id: '1', username: 'updatedUser', role: 'admin' };

      facade.saveUser(userData).subscribe(result => {
        expect(result.success).toBe(false);
        expect(result.error).toContain('Failed to update user');
        expect(mockUsersService.editUser).toHaveBeenCalledWith(userData);
        expect(mockUserStore.setError).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('createUserForm', () => {
    it('should delegate to form service to create a form', () => {
      facade.createUserForm(mockUser);

      expect(mockFormService.createUserForm).toHaveBeenCalledWith(mockUser);
    });

    it('should handle null user when creating form', () => {
      facade.createUserForm(null);

      expect(mockFormService.createUserForm).toHaveBeenCalledWith(null);
    });
  });

  describe('prepareUserData', () => {
    it('should delegate to form service and create UpdateUserDto when userId provided', () => {
      const result = facade.prepareUserData(mockFormValues, '1');

      expect(mockFormService.prepareUserData).toHaveBeenCalledWith(mockFormValues, '1');
      expect(result).toEqual(mockUpdateDto);
    });

    it('should delegate to form service and create CreateUserDto when no userId', () => {
      const result = facade.prepareUserData(mockFormValues);

      expect(mockFormService.prepareUserData).toHaveBeenCalledWith(mockFormValues, undefined);
      expect(result).toEqual(mockCreateDto);
    });
  });
});
