import { Inject, Injectable, Renderer2, RendererFactory2, ElementRef, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { AuthenticationService } from './authentication.service';
import { User } from '../_models';
import { environment } from '../../environments/environment';
import { WebcastService } from './webcast.service';

declare var CometChatWidget: any;


@Injectable({
  providedIn: 'root'
})
export class CometChatService {

  public loaded: boolean = false;
  public loggedIn: boolean = false;
  private loadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //private loadSubject: Subject<boolean> = new Subject<boolean>();
  private loginSubject: Subject<boolean> = new Subject<boolean>();
  public hasLaunched: Observable<boolean>;
  public hasLogged: Observable<boolean>;
  private renderer: Renderer2;
  currentUser: User;


  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: Document,
    private webcastService: WebcastService) {
   // this.hasLaunched = this.loadSubject.asObservable();
   // this.hasLogged = this.loginSubject.asObservable();

    //this.renderer = rendererFactory.createRenderer(null, null);
    //this.load();
  }

  private load() {
    //if (this.loaded)
    //return;

    //    const s = this.renderer.createElement('script');
    //    s.type = 'text/javascript';
    //    s.text = `
    //var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    //(function(){
    //var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    //s1.async=true;
    //s1.src='https://embed.tawk.to/${environment.helpdeskkey}';
    //s1.charset='UTF-8';
    //s1.setAttribute('crossorigin','*');
    //s0.parentNode.insertBefore(s1,s0);
    //})();
    //`;
    //    this.renderer.appendChild(this._document.body, s);
    //Tawk_API.onLoad = this.loadedEvent.bind(this);
    //this.loadedEvent.bind(this);  
  }

  init() {
  if (this.webcastService && this.webcastService.hasWidget('commet_chat')) {
      
    CometChatWidget.init({
      "appID": "28769aa1687f565",
      "appRegion": "us",
      "authKey": "5393b00849c3fe0191dbe52992260d16960e6fe2"
    }).then(response => {
      console.log("Initialization completed successfully");
    }, error => {
      console.log("Initialization failed with error:", error);
      //Check the reason for error and take appropriate action.
    });
}
  }

  login(user: User) {
    if (this.webcastService && this.webcastService.hasWidget('commet_chat')) {
      CometChatWidget.login({
        "uid": `${user.id.toString()}`
      }).then(response => {
        this.launch(user.id.toString());
        this.loggedInEvent();
        console.log("User login successfull");
      }, error => {
        CometChatWidget.createOrUpdateUser({
          "uid": `${user.id.toString()}`,
          "name": `${user.fullName}`
        }).then(response => {
          CometChatWidget.login({
            "uid": `${user.id.toString()}`
          }).then(response => {
            //this.launch(user.id.toString());
            this.loggedInEvent();
            console.log("User login successfull");
          },
            error => {
              console.log("User login failed with error:", error);
            })
        },
          error => {
            console.log("User creation failed with error:", error);
          });
        console.log("User login failed with error:", error);
        //Check the reason for error and take appropriate action.
      });
    }
  }

  logout() {
    if (this.webcastService && this.webcastService.hasWidget('commet_chat')) {
      this.hideWidget();
      this.loaded = false;
      this.loadSubject.next(this.loaded);
      CometChatWidget.logout();
    }
  }
  showWidget() {
    if (this.webcastService && this.webcastService.hasWidget('commet_chat')) {
      if (document.getElementById('cometchat__widget')) {
        document.getElementById('cometchat__widget').style.display = "block";
      }
    }
  }

  hideWidget() {
    if (this.webcastService && this.webcastService.hasWidget('commet_chat')) {
      if (document.getElementById('cometchat__widget')) {
        console.log("hidng widget");
        document.getElementById('cometchat__widget').style.display = "none";
      }
    }
  }
  launch(userId) {
    if (this.webcastService && this.webcastService.hasWidget('commet_chat')) {
      if (this.webcastService && this.webcastService.hasWidget('x_chat')) {
        document.getElementById('cometchat__widget').style.display = "none";
        return;
      }
      if (document.getElementById('cometchat__widget')) {
        //this.showWidget();
        return;
      }
      CometChatWidget.launch({
        "widgetID": "db4668da-343c-438f-bd17-c55f70b30c91",
        "docked": "true",
        "alignment": "right", //left or right
        "roundedCorners": "true",
        "height": "60vh",
        "width": "35vh",
        "defaultID": `${userId}`, //default UID (user) or GUID (group) to show,
        "defaultType": 'user' //user or group,
      }).then(response => {
        this.loadedEvent();
        this.showWidget();
      }, error => {
        console.log("Launch failed with error:", error);
        //Check the reason for error and take appropriate action.
      });;
    }
  }
  private loadedEvent() {
    this.loaded = true;
    this.loadSubject.next(this.loaded);
  }

  private loggedInEvent() {
    this.loggedIn = true;
    this.loadSubject.next(this.loggedIn);
  }
  //public UpdateTawkUser(user: any) {
  //  this.loadedWrapper(() => { this.updateAtrributes(user) });
  //}

  //private loadedWrapper(func: any) {
  //  if (!this.loaded) {
  //    var sub = this.loadSubject.asObservable().subscribe({
  //      next: () => {
  //        func();
  //        sub.unsubscribe();
  //      },
  //      error: () => { }
  //    });
  //  } else {
  //    func();
  //  }
  //}

  //public ExpandChatWindow(show: boolean = false) {
  //  this.loadedWrapper(() => show ? Tawk_API.maximize() : Tawk_API.minimize());
  //}

  //public SetChatVisibility(show: boolean = false) {
  //  this.loadedWrapper(() => show ? Tawk_API.showWidget() : Tawk_API.hideWidget());
  //}

  //private updateAtrributes(user: User) {
  //  if (user) {
  //    Tawk_API.setAttributes({
  //      'name': `${user.fullName}`,
  //      'email': user.email,
  //      'id': user.id,
  //    }, function (error) { });
  //  }
  //}
}
