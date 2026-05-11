import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ success: boolean; data: AdminUser[] }> {
    return this.http.get<any>(this.base);
  }

  getById(id: number): Observable<{ success: boolean; data: AdminUser }> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  create(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user-auth/register`, data);
  }

  update(id: number, data: Partial<AdminUser>): Observable<any> {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
