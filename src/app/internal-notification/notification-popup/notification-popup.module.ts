import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationPopupComponent } from './notification-popup.component';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
    declarations: [NotificationPopupComponent],
    imports: [
        CommonModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        // ViewNotificationModule
    ],
    exports: [NotificationPopupComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
        NotificationPopupComponent
    ]
})
export class NotificationPopupModule { }