import { Component, OnInit, ElementRef } from '@angular/core';
import { RoomService } from '../_services/room.service';
import { WebcastService, AuthenticationService } from '../_services';
import { Webcast, User } from '../_models';
import { GameService } from '../_services/game.service';
import { Games } from '../_models/game.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { Room } from '../_models/room.model';


@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.css']
})
export class EntertainmentComponent implements OnInit {
  gameRoom: Room;
  games:Games[];
  gameroom_bgimage:string;
  webcast: Webcast;
  currentUser: User;
  game_id:number;
  selectedGame:any;
  constructor(private webcastService: WebcastService, private roomService: RoomService, private gameService: GameService,private router: Router,
    private activatedRoute: ActivatedRoute, private statsService: StatsService, private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x
        if (this.currentUser && !this.currentUser.hasProfile) {
          this.router.navigate([`${this.currentUser.webcast_id}/profile`]);
        }
      });
     }

  ngOnInit(): void {
    //
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        console.log(x);
        this.webcast = x;
        this.roomService.getRoomByType(this.webcast.webcast_id, 'game');
        this.activatedRoute.params.subscribe(x => {
          if (x && x.gameId) {
            this.game_id=  x.gameId;  
                     
          }          
          this.loadGame();
        });
        this.loadGameRoom();
            
      }
    });  
  }

  loadGameRoom() {
    this.roomService.rooms.subscribe(
      x => {  
      if(x)
      {
        this.gameRoom = x.find(x => x.room_type == 'game');
        if (this.gameRoom) {
          this.gameroom_bgimage = this.gameRoom.bgimage;
        }
      }
      });
  }

  loadGame() {
    this.gameService.getGame(this.webcast.webcast_id).subscribe(
      x => {  
      if(x)
      {
        this.games=x;
        console.log(this.games);   
        if(this.game_id){
          this.games = x.find(r => r.id == this.game_id);  
        }
      }
      });
  }

  onSelectGame(_selectedGame)
  {    
      this.selectedGame = _selectedGame;
      this.statsService.trackActivity(this.webcast.webcast_id,'play_game');  
   
  }
  backToGameList()
  {
    this.selectedGame =null;
  }
  goToLobby() {
    this.router.navigate([`${this.webcast.webcast_id}/lobby`]);
  }

  getStyle() {
    
  }
}
