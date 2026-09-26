import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ShortLinkRoutingModule } from './short-links-routing.module';
import { ShortLinksComponent } from './short-links.component';
import { AccessListComponent } from './access-list/access-list.component';


@NgModule({
    declarations: [
        ShortLinksComponent,
        AccessListComponent,
       
    ],
    exports: [ShortLinksComponent],
    imports: [ShortLinkRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
      
    ]

})

export class ShortLinkModule { }