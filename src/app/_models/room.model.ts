import { User } from './user.model';

export class Room {
  assets: any;
  bgimage: string;
  created_at: string;
  created_by: number;
  deleted_at: string;
  enable: boolean
  end_time: string;
  id: number
  representatives: User[]
  room_slug: string;
  room_type: string;
  start_time: string;
  status: string;
  title: string;
  updated_at: string;
  updated_by: number
  webcast_id: string;
  widgets: null;
  stall_gallery: any[]=[]
}

export class Lobby extends Room {
}

export class MainEvent extends Room {
}

export class Stall extends Room{
}

export class Lounge extends Room{
}


