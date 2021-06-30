import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LeaderBoardDetails } from '../_models/leaderboard.model';
import { Stats } from '../_models/user-stats.model';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) { }
  loadResult(webcast_id): Observable<Stats[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/leaderboard`);
  }

  loadDetails(webcast_id): Observable<LeaderBoardDetails> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/leaderboard/details`);
  }
}
