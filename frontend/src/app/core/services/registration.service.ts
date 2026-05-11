import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Registration {
  id: number;
  machine_number: string;
  company_name: string;
  date_of_purchase: string | null;
  email: string;
  is_using_sinar_mcal: boolean;
  device_type: string | null;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private base = `${environment.apiUrl}/registrations`;
  private authBase = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ success: boolean; data: Registration[] }> {
    return this.http.get<any>(this.base);
  }

  getByEmail(email: string): Observable<{ success: boolean; data: Registration }> {
    return this.http.get<any>(`${this.base}/profile?email=${email}`);
  }

  create(data: Partial<Registration>): Observable<any> {
    return this.http.post(`${this.authBase}/register`, data);
  }

  update(id: number, data: Partial<Registration>): Observable<any> {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
