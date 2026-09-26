import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgImageSliderModule } from 'ng-image-slider';
import { ShowroomCarDetailsComponent } from './showroom-car-details.component';
import { ShowroomCarDetailsRoutingModule } from './showroom-car-details.routing.module';
import { AddEditShowroomCarDetailsFormComponent } from './add-edit-showroom-car-details-form/add-edit-showroom-car-details-form.component';
import { AddEditShowroomContactDetailsFormComponent } from './add-edit-showroom-contact-details-form/add-edit-showroom-contact-details-form.component';
import { AddShowroomContactDetailsComponent } from './add-showroom-contact-details/add-showroom-contact-details.component';
import { EditShowroomContactDetailsComponent } from './edit-showroom-contact-details/edit-showroom-contact-details.component';
@NgModule({
    declarations: [
        ShowroomCarDetailsComponent,
        AddEditShowroomCarDetailsFormComponent,
        AddEditShowroomContactDetailsFormComponent,
        AddShowroomContactDetailsComponent,
        EditShowroomContactDetailsComponent
    ],
    exports: [ShowroomCarDetailsComponent],
    imports: [ShowroomCarDetailsRoutingModule,
        CommonModule,NgxDropzoneModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectFilterModule,
        NgImageSliderModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})

export class ShowroomCarDetailsModule { }