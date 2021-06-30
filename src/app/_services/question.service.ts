import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Question } from '../_models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService extends BaseService {

  public _question: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>(null);
  public question: Observable<Question[]>;

  constructor(private http: HttpClient) {
    super();
    this.question = this._question.asObservable();
  }

  setQuestion(question: Question) {
	
    var currentValue = this._question.value;
    if (currentValue) {
      var questionExists = currentValue.find(x => x.id == question.id);
      if (questionExists) {
        currentValue = currentValue.filter(x => x.id != question.id);
      }
      const updatedValue = [...currentValue,question];
      this._question.next(updatedValue);
    } else {
      this._question.next([question]);
    }
  }

  loadQuestion(webcast_id): Observable<Question[]> {
	  
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/question`).pipe(
      catchError(this.handleError<Question>('loadQuestion'))
    ).pipe(map(result => {
      //this.dataStore.webcast = result;
      console.log(result);
      this._question.next(result);
      return result;
    }));


   

  }

}
