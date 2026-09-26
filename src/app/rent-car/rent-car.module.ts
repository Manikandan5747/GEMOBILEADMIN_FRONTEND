import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgImageSliderModule } from 'ng-image-slider';
import { RouterModule } from '@angular/router';
import { RentCarComponent } from './rent-car.component';
import { RentCarFormComponent } from './rent-car-form/rent-car-form.component';
import { RentCarRoutingModule } from './rent-car.routing.module';
import { ViewCarImgComponent } from './view-car-img/view-car-img.component';

@NgModule({
    declarations: [
        RentCarComponent,
        RentCarFormComponent,
        ViewCarImgComponent
    ],
    exports: [RentCarComponent],
    imports: [
        RentCarRoutingModule,
        CommonModule,
        NgxDropzoneModule,
        RouterModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectFilterModule,
        NgImageSliderModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],providers: [],
})

export class RentCarModule { }