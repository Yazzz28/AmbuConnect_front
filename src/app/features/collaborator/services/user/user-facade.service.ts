import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, switchMap, tap} from 'rxjs';
import {UserStoreService} from './user-store.service';
import {UserHttpService} from './user-http.service';
import {User, UserTableDTO} from '../../model/user.model';
import {ActionDeleteItem} from '../../../../general/type/custom-type';

const ROLE_LENGTH = 0;

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  private readonly _userHttpService: UserHttpService = inject(UserHttpService);
  private readonly _userStoreService: UserStoreService = inject(UserStoreService);
  private readonly _currentEditUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private _currentFormData: ActionDeleteItem = null;

  readonly onEditStart$: Observable<User | null> = this._currentEditUser.asObservable();

  getAll$(): Observable<UserTableDTO[]> {
    return this._userHttpService.getUsers$().pipe(switchMap(users => this._userStoreService.setAll$(users)));
  }

  getById$(userId: string): Observable<User> {
    return this._userHttpService.getUserById$(Number(userId)).pipe(tap(user => this._currentEditUser.next(user)));
  }

  create$(user: User): Observable<User> {
    const updatedUser: User = this._prepareUserData(user);

    return this._userHttpService.create$(updatedUser).pipe(
      tap((createdUser: User) => {
        const userTableDTO: UserTableDTO = this._convertUserToUserTableDTO(createdUser);
        this._userStoreService.create$(userTableDTO);
      })
    );
  }

  update$(user: User): Observable<User> {
    const updatedUser: User = this._prepareUserData(user);

    return this._userHttpService.update$(updatedUser).pipe(
      tap((updatedUser: User) => {
        const userTableDTO: UserTableDTO = this._convertUserToUserTableDTO(updatedUser);
        this._userStoreService.update$(userTableDTO);
      })
    );
  }

  delete$(userId: string | number): Observable<void> {
    const numericUserId: number = typeof userId === 'string' ? Number(userId) : userId;

    return this._userHttpService.delete$(numericUserId).pipe(tap(() => this._userStoreService.delete$(numericUserId)));
  }

  getCurrentFormData(): ActionDeleteItem {
    return this._currentFormData;
  }

  updateFormData(formData: ActionDeleteItem): void {
    this._currentFormData = formData;
  }

  updateUserRoles(userId: number, roles: ActionDeleteItem[]): Observable<User> {
    return this.getById$(userId.toString()).pipe(
      switchMap(user => {
        const updatedUser = { ...user, roles };
        return this.update$(updatedUser);
      })
    );
  }

  private _prepareUserData(user: User): User {
    return {...user};
  }

  private _convertUserToUserTableDTO(user: User): UserTableDTO {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      degree: user.degree,
      degreeExpirationDate: user.degreeExpirationDate,
      profession: user.profession,
      roles: user.roles,
      password: user.password,
    };
  }
}
