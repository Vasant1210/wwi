import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import {Speaker } from '../_models/speaker';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { SpeakerMeetingSlot } from '../_models/speaker-meeting-slot.model';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService extends BaseService{

  public _speaker: BehaviorSubject<Speaker[]> = new BehaviorSubject<Speaker[]>(null);
  public speaker: Observable<Speaker[]>;
 
  constructor(private http: HttpClient) { 
    super();
    this.speaker = this._speaker.asObservable();
  }

  loadSpeaker(webcast_id): Observable<Speaker[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/speaker`);
  }

  loadSpeakerSlot(webcast_id): Observable<Speaker[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/speakermeeting`);
  }

  submitViewerSpeakerMeeting(webcast_id: string, speaker_id: number, slot_id: number, num_day: number, start_time: string, end_time: string) {
    let params = { "webcast_id": webcast_id, "speaker_id": speaker_id, "slot_id": slot_id, "num_day": num_day, "start_time": start_time, "end_time": end_time, };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/speakermeeting/schedule`, params);
  }

  loadViewerMeetingSchedule(webcast_id): Observable<SpeakerMeetingSlot[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/${webcast_id}/viewer/speakermeeting`);
  }

  updateScheduleStatus(webcast_id: string, slot_id: number) {
    let params = { "webcast_id": webcast_id, "slot_id": slot_id, };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/speakermeeting/updatestatus/${slot_id}`, params);
  }
  
}
