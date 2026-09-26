import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
    declarations: [
        NotificationComponent,
        AddNotificationComponent
    ],
    exports: [NotificationComponent],
    imports: [
        NotificationRoutingModule,MatSelectFilterModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddNotificationComponent,
    ]

})




export class NotificationModule { }