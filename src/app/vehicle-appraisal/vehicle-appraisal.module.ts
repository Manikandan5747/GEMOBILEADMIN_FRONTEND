import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { VehicleAppraisalComponent } from './vehicle-appraisal.component';
import { ViewCarImgComponent } from './view-car-img/view-car-img.component';
import { VehicleAppraisalRoutingModule } from './vehicle-appraisal.routing.module';

import { NgImageSliderModule } from 'ng-image-slider';
import { ViewVehicleDetailsComponent } from './view-vehicle-details/view-vehicle-details.component';


@NgModule({
    declarations: [
        VehicleAppraisalComponent,
        ViewCarImgComponent,
        ViewVehicleDetailsComponent
    ],
    exports: [VehicleAppraisalComponent],
    imports: [VehicleAppraisalRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,NgImageSliderModule,
        ReactiveFormsModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
   

})


export class VehicleAppraisalModule { }