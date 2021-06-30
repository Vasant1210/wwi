import { Inject, Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { AuthenticationService } from './authentication.service';
import { User } from '../_models';
import { environment } from '../../environments/environment';
declare var Tawk_API: any;

@Injectable({
  providedIn: 'root'
})
export class HelpdeskService {

  private loaded: boolean;
  private loadSubject: Subject<boolean> = new Subject<boolean>();
  private renderer: Renderer2;
  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: Document) {

    this.renderer = rendererFactory.createRenderer(null, null);
    //this.load();
  }

  public load(helpdeskkey:string) {
    //helpdeskkey = helpdeskkey.replace("//", "/");
    if (this.loaded) {
      //Tawk_s1.src = 'https://embed.tawk.to${helpdeskkey}';
      return;
    }
    
    //var dd = this.renderer.createElement('<div>');
    //this.loaded = false;
    var s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    //s.src = `https://embed.tawk.to${helpdeskkey}`;
    s.text = `
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/${helpdeskkey}';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
`;

    //dd.text = s;
    //console.log(s);
    this.renderer.appendChild(this._document.body, s);
    //console.log(this.loaded);
    Tawk_API.onBeforeLoad = this.breforOnLoad();
    Tawk_API.onLoad = this.loadedEvent.bind(this);
  }
  private breforOnLoad() {
      //console.log("hello");
  }
  private loadedEvent() {
    //console.log("I am loaded");
    this.loaded = true;
    this.loadSubject.next(this.loaded);
  }
  public UpdateTawkUser(user: any) {
    this.loadedWrapper(() => { this.updateAtrributes(user) });
  }

  private loadedWrapper(func: any) {
    if (!this.loaded) {
      var sub = this.loadSubject.asObservable().subscribe({
        next: () => {
          func();
          sub.unsubscribe();
        },
        error: () => { }
      });
    } else {
      func();
    }
  }

  public ExpandChatWindow(show: boolean = false) {
    this.loadedWrapper(() => show ? Tawk_API.maximize() : Tawk_API.minimize());
  }

  public SetChatVisibility(show: boolean = false) {
    this.loadedWrapper(() => show ? Tawk_API.showWidget() : Tawk_API.hideWidget());
  }

  private updateAtrributes(user: User) {
    if (user && this.loaded) {
      Tawk_API.setAttributes({
        'name': `${user.fullName}`,
        'email': user.email,
        'id': user.id,
      }, function (error) { });
    }
  }
  public unloadScript() {
    //console.log("unloading");
    //Tawk_API = {};
    //this.UnloadedEvent();
    //Tawk_API.onLoad = this.UnloadedEvent.bind(this);
  }
}
