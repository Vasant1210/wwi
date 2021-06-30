import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Agenda } from '../_models/agenda.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) { }

  loadAgenda(webcast_id): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${environment.apiUrl}/${webcast_id}/program`);
  }
}
