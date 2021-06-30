import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService, CformService, GameService } from '../_services';
import { User, ActiveGame} from '../_models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameES: EventSource;
  webcastId; //from user session
  currentUser: User;
  activeGame: ActiveGame;
  styleGuideBackground: any;
  forceHide: boolean = false;
  constructor(private authenticationService: AuthenticationService,
    private cFormService: CformService,
    private gameService: GameService,
    private zone: NgZone
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      if (x) {
        this.currentUser = x;
        this.webcastId = x.webcast_id;
      }
    });
    
  }

  ngOnInit() {
    this.connectGameEs();
    this.styleGuideBackground = this.cFormService.getThemeBackgroundStyle();
  }

  connectGameEs() {
    if (typeof (EventSource) !== "undefined") {
      this.gameES = new EventSource(`${environment.apiUrl}/${this.webcastId}/viewer/game/update`);
      this.gameES.addEventListener("message", event => {
        let response = JSON.parse(event.data);
        this.updateView(response);
      });
    } else {
      // Sorry! No server-sent events support..
      this.initFallback();
    }
  }
  initFallback() {
    this.zone.runOutsideAngular(() => {
      setInterval(() => { this.getGameUpdate(); }, 5000);
    });
  }
  closeGameEs() {
    this.gameES.close();
  }
  forceClose() {
    this.forceHide = true;
  }

  getGameUpdate() {
    this.gameService.getGameUpdateFeed(this.webcastId).subscribe(
      data => {
        this.updateView(data.data);
      }
    );
  }

  updateView(data) {
    let response = data;
    if (response && response.active_game) {
      //check there is a new game
      if (this.activeGame && (this.activeGame.id != response.active_game.id)) {
        this.forceHide = false;
      }
      this.activeGame = response.active_game;
    } else {
      this.activeGame = null;
      this.forceHide = false;
    }
  }
}
