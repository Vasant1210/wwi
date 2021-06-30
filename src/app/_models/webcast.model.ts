import { CustomForm } from './custom-form';
import { Theme } from './theme.model';

export class Webcast {
  id: number=0;
  title: string;
  slug: string;
  start_datetime: string;
  duration: number;
  num_speaker: number;
  end_datetime: string;
  status: string;
  webcast_id: string;
  youtube_embed: string;
  widgets: any = null;
  forms: CustomForm[] = [];
  theme: Theme;
  password_enable: boolean = false;
  detail: any;
  logo: string;
}

