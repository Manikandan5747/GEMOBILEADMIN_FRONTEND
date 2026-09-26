import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FooterComponent } from './layouts/full/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BnNgIdleService } from 'bn-ng-idle';
import { LoginLogComponent } from './login-log/login-log.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PushNotificationsService } from './service/push.notification.service';
import { NotificationPopupModule } from './internal-notification/notification-popup/notification-popup.module';
import { SpecialOfferRegistrationComponent } from './special-offer-registration/special-offer-registration.component';
import { SoQrcodeGenerationComponent } from './so-qrcode-generation/so-qrcode-generation.component';
import { DigitalSignDetailsComponent } from './digital-sign-details/digital-sign-details.component';
import { SpecialOfferHistoryComponent } from './special-offer-history/special-offer-history.component';
import { SalesContractComponent } from './ge-motors/sales-contract/sales-contract.component';
import { MobileAddressComponent } from './mobile-address/mobile-address.component';
import { CrmAccessTokenComponent } from './crm-access-token/crm-access-token.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDocprintHistoryComponent } from './ge-motors/user-docprint-history/user-docprint-history.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RatingComponent } from './rating/rating.component';
import { CompanyComponent } from './company/company.component';
import { TechnicianNotificationComponent } from './technician-notification/technician-notification.component';
import { GlobalErrorHandlerService } from './common/global-error-handler.service';
import { ErrorlogService } from './errorlog.service';
import { ErrorLoggingInterceptor } from './error-logging.interceptor';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { DriverTrackingComponent } from './driver-tracking/driver-tracking.component';
import { MobileAppOnlineStatusComponent } from './mobile-app-online-status/mobile-app-online-status.component';


@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    FooterComponent,
    LoginLogComponent,
    SpecialOfferRegistrationComponent,
    SoQrcodeGenerationComponent,
    DigitalSignDetailsComponent,
    SpecialOfferHistoryComponent,
    SalesContractComponent,
    MobileAddressComponent,
    CrmAccessTokenComponent,
    ProfileComponent,
    UserDocprintHistoryComponent,
    RatingComponent,
    CompanyComponent,
    TechnicianNotificationComponent,
    PaymentHistoryComponent,
    DriverTrackingComponent,
    MobileAppOnlineStatusComponent,
  ],
  imports: [MatSnackBarModule, ToastrModule.forRoot({
    positionClass: 'toast-top-right', closeButton: true,
  }),
    BrowserModule, NgxChartsModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule, MatSelectFilterModule,
    FlexLayoutModule,
    HttpClientModule, NotificationPopupModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    BnNgIdleService, PushNotificationsService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Locale for DD/MM/YYYY
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YY',
        },
        display: {
          dateInput: 'DD/MM/YY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    {
      provide: ErrorHandler,
      useClass: ErrorlogService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorLoggingInterceptor,
      multi: true
    },

    //{ provide: HTTP_INTERCEPTORS, useClass: APIKEYInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
