export class ViewerBussinessCard {
  webcast_id:string;
  viewer_id: number; 
  model_id: number; 
  model_type: string; 
  id:number; 
}

export enum BussinessCardType {
  Stall = 'stall',
  Viewer = 'viewer',
}
