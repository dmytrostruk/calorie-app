import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Roles } from '../enums/roles';
import { UserDetails } from '../models/user-details';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  public async getUserDetails(): Promise<UserDetails> {
    const userDetails = this.httpService.get<UserDetails>('/get-user');
    return await lastValueFrom(userDetails);
  } 

  public async getUsers(): Promise<UserDetails[]> {
    const users = this.httpService.get<UserDetails[]>('/get-users');
    return await lastValueFrom(users);
  }

  public async isAdmin(): Promise<boolean> {
    const user = await this.getUserDetails();

    if (user) {
      return user.role === Roles.Admin;
    }

    return false;
  }
}
