import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AddCarModelComponent } from './add-car-model/add-car-model.component';
import { AddEditCarModelFormComponent } from './add-edit-car-model-form/add-edit-car-model-form.component';
import { CarModelComponent } from './car-model.component';
import { CarModelRoutingModule } from './car-model.routing.module';
import { EditCarModelComponent } from './edit-car-model/edit-car-model.component';


@NgModule({
    declarations: [
        CarModelComponent,
        AddCarModelComponent,
        AddEditCarModelFormComponent,
        EditCarModelComponent           
    ],
    exports: [CarModelComponent],
    imports: [CarModelRoutingModule,MatSelectFilterModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddCarModelComponent,
        AddEditCarModelFormComponent,
        EditCarModelComponent       
    ]

})




export class CarModelModule { }