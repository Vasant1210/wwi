import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NotfoundComponent } from './notfound';
import { StatuspageComponent } from './statuspage';
import { AuthGuard } from './_helpers';

import { ProfileComponent } from './profile/profile.component';
import { LobbyComponent } from './lobby/lobby.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { NetloungeComponent } from './netlounge/netlounge.component';
import { ExperinceZoneComponent } from './experince-zone/experince-zone.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';
import { RegisterProfileComponent } from './register-profile/register-profile.component';



const routes: Routes = [
  { path: 'notfound', component: NotfoundComponent },
  { path: ':webcast_id', component: LandingComponent, data: { header: false, footer: false } },
  { path: ':webcast_id/end', component: StatuspageComponent },
  { path: ':webcast_id/profile/:mode', component: RegisterProfileComponent, canActivate: [AuthGuard], data: { header: true, footer: false } },
  { path: ':webcast_id/profile', component: RegisterProfileComponent, canActivate: [AuthGuard] },
 // { path: ':webcast_id/profile/:mode', component: ProfileComponent, canActivate: [AuthGuard], data: { header: true, footer: false } },
 // { path: ':webcast_id/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: ':webcast_id/welcome', component: WelcomeComponent, canActivate: [AuthGuard], data: { header: false, footer: false } },
  { path: ':webcast_id/lobby', component: LobbyComponent, canActivate: [AuthGuard], data: { header: true, footer: true } },
  { path: ':webcast_id/home', component: HomeComponent, canActivate: [AuthGuard], data: { header: false, footer: false } },
  { path: ':webcast_id/home/:roomId', component: HomeComponent, canActivate: [AuthGuard], data: { header: false, footer: false } },
  { path: ':webcast_id/lounge', component: NetloungeComponent, canActivate: [AuthGuard], data: { header: true, footer: false } },
  { path: ':webcast_id/expo', component: ExperinceZoneComponent, canActivate: [AuthGuard], data: { header: true, footer: false } },
 // { path: ':webcast_id/entertainment', component: EntertainmentComponent, canActivate: [AuthGuard], data: { header: true, footer: false } },
 // { path: ':webcast_id/entertainment/:gameId', component: EntertainmentComponent, canActivate: [AuthGuard], data: { header: true, footer: false } },
  
  { path: '**', component: NotfoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
