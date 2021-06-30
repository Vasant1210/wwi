import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Emedia } from '../_models/emedia';
import { viewerMedia } from '../_models/viewer-media';

@Injectable({
  providedIn: 'root'
})
export class GalleryService extends BaseService {
  private _mediaSubject: Subject<Emedia[]> = new Subject<Emedia[]>();  
  public viewerMedia: Subject<viewerMedia[]> = new Subject<viewerMedia[]>();

  public _vmedia: BehaviorSubject<viewerMedia[]> = new BehaviorSubject<viewerMedia[]>(null);
  public vmedia: Observable<viewerMedia[]>;

  constructor(private http: HttpClient) {
    super()
  }

  load(webcast_id,id): Observable<Emedia[]> {
    return this.http.get<Emedia[]>(`${environment.apiUrl}/${webcast_id}/gallery/${id}`).pipe(
      catchError(this.handleError<Emedia[]>('loadGallery'))
    ).pipe(map(result => {
      //this.dataStore.webcast = result;
      this._mediaSubject.next(result);
      return result;
    }));
  }

  submitViewerMedia(webcast_id: string, media_id: number, media_type: string) {    
    let params = { "webcast_id": webcast_id, "media_id": media_id,"media_type": media_type, };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/viewermedia/create`, params);
  }

  loadViewerMedia(webcast_id): Observable<viewerMedia[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/viewermedia/get_media`).pipe(
      catchError(this.handleError<viewerMedia[]>('loadViewerMedia'))
      ).pipe(map(result => {
        //this.dataStore.webcast = result;       
       // this.viewerMedia.next(result);
        this._vmedia.next(result);
        return result;
      }));
    }

    deleteViewerMedia(webcast_id: String, id: Number) {
      let params = { "webcast_id": webcast_id, "id":id };      
      return this.http.delete<any>(`${environment.apiUrl}/${webcast_id}/viewer/viewermedia/delete/${id}`).    
          pipe(map(result => {          
          if (result && result.success) {   
            console.log(result);
            var currentValue = this._vmedia.value;
            console.log(currentValue);
            currentValue = currentValue.filter(x => x.id != id)
            console.log(currentValue);
            this._vmedia.next(currentValue);
            return result;
          }
      }));;
    }

 

}
