import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from "../models/user.model";
import { EnvService } from './env.service';
import { USERS, SUBSCRIPTION, CHANGE_STREAM, SUBSCRIPTIONS } from './../globals/global_variables';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private currentUser = new User();

  constructor(
    private http: HttpClient,
    private envService: EnvService,
    private localService: LocalService
  ) { }

  corsHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000/'
  });

  getUsers() {
    return this.http.get<User[]>(`${this.envService.apiUrl + USERS}`);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.envService.apiUrl + USERS}/${id}`);
  }

  setCurrentUser(currentUser: User) {
    this.currentUser = new User();
    this.currentUser = currentUser;
  }

  getCurrentUser(): User {
    const user: User = this.localService.getJsonValue('currentUser');
    if(user != null) {
      this.setCurrentUser(user);
      console.log("Current User: ", this.currentUser);
    }
    return this.currentUser;
  }

  updateUser(user: User) {
    return this.http.put<User>(`${this.envService.apiUrl + USERS}/${user.id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete<User>(`${this.envService.apiUrl + USERS}/${id}`);
  }

  saveUserLocally(result) {
    this.currentUser = new User();
    this.localService.setJsonValue('currentUser',result.body.user);
    this.setCurrentUser(result.body.user);
  }

  saveTokenLocally(result) {
    this.localService.setJsonValue('token',result.body.token);
  }

  updateSubscription(userId: String, subscription) {
    return this.http.patch<any>(`${this.envService.apiUrl + USERS}/${userId + SUBSCRIPTION}`, subscription, {observe: 'response' });
  }

  initChangeStream(userId: String, pipeline) {
    return this.http.post<any>(`${this.envService.apiUrl + USERS}/${userId + CHANGE_STREAM}`, pipeline, {observe: 'response' });
  }

  getSubscriptions(userId: String) {
    return this.http.get<any>(`${this.envService.apiUrl + USERS}/${userId + SUBSCRIPTIONS}`);
  }

  deleteSubscription(userId: String, subscription) {
    return this.http.patch<any>(`${this.envService.apiUrl + USERS}/${userId + SUBSCRIPTIONS}`, subscription, {observe: 'response' });
  }

  addSubscription(userId: String, subscription) {
    return this.http.post<any>(`${this.envService.apiUrl + USERS}/${userId + SUBSCRIPTION}`, subscription, {observe: 'response' });
  }
}