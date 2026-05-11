import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Log {
  id: number;
  email: string | null;
  registration_id: number | null;
  type: 'USAGE' | 'ERROR' | 'REGISTRATION' | 'USER';
  message: string;
  details: string | null;
  created_at: string;
  registration?: {
    machine_number: string;
    company_name: string;
  };
}

export interface LogFilters {
  email?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({ providedIn: 'root' })
export class LogService {
  private base = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  getLogs(filters: LogFilters = {}): Observable<{ success: boolean; data: Log[] }> {
    let params = new HttpParams();
    if (filters.email)     params = params.set('email', filters.email);
    if (filters.type)      params = params.set('type', filters.type);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate)   params = params.set('endDate', filters.endDate);
    return this.http.get<any>(this.base, { params });
  }
}
