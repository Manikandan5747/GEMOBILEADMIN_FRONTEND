import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { CorporatePartnersComponent } from './corporate-partners.component';
import { CorporatePartnersRoutingModule } from './corporate-partners.routing';
import { AddCorporatePartnersComponent } from './add-corporate-partners/add-corporate-partners.component';
import { ViewCorporateIconComponent } from './view-corporate-icon/view-corporate-icon.component';
import { CorporateSpecialOfferComponent } from './corporate-special-offer/corporate-special-offer.component';
import { AddCorporateSpecialOfferComponent } from './add-corporate-special-offer/add-corporate-special-offer.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { EditCorporatePartnersComponent } from './edit-corporate-partners/edit-corporate-partners.component';


@NgModule({
    declarations: [
        CorporatePartnersComponent,
        AddCorporatePartnersComponent,
        ViewCorporateIconComponent,
        CorporateSpecialOfferComponent,
        AddCorporateSpecialOfferComponent,
        EditCorporatePartnersComponent,
       
    ],
    exports: [CorporatePartnersComponent],
    imports: [
        CorporatePartnersRoutingModule,
        CommonModule,MatSelectFilterModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddCorporatePartnersComponent,
        ViewCorporateIconComponent
    ]

})


export class  CorporatePartnerModule { }