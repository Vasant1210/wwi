export class Theme {
    primary: string = "#fff"; //backgrounds
    secondray: string = "#fff"; //backgrounds
    button_primary: string = "#3490dc"; //for buttons
    button_primary_style: {} = { "background": "#3490dc", "border-color": "#3490dc" };
    button_secondray: string = "#3490dc"; //for buttons 
    text_style_color: string = "#eee"; // for text

    topHeader_bg_color: string = "";
    topHeader_bg_image: string = "";
    topHeader_bg_logo: string = "";

    header_bg_color: string = "";
    header_bg_image: string = "";
    header_logos: [];


    content_bg_type: string = "";
    content_bg_style: any = {};
    content_bg_color: string = "";
    content_bg_video: string = "";
    content_bg_image: string = "";
    content_banner_image: string = "";
    content_banner_video: string = "";

    footer_bg_type: string = "";
    footer_bg_color:string = "";
    footer_logos: [];
    layout: any;
}
