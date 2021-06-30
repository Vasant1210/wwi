import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Stats } from '../_models/user-stats.model';
import { GradeSystem } from '../_models/leaderboard_grading_system.model';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatsService extends BaseService {

  public _stats: BehaviorSubject<Stats[]> = new BehaviorSubject<Stats[]>(null);
  public stats: Observable<Stats[]>;
  public gradeSystem: Observable<GradeSystem[]>;

  constructor(private http: HttpClient) {
    super();
    this.stats = this._stats.asObservable();
  }

  trackActivity(webcast_id: string, action: string, id?:number) {
    //let _data = JSON.stringify(data);
    console.log('in track activity');
    let params = { "webcast_id": webcast_id, "action": action,"id":id};
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/leaderboard/user/activity`, params).subscribe();
  } 
 
 
}
