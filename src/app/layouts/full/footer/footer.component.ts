import { Component, OnInit } from '@angular/core';
import { WebversionService } from 'src/app/webversion/service/webversion.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  webversiondata: any;
  today:any=new Date();
  constructor(private webversionService: WebversionService) 
  { }

  ngOnInit(): void {
    this.webversionService.getLastRow().pipe()
    .subscribe((data: any) => {
      this.webversiondata = data && data[0];
      console.log("datadatadata ", data);
    });
  }

}
