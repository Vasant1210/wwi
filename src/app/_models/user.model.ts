export class User {
  id: number;
  authdata?: string;
  api_token?: string;
  webcast_id:string;
  w_id:number;
  login_field:string;
  enable:boolean;
  login_time:string;
  logout_time: string;
  detail: any;
  hasProfile: boolean = false;
  email: string;
  phoneNumber: string;
  fullName: string;
  profile: any;
  socketId: any;
  company_name:string;
  designation:string;
  profile_pic:string;
}
