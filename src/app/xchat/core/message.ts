import { MessageType } from './message-type';


export class Message {
  type?: MessageType;
  fromId: any;
  toId: any;
  message: string;
  dateSent?: Date;
  dateSeen?: Date;
  constructor() {
    this.type = MessageType.Text;
  }
}
