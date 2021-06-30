import { Webcast } from './webcast.model';

export class Cform {
  login_control:any;  //login ctrl array
  webcast_id:string; // id of the webcast
  layout:[]; //Layout of the page
  theme:any;  // object related to over all color, and header/footer/content section color and bg
  title:string; //title of webcast
  header: string; //layout header html string
  footer:string;  //layout footer html string
  content: string;
  password_enable: boolean;
  webcast_start_datetime: string;
  webcast_duration: number;
  register_fields: [];
  form_mode = 'login';
  form_login_value = ''; //for tranfering between forms
  webcast: Webcast;
  
}
