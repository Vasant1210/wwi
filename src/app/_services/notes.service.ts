import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notes } from '../_models/notes';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotesService extends BaseService {

  public _notes: BehaviorSubject<Notes[]> = new BehaviorSubject<Notes[]>(null);
  public notes: Observable<Notes[]>;

  constructor(private http: HttpClient) {
    super();
    this.notes = this._notes.asObservable();
  }

  loadNotes(webcast_id): Observable<Notes[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/comment`).pipe(
      catchError(this.handleError<Notes>('loadNotes'))
    ).pipe(map(result => {
      //this.dataStore.webcast = result;
      this._notes.next(result);
      return result;
    }));
    
  }

  addNote(note: Notes) {
    var currentValue = this._notes.value;
    if (currentValue) {
      const updatedValue = [...currentValue, note];
      this._notes.next(updatedValue);
    } else {
      this._notes.next([note]);
    }
  }

  deleteNote(webcast_id: String, id: Number) {
    let params = { "webcast_id": webcast_id, "id":id };
    return this.http.delete<any>(`${environment.apiUrl}/${webcast_id}/viewer/comment/${id}`).
      pipe(map(result => {
        
        if (result && result.success) {
          console.log(result);
          var currentValue = this._notes.value;
          console.log(currentValue);
          currentValue = currentValue.filter(x => x.id != id)
          console.log(currentValue);
          this._notes.next(currentValue);
          return result;
        }
    }));;
  }

}
