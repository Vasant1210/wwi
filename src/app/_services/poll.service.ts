import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ActivePoll } from '../_models/active-poll';



@Injectable({ providedIn: 'root' })
export class PollService {
  private _activePoll: BehaviorSubject<ActivePoll[]> = new BehaviorSubject<ActivePoll[]>(null);
  public activePoll: Observable<ActivePoll[]>;
  private _pollLoadedFromDB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public pollLoadedFromDB: Observable<Boolean>;

  constructor(private http: HttpClient) {

    this.activePoll = this._activePoll.asObservable();

  }

    setActivePoll(activePoll: ActivePoll) {
      var currentValue = this._activePoll.value;
      if (currentValue) {
        var roomExists = currentValue.find(x => x.roomId == activePoll.roomId);
        if (roomExists) {
          roomExists.pollId = activePoll.pollId;
          currentValue = currentValue.filter(x => x.roomId != activePoll.roomId);
        }
        const updatedValue = [...currentValue, activePoll];
        this._activePoll.next(updatedValue);
      } else {
        this._activePoll.next([activePoll]);
      }
     }
    //getPoll(webcast_id:string,room_id:number)
    //{
    //  this.loadPollFromDB(webcast_id, room_id).sub
    //  this.pollLoadedFromDB.subscribe(x => {
    //    if (x == false) {
    //      this._pollLoadedFromDB.next(true);
    //      return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/poll/${room_id}`);
    //    }
    //  })
    //    return this._activePoll ? this._activePoll.value.find(x => x.roomId == room_id) : null;
    //}
    loadPollFromDB(webcast_id: string, room_id: number) {
      //if (this._pollLoadedFromDB.getValue() == false) {
          
        let activePoll = this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/poll/${room_id}`);
        activePoll.subscribe(x =>
        {
          if (x) {
            var ap: ActivePoll = new ActivePoll();
            ap.pollId = x.poll_id;
            ap.roomId = x.room_id;
            ap.poll = x.poll;
            console.log(ap);
            this.setActivePoll(ap)
          }
          this._pollLoadedFromDB.next(true);
        });
        //}
    }
    getPollResult(webcast_id:string,poll_id:number)
    {
        return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/poll/result/${poll_id}`);
    }
    submitPoll(webcast_id:string,poll_id:number,ques_and_options:any,room_id:number)
    {
      let params = { "webcast_id": webcast_id, "poll_id": poll_id, "ques_and_options": ques_and_options, "room_id": room_id};  
        return this.http.post<any>(`${environment.apiUrl}/viewer/poll/submit`,params);
    }
    submitQuestion(webcast_id:string,question:string,token:string) {
        /*let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            }); 
        let options = { headers: headers };*/    
        let params = {"webcast_id":webcast_id,"comment":question};  
        
        return this.http.post<any>(`${environment.apiUrl}/viewer/question`,params);
    }
    submitComment(webcast_id:string,comment:string,token:string) {
        /*let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            }); 
        
        let options = { headers: headers };
        */
        let params = {"webcast_id":webcast_id,"comment":comment};  
        return this.http.post<any>(`${environment.apiUrl}/viewer/comment`,params);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getPollUpdateFeed(webcast_id) {
      return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/poll/update?feed=json`);
  }

  hasPollAlert(activePolls: ActivePoll[], webcastId: string, roomId: number, userId) {
    if (activePolls) {
      let activePoll = activePolls.find(f => f.roomId == roomId);
      if (activePoll) {
        if (activePoll.poll.status == 3) {
          return true;
        } else {
          let sp = this.getStoredPoll(webcastId, roomId, activePoll.pollId, userId);
          if (sp) {
            return false;
          } else {
            return true;
          }
        }
      }
      return false;
    }
   
  }
  getStoredPoll(webcastId,roomId, pollId,userId) {
    let strorage_key = webcastId + "_polls";
    let pollsAttended = null;
    var storagePollsAttended = JSON.parse(localStorage.getItem(strorage_key));
    if (storagePollsAttended) {
      pollsAttended = storagePollsAttended[roomId + '_' + userId + "_" + pollId];
    }
    return pollsAttended;
  }
}
