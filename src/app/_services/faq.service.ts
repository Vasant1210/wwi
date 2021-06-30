import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Faq } from '../_models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http: HttpClient) { }

  loadFaq(webcast_id): Observable<Faq[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/faq`);
  }
}
