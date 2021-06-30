import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Room, Lobby, Lounge } from '../_models/room.model';
import { ViewerBussinessCard } from '../_models/viewer-bussiness-card';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends BaseService {

  public _rooms: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>(null);
  public rooms: Observable<Room[]>;


  constructor(private http: HttpClient) {
    super();
    this.rooms = this._rooms.asObservable();
  }


  setRoom(room: Room) {
    var currentValue = this._rooms.value;
    if (currentValue) {
      var roomExists = currentValue.find(x => x.id == room.id);
      if (roomExists) {
        currentValue = currentValue.filter(x => x.id != room.id);
      }
      const updatedValue = [...currentValue, room];
      this._rooms.next(updatedValue);
    } else {
      this._rooms.next([room]);
    }
  }

  loadRooms(webcast_id): Observable<Room[]>{
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/room`).pipe(
      catchError(this.handleError<Room>('loadRooms'))
    ).pipe(map(result => {
      //this.dataStore.webcast = result;
      this._rooms.next(result);
      return result;
    }));
  }

  loadRoomByType(webcast_id,type): Observable<Room> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/room/type/${type}`).pipe(
      catchError(this.handleError<Room>('loadRooms'))
    ).pipe(map(result => {
      this.setRoom(result);
      return result;
    }));
  }
  getRoomByType(webcast_id, type) {
    if (this._rooms.getValue()) {
      let room = this._rooms.getValue().find(x => x.room_type == type);
      if (room) {
        return;  
      }
    }
    this.loadRoomByType(webcast_id, type).subscribe();
  }

  loadStalls(webcast_id): Observable<Room[]>{
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/stall`);
  }


  loadBussinessCard(webcast_id): Observable<ViewerBussinessCard[]>{
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/bussinesscard/get_card`);
  }

  submitQuestion(webcast_id: string, room_id: number, question: string) {
    var params = { "webcast_id": webcast_id, "tag": room_id, "description": question };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/question`, params);
  }

  submitComment(webcast_id: string, room_id: number ,comment: string) {
    var params = { "webcast_id": webcast_id, "tag": room_id, "comment": comment };
    return this.http.post<any>(`${environment.apiUrl}/viewer/comment`, params);
  }

 

  deleteCard(webcast_id: String, model_id: Number) {
    var params = { "webcast_id": webcast_id, "model_id":model_id };
    return this.http.delete<any>(`${environment.apiUrl}/${webcast_id}/viewer/bussinesscard/${model_id}`).
      pipe(map(result => {
        
        if (result && result.success) {
          console.log(result);
          //var currentValue = this._notes.value;
         // console.log(currentValue);
         // currentValue = currentValue.filter(x => x.id != id)
         // console.log(currentValue);
         // this._notes.next(currentValue);
          return result;
        }
    }));;
  }


  hasWidget(widgets, name) {
    var result = false;
    let widets = widgets;
    if (widgets) {
      if (!Array.isArray(widgets)) {
        widets = JSON.parse(widgets);
      }
      let enbabled = widets.filter(x => x.includes(name));
      result = enbabled.length > 0;
      return result;
    }
  }
}
