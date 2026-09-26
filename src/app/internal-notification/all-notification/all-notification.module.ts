import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllNotificationComponent } from './all-notification.component';
import { AllnotificationRoutes } from './all-notification.routes';
// import { NotificationPopupModule } from '../notification-popup/notification-popup.module';
// import { ViewNotificationModule } from '../view-notification/view-notification.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';


@NgModule({
    declarations: [AllNotificationComponent],

    imports: [
        RouterModule.forChild(AllnotificationRoutes),
        CommonModule,
        CommonModule,
        DemoMaterialModule,
        // NotificationPopupModule,
        FormsModule,
        ReactiveFormsModule,
        // ViewNotificationModule,
    ],
    exports: [AllNotificationComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
        
    ]

})
export class InternalNotificationModule { }