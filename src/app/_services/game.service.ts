import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Game } from '../_models/game.model';



@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private http: HttpClient) { }

    getGameUpdateFeed(webcast_id)
    {
      return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/game/update?feed=json`);
    }
    
    getGame(webcast_id)
    {
      return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/game`);
    }
}
