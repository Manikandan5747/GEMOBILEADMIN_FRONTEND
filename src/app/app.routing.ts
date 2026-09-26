import { Routes } from '@angular/router';
import { DbShowroomManagerComponent } from './dashboard/gemotordashboard/db-showroom-manager/db-showroom-manager.component';
import { GemotordashboardComponent } from './dashboard/gemotordashboard/gemotordashboard/gemotordashboard.component';
import { DigitalSignDetailsComponent } from './digital-sign-details/digital-sign-details.component';
import { AddEditActivityComponent } from './ge-motors/activity/add-edit-activity/add-edit-activity.component';
import { OpenActivityComponent } from './ge-motors/activity/open-activity/open-activity.component';
import { ConsignmentPdfComponent } from './ge-motors/consignment/consignment-pdf/consignment-pdf.component';
import { AddEditLeadsComponent } from './ge-motors/leads/add-edit-leads/add-edit-leads.component';
import { AddEditOpportunityComponent } from './ge-motors/opportunity/add-edit-opportunity/add-edit-opportunity.component';
import { AddEditQuotationComponent } from './ge-motors/quotation/add-edit-quotation/add-edit-quotation.component';
import { SalesContractComponent } from './ge-motors/sales-contract/sales-contract.component';
import { AddEditSalesOrderComponent } from './ge-motors/sales-order/add-edit-sales-order/add-edit-sales-order.component';
import { AddEditStageComponent } from './ge-motors/stage/add-edit-stage/add-edit-stage.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginLogComponent } from './login-log/login-log.component';
import { SoQrcodeGenerationComponent } from './so-qrcode-generation/so-qrcode-generation.component';
import { SpecialOfferHistoryComponent } from './special-offer-history/special-offer-history.component';
import { SpecialOfferRegistrationComponent } from './special-offer-registration/special-offer-registration.component';
import { ReceiptVoucherComponent } from './ge-motors/advance-payment/receipt-voucher/receipt-voucher.component';
import { MobileAddressComponent } from './mobile-address/mobile-address.component';
import { CrmAccessTokenComponent } from './crm-access-token/crm-access-token.component';
import { ProfileComponent } from './profile/profile.component';
import { TestDriveComponent } from './ge-motors/test-drive/test-drive.component';
import { UserDocprintHistoryComponent } from './ge-motors/user-docprint-history/user-docprint-history.component';
import { AuthGuard } from './shared/accordion/auth.guard';
import { RatingComponent } from './rating/rating.component';
import { VehicleAppraisalComponent } from './vehicle-appraisal/vehicle-appraisal.component';
import { CompanyComponent } from './company/company.component';
import { TechnicianNotificationComponent } from './technician-notification/technician-notification.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { DriverTrackingComponent } from './driver-tracking/driver-tracking.component';
import { AddEditEventQueryFormComponent } from './manage-event-query/add-edit-event-query-form/add-edit-event-query-form.component';

import { AddEditEventPlannerFormComponent } from './manage-event-planner/add-edit-event-planner-form/add-edit-event-planner-form.component';

import { EditEventPlannerFormComponent } from './manage-event-planner/edit-event-planner-form/edit-event-planner-form.component';
import { MobileAppOnlineStatusComponent } from './mobile-app-online-status/mobile-app-online-status.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '', redirectTo: '/login', pathMatch: 'full'
      },
      {
        path: 'internal-notification', loadChildren: () => import('./internal-notification/all-notification/all-notification.module').then(m => m.InternalNotificationModule),
      },
      { path: 'profile', component: ProfileComponent, },
      { path: 'gemotors-db', component: DbShowroomManagerComponent, },


      {
        path: 'print-history', component: UserDocprintHistoryComponent, canActivate: [AuthGuard],
      },
      { path: 'login-log', component: LoginLogComponent, canActivate: [AuthGuard], },
      { path: 'gemotors-dashboard', component: GemotordashboardComponent, canActivate: [AuthGuard], },

      { path: 'mobile-address', component: MobileAddressComponent, canActivate: [AuthGuard], },
      { path: 'accress-token', component: CrmAccessTokenComponent, canActivate: [AuthGuard], },
      {
        path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard],
      },
      {
        path: 'customer', loadChildren: () => import('./manage-customer/manage-customer.module').then(mod => mod.ManageCustomerModule), canActivate: [AuthGuard],
      },
      {
        path: 'special-offer', loadChildren: () => import('./special-offer/special-offer.module').then(mod => mod.SpecialOfferModule), canActivate: [AuthGuard],
      },
      {
        path: 'notification', loadChildren: () => import('./notification/notification.module').then(mod => mod.NotificationModule), canActivate: [AuthGuard],
      },
      {
        path: 'user', loadChildren: () => import('./list-all-user/list-all-user.module').then(mod => mod.ListUserModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'mobileotp', loadChildren: () => import('./mobileotp/mobileotp/mobileotp.module').then(mod => mod.MobileotpModule), canActivate: [AuthGuard],
      },
      {
        path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule), canActivate: [AuthGuard],
      },
      {
        path: 'brand', loadChildren: () => import('./buy-car/brand/brand.module').then(m => m.BrandModule), canActivate: [AuthGuard],
      },
      {
        path: 'model', loadChildren: () => import('./buy-car/car-model/car-model.module').then(m => m.CarModelModule), canActivate: [AuthGuard],
      },
      {
        path: 'car-details', loadChildren: () => import('./buy-car/car-details/car-details.module').then(m => m.CarDetailsModule), canActivate: [AuthGuard],
      },
      {
        path: 'catalogue', loadChildren: () => import('./buy-car/catalogue-brand-model/catalogue-brand-model.module').then(m => m.CatalogueBrandModelModule), canActivate: [AuthGuard],
      },
      {
        path: 'app-version', loadChildren: () => import('./buy-car/mobile-version/mobile-version.module').then(m => m.MobileVersionModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'internal-app-version', loadChildren: () => import('./internal-app-version/internal-app-version.module').then(m => m.InternalAppVersionModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'showroom-contact-details', loadChildren: () => import('./buy-car/showroom-car-details/showroom-car-details.module').then(m => m.ShowroomCarDetailsModule), canActivate: [AuthGuard],
      },
      {
        path: 'user-role', loadChildren: () => import('./user-role/user-role.module').then(m => m.UserRoleModule), canActivate: [AuthGuard],
      },
      {
        path: 'module', loadChildren: () => import('./manage-module/manage-module.module').then(m => m.ManageModuleModule), canActivate: [AuthGuard],
      },
      {
        path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule), canActivate: [AuthGuard],
      },

      {
        path: 'portal-user', loadChildren: () => import('./portal-user/portal-user.module').then(m => m.PortalUserModule), canActivate: [AuthGuard],
      },
      {
        path: 'car-city', loadChildren: () => import('./city/city.module').then(m => m.CityModule), canActivate: [AuthGuard],
      },
      {
        path: 'showroom-category', loadChildren: () => import('./showroom-category/showroomcategory.module').then(m => m.ShowroomCategoryModule), canActivate: [AuthGuard],
      },
      {
        path: 'corporate-partner', loadChildren: () => import('./corporate-partners/corporate-partners.module').then(m => m.CorporatePartnerModule), canActivate: [AuthGuard],
      },
      {
        path: 'webversion', loadChildren: () => import('./webversion/webversion.module').then(m => m.WebversionModule), canActivate: [AuthGuard],
      },
      { path: 'special-offer-registraction', component: SpecialOfferRegistrationComponent, canActivate: [AuthGuard], },
      {
        path: 'rent-car', loadChildren: () => import('./rent-car/rent-car.module').then(m => m.RentCarModule), canActivate: [AuthGuard],
      },
      {
        path: 'contract-type',
        loadChildren: () => import('./contract-type/contract-type.module').then(m => m.ContractTypeModule), canActivate: [AuthGuard],
      },
      {
        path: 'service-advisor',
        loadChildren: () => import('./service-advisor/service-advisor.module').then(m => m.ServiceAdvisorModule), canActivate: [AuthGuard],
      },
       {
        path: 'crm-models',
        loadChildren: () => import('./crm-models/crm-models.module').then(m => m.CrmModelsModule), canActivate: [AuthGuard],
      },

      //Mani
      {
        path: 'newSpecialOffer', loadChildren: () => import('./new-special-offer/new-special-offer.module').then(m => m.NewSpecialOfferModule), canActivate: [AuthGuard],
      },
      { path: 'degital-sign', component: DigitalSignDetailsComponent, canActivate: [AuthGuard], },
      {
        path: 'termsandconditions',
        loadChildren: () => import('./termsandconditions/termsandconditions.module').then(m => m.TermsandconditionsModule), canActivate: [AuthGuard],
      },
      { path: 'QR-code', component: SoQrcodeGenerationComponent, canActivate: [AuthGuard], },
      { path: 'specialoffer-customerusage', component: SpecialOfferHistoryComponent, canActivate: [AuthGuard], },
      //Ge motors
      {
        path: 'expense-type', loadChildren: () => import('./ge-motors/expense-type/expense-type.module').then(mod => mod.ExpenseTypeConfigModule), canActivate: [AuthGuard],
      },
      {
        path: 'carowner-type', loadChildren: () => import('./ge-motors/carowner-type/carowner-type.module').then(mod => mod.CarownerTypeConfigModule), canActivate: [AuthGuard],
      },

      {
        path: 'account', loadChildren: () => import('./ge-motors/account/account.module').then(mod => mod.AccountModule), canActivate: [AuthGuard],
      },
      {
        path: 'stage', loadChildren: () => import('./ge-motors/stage/stage.module').then(mod => mod.StageModule), canActivate: [AuthGuard],
      },
      {
        path: 'sales-order', loadChildren: () => import('./ge-motors/sales-order/sales-order.module').then(mod => mod.SalesOrderModule), canActivate: [AuthGuard],
      },
      {
        path: 'quotation', loadChildren: () => import('./ge-motors/quotation/quotation.module').then(mod => mod.QuotationModule), canActivate: [AuthGuard],
      },
      {
        path: 'opportunity', loadChildren: () => import('./ge-motors/opportunity/opportunity.module').then(mod => mod.OpportunityModule), canActivate: [AuthGuard],
      },
      {
        path: 'campaigns', loadChildren: () => import('./ge-motors/campaigns/campaigns.module').then(mod => mod.CampaignsModule), canActivate: [AuthGuard],
      },
      {
        path: 'type-config', loadChildren: () => import('./ge-motors/type-config/type-config.module').then(mod => mod.TypeConfigModule), canActivate: [AuthGuard],
      },
      {
        path: 'leads', loadChildren: () => import('./ge-motors/leads/leads.module').then(mod => mod.LeadsModule), canActivate: [AuthGuard],
      },
      {
        path: 'contact', loadChildren: () => import('./ge-motors/contact/contact.module').then(mod => mod.ContactModule), canActivate: [AuthGuard],
      },
      {
        path: 'cash-request', loadChildren: () => import('./ge-motors/cash-request/cash-request.module').then(mod => mod.CashRequestModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'luckyDraw', loadChildren: () => import('./luckyDraw/lucky-draw.module').then(mod => mod.LuckyDrawModule),
      },


      {
        path: 'rating', component: RatingComponent,
      },
      {
        path: 'short-link', loadChildren: () => import('./short-links/short-links.module').then(mod => mod.ShortLinkModule),
        // canActivate: [AuthGuard],
      },

      {
        path: 'modeof-payment', loadChildren: () => import('./ge-motors/mode-of-payment/mode-of-payment.module').then(mod => mod.ModeofPaymentModule),
        // canActivate: [AuthGuard],
      },
      {
        path: 'vehicle-appraisal', loadChildren: () => import('./vehicle-appraisal/vehicle-appraisal.module').then(mod => mod.VehicleAppraisalModule),
        // canActivate: [AuthGuard],
      },

      {
        path: 'user-privilege', loadChildren: () => import('./user-privilege/user-privilege.module').then(mod => mod.PrivilegeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'gemotor-privilege', loadChildren: () => import('./gemotor-privileges/user-privilege.module').then(mod => mod.GemotorsPrivilegeModule),
        // canActivate: [AuthGuard],
      },
      {
        path: 'gemobileadmin-privilege', loadChildren: () => import('./gemotor-privileges/user-privilege.module').then(mod => mod.GemotorsPrivilegeModule),
        // canActivate: [AuthGuard],
      },



      //Start - stibinu
      {
        path: 'event', loadChildren: () => import('./manage-event/manage-event.module').then(mod => mod.ManageEventModule), canActivate: [AuthGuard],
      },

      {
        path: 'event_template', loadChildren: () => import('./manage-event-template/manage-event-template.module').then(mod => mod.ManageEventTemplateModule), canActivate: [AuthGuard],
      },
      {
        path: 'event_module', loadChildren: () => import('./manage-event-table/manage-event-table.module').then(mod => mod.ManageEventTableModule), canActivate: [AuthGuard],
      },
      {
        path: 'event_module_field', loadChildren: () => import('./manage-event-table-field/manage-event-table-field.module').then(mod => mod.ManageEventTableFieldModule), canActivate: [AuthGuard],
      },

      {
        path: 'event_query', loadChildren: () => import('./manage-event-query/manage-event-query.module').then(mod => mod.ManageEventQueryModule), canActivate: [AuthGuard],
      },

      {
        path: 'event_planner', loadChildren: () => import('./manage-event-planner/manage-event-planner.module').then(mod => mod.ManageEventPlannerModule), canActivate: [AuthGuard],
      },

      //  {
      //   path: 'event-planner-filters/:eventPlannerId', loadChildren: () => import('./manage-event-planner-filter/manage-event-planner-filter.module').then(mod => mod.ManageEventPlannerFilterModule),
      // },

      {
        path: 'event-planner-filters',
        loadChildren: () => import('./manage-event-planner-filter/manage-event-planner-filter.module')
          .then(mod => mod.ManageEventPlannerFilterModule),
      },
      {
        path: 'event_customer', loadChildren: () => import('./manage-event-customer/manage-event-customer.module').then(mod => mod.ManageEventCustomerModule), canActivate: [AuthGuard],
      },

      {
        path: 'event_qrcode', loadChildren: () => import('./manage-event-qr-code/manage-event-qr-code.module').then(mod => mod.ManageEventQrCodeModule), canActivate: [AuthGuard],
      },
      {
        path: 'create_event_query', component: AddEditEventQueryFormComponent
      },
      {
        path: 'create_event_planner', component: AddEditEventPlannerFormComponent
      },
      { path: 'edit_event_planner', component: EditEventPlannerFormComponent },



      //Child Route
      {
        path: 'test-drive', loadChildren: () => import('./ge-motors/test-drive/test-drive.module').then(m => m.TestDriveModule),
        canActivate: [AuthGuard], data: { parent: 'opportunity' }
      },
      {
        path: 'advance-receipt', component: ReceiptVoucherComponent, canActivate: [AuthGuard], data: { parent: 'car-details' }
      },
      {
        path: 'purchase-agreement', loadChildren: () => import('./ge-motors/purchase-agreement-details/purchase-agreement.module').then(m => m.PurchaseAgreementModule),
        canActivate: [AuthGuard], data: { parent: 'car-details' }
      },
      {
        path: 'activity', loadChildren: () => import('./ge-motors/activity/activity.module').then(m => m.ActivityModule),
        canActivate: [AuthGuard], data: { parent: 'leads' }
      },
      {
        path: 'consignmentpdf', component: ConsignmentPdfComponent, canActivate: [AuthGuard], data: { parent: 'car-details' },
      },
      {
        path: 'sales-contract', component: SalesContractComponent, canActivate: [AuthGuard], data: { parent: 'sales-order' }
      },
      {
        path: 'create-leads', component: AddEditLeadsComponent, canActivate: [AuthGuard], data: { parent: 'leads' }
      },
      {
        path: 'create-quotation', component: AddEditQuotationComponent, canActivate: [AuthGuard], data: { parent: 'quotation' }
      },
      {
        path: 'create-salesorder', component: AddEditSalesOrderComponent, canActivate: [AuthGuard], data: { parent: 'sales-order' }
      },
      {
        path: 'create-opportunity', component: AddEditOpportunityComponent, canActivate: [AuthGuard], data: { parent: 'opportunity' }
      },
      {
        path: 'create-stage', component: AddEditStageComponent, canActivate: [AuthGuard], data: { parent: 'stage' }
      },

      {
        path: 'company', component: CompanyComponent, canActivate: [AuthGuard], data: { parent: 'stage' }
      },

      {
        path: 'technician-notification', component: TechnicianNotificationComponent, canActivate: [AuthGuard],
      },
      {
        path: 'payment-history', component: PaymentHistoryComponent,
      },
      {
        path: 'driver-tracking', component: DriverTrackingComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'application-users', component: MobileAppOnlineStatusComponent,
        canActivate: [AuthGuard],
      },







    ],
  },


  {
    path: 'Sf3b6MQmz/:id', component: SalesContractComponent,
  },
  {
    path: 'CAFxnqwg/:id', component: ConsignmentPdfComponent,
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module')
      .then(mod => mod.LoginModule)
  },

];
