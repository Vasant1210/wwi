import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SanitizeHtmlPipe } from './sanitizing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotfoundComponent } from './notfound';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LandingTimerComponent } from './landing-timer/landing-timer.component';
import { LoginComponent } from './login';
import { OtpverificationComponent } from './otpverification/otpverification.component';
import { ProfileComponent } from './profile/profile.component';
import { AppInitService } from './_services/app-init.service';
import { FaqComponent } from './faq/faq.component';
import { LobbyComponent } from './lobby/lobby.component';
import { NotificationComponent } from './notification/notification.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { AgendaComponent } from './agenda/agenda.component';
import { BriefcaseComponent } from './briefcase/briefcase.component';
import { SocialwallComponent } from './socialwall/socialwall.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NetloungeComponent } from './netlounge/netlounge.component';
import { NotesComponent } from './notes/notes.component';
import { PollsComponent } from './polls/polls.component';
import { QuestionsComponent } from './questions/questions.component';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { NotificationSocketService } from './_services/notification-socket.service';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { CloseBtnComponent } from './close-btn/close-btn.component';
import { MessagePopupComponent } from './message-popup/message-popup.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { RegisterProfileComponent } from './register-profile/register-profile.component';
import { HelpdeskComponent } from './helpdesk/helpdesk.component';
//import { CometChatUI } from './components/CometChatUI/CometChat/cometchat-ui.module';
import { DatePipe } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FooterComponent } from './lobby/footer/footer.component';
import { QnaComponent } from './briefcase/qna/qna.component';
import { SharedModule } from './shared/shared.module';
import { ExperinceZoneModule } from './experince-zone/experince-zone.module';
//import { SpeakerComponent } from './speaker/speaker.component';

import { XchatComponent } from './xchat/xchat.component';
import { XchatModule } from './xchat/xchat.module';
import { SpeakerComponent } from './speaker/speaker.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LbTermsComponent } from './leaderboard/lb-terms/lb-terms.component';
import { LbPrizesComponent } from './leaderboard/lb-prizes/lb-prizes.component';
import { LbLevelsComponent } from './leaderboard/lb-levels/lb-levels.component';
import { LbPointsComponent } from './leaderboard/lb-points/lb-points.component';
import { NetworkingCardComponent } from './netlounge/networking-card/networking-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import * as Hammer from 'hammerjs';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { environment } from 'src/environments/environment';
import { SimpleSmoothScrollModule } from 'ng2-simple-smooth-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';



export function initializeApp1(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  }
}
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

//const config: SocketIoConfig = {
//  url: 'http://localhost:9000', options: { withCredentials: true, "transports": ["websocket"] }
//};

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SanitizeHtmlPipe,
    NotfoundComponent,
    RegisterComponent,
    LandingTimerComponent,
    LoginComponent,
    OtpverificationComponent,
    ProfileComponent,
    FaqComponent,
    WelcomeComponent,
    LobbyComponent,
    NotificationComponent,
    HomeComponent,
    AgendaComponent,
    BriefcaseComponent,
    SocialwallComponent,
    GalleryComponent,
    NetloungeComponent,
    NotesComponent,
    PollsComponent,
    QuestionsComponent,
    CloseBtnComponent,
    MessagePopupComponent,
    AppLoaderComponent,
    RegisterProfileComponent,
    HelpdeskComponent,
    FooterComponent,
    QnaComponent,
    SpeakerComponent,
    EntertainmentComponent,
    LeaderboardComponent,  
    LbTermsComponent,
    LbPrizesComponent,
    LbLevelsComponent,
    LbPointsComponent,
    NetworkingCardComponent  
    //XchatComponent
  ],
  imports: [
    BrowserModule,   
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    //SocketIoModule.forRoot(config),
    NgxImageGalleryModule,
    XchatModule,
    PerfectScrollbarModule,
    SharedModule,
    ExperinceZoneModule,
    BrowserAnimationsModule,
    GuidedTourModule,
    HammerModule, 
    //CometChatUI,
    NgxGoogleAnalyticsModule.forRoot(environment.ga),
    SimpleSmoothScrollModule,
    NgxSpinnerModule
  ],
  providers: [
    AppInitService,
    DatePipe,
    GuidedTourService,
    // NotificationSocketService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeApp1, deps: [AppInitService, HttpClient], multi: true },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: { suppressScrollX: true } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
