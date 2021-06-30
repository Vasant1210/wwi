import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { BehaviorSubject, Observable,throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Cform, Webcast } from '../../app/_models';
import { WebcastService } from './webcast.service';
import { ThemeService } from './theme.service';
import { Theme } from '../_models/theme.model';


@Injectable({ providedIn: 'root' })
export class CformService {
  private cformSubject: BehaviorSubject<Cform>;
  public cform: Observable<Cform>;
  theme: Theme; 
  constructor(private http: HttpClient, private router: Router,
    private webcastService: WebcastService,
    private themeService: ThemeService) { 
        this.cformSubject = new BehaviorSubject<Cform>(JSON.parse(localStorage.getItem('cform')));
        this.cform = this.cformSubject.asObservable();
    }

  getWebcastTemplate(webcast_id: string): Observable<Cform> {
    return this.http.get<Cform>(`${environment.apiUrl}/${webcast_id}/form/login`)
      .pipe(
        catchError(this.handleError<Cform>('getWebcastTemplate'))
    ).pipe(map(result => {
      if (result) {
        //this.webcastService.webcastSubject.next(result.webcast);
        localStorage.setItem('cform', JSON.stringify(result));
      }
      this.prepareTemplate(result);
        this.cformSubject.next(result);
        return result;
      }));
  }

   private prepareTemplate(x) {
        if (x && x.webcast_id) {
          if (x && x.theme && x.theme.theme) {
            //this.theme.theme_button_primary_style = { "background": x.theme.theme.color, "border-color": x.theme.theme.color };
          };
          this.themeService.setTheme(this.theme);
        }
    }

    clearForm() {
      localStorage.removeItem('cform');
      this.cformSubject.next(null);
    }
    public getRegisterFields() {
      let register_fields = [];
      this.cform.subscribe(x => {
        if (x && x.register_fields) {
          register_fields = x.register_fields;
        }
      });
      return register_fields;
    }
    public getWebcastId() {
      let id = "";
      this.cform.subscribe(x => {
        if (x && x.webcast_id) {
          id = x.webcast_id;
        }
      });
      return id;
    }
    public getLoginFieldName() {
      let fld = [];
      this.cform.subscribe(x => {
        //console.log(x.login_control);
        if (x && x.login_control) {
          x.login_control.forEach(x => {
            //console.log(x);
            fld.push(x.fldname);
          });
          
        }
      });
      return fld;
    }
    public getFieldLabel(fieldName) {
      let fld = "";
      this.cform.subscribe(x => {
        if (x && x.register_fields) {
          //console.log(x.register_fields);
          x.register_fields.forEach(function (obj) {
            //console.log("field name" + fieldName);
            //console.log(obj);
            if (obj['fldname'] == fieldName) {
              fld = obj['label'];
            }
          });
        }
      });
      return fld;
    }
 
    public getThemeBackgroundStyle() {
      let theme_background = { "background": "#3490dc", "border-color": "#3490dc" };
      this.cform.subscribe(x => {
        if (x && x.theme && x.theme.theme) {
          theme_background = { "background": x.theme.theme.color, "border-color": x.theme.theme.color };
        }
      });
      return theme_background;
    }
    public getThemeColor() {
      let theme_background = "#3490dc";
      this.cform.subscribe(x => {
        if (x && x.theme && x.theme.theme) {
          theme_background = x.theme.theme.color };
        });
      return theme_background;
  }

  public getContentStyle() {
    let content_style = {};
    this.cform.subscribe(x => {
      if (x && x.theme && x.theme.content.bg) {
        let bg = x.theme.content.bg;
        if (x.theme.content.bg_type == "image") {
          content_style = {
            "background-position": "center",
            "background-size": "cover",
            "background-image": "url('" + `${environment.imageUrl}/${bg}` + "')"
          };
        } else if (x.theme.content.bg_type == "color") {
          content_style = { "background-color": bg };
        }
      }
    });
    return content_style;
  }
  public getContentBgVideo() {
    let content_style = "";
    this.cform.subscribe(x => {
      if (x && x.theme && x.theme.content.bg) {
        let bg = x.theme.content.bg;
        if (x.theme.content.bg_type == "video") {
          content_style = x.theme.content.bg
        } 
      }
    });
    return content_style;
  }
  public getInviteBanner() {
    let banner_image = "";
    this.cform.subscribe(x => {
      if (x && x.theme && x.theme.content && x.theme.content.bannerimage) {
        let bg1 = x.theme.content.bannerimage
        banner_image = `${environment.imageUrl}/${bg1}`;
      }
    });
    return banner_image;
  }
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error); // log to console instead
        return of(result as T);
      };
    }
    
}
