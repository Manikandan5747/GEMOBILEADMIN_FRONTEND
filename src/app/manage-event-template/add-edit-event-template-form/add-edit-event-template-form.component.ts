import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from 'src/app/service/event/event.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-edit-event-template-form',
  templateUrl: './add-edit-event-template-form.component.html',
  styleUrls: ['./add-edit-event-template-form.component.css'],
})
export class AddEditEventTemplateFormComponent implements OnInit {

  @Input('action') action!: any;
  @Input('isShowErrors') isShowErrors!: boolean;
   
  @Input() modeOfMessage: string = '';
  showWhatsAppTemplateField = true;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.

  @Input('template_id') template_id!: any;
  // @Input('company_id') company_id: any;

  hasShownGuide = false;
  hasShownTemplateNameGuide = false;
  canTypeTemplateName = false; 

  public addEditForm!: FormGroup;
  EventList: any;
  EventCompanyList: any[] = [];
  formReady: any;
 

  constructor(private fb: FormBuilder, private EventService: EventService, private snackBar: MatSnackBar ,@Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  get f() {
    return this.addEditForm.controls;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.template_id) {
        this.addEditForm.patchValue({ template_id: this.template_id });
      }
    });
  }

  async ngOnInit() {
    this.addEditForm = this.fb.group({
      template_name: ['', Validators.required],
      sleekflow_template_name:[''],
      template_text: ['', [Validators.required,  Validators.maxLength(1000),this.validateTemplatePlaceholders]],
      status: ["1"]
    });

    
   if (this.modeOfMessage === 'push') {
    this.showWhatsAppTemplateField = false;
  } else {
    this.showWhatsAppTemplateField = true;
  }

    // this.loadEventsCompany();

    this.EventService.getActiveTemplate().subscribe((data: any) => {
      this.EventList = data;
      if (this.template_id) {
        this.addEditForm.patchValue({ template_id: this.template_id });
      }
    });
  }
validateTemplatePlaceholders(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const hasName = value.includes('@CustomerName');
  const hasCompany = value.includes('@Company');

  if (!hasName && !hasCompany) {
    return { missingBoth: true };
  } else if (!hasName) {
    return { missingName: true };
  } else if (!hasCompany) {
    return { missingCompany: true };
  }

  return null; 
}

onFocusTemplateName() {
  if (!this.hasShownTemplateNameGuide) {
    this.hasShownTemplateNameGuide = true;
    this.canTypeTemplateName = false; 

    this.snackBar.openFromComponent(TemplateNameSnackbarInline, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'template-guide-class',
      data: { onClose: () => this.enableTemplateNameTyping() }
    });
  }
}

enableTemplateNameTyping() {
  this.canTypeTemplateName = true;
}

  showTemplateNameInfo() {
    this.snackBar.openFromComponent(TemplateNameSnackbarInline, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'template-guide-class',
      duration: 15000
    });
  }

   showsleekflowTemplateNameInfo() {
    this.snackBar.openFromComponent(SleekflowTemplateName, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'template-guide-class',
      duration: 15000
    });
  }

  showTemplateGuide() {
    this.snackBar.openFromComponent(TemplateGuideSnackbarInline, {
      duration: 15000,               
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'template-guide-class' 
    });
  }

   showsleekflowTemplateGuide() {
    this.snackBar.openFromComponent(SleekflowTemplateName, {
      duration: 15000,               
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'template-guide-class' 
    });
  }

  onFocusMessage() {
    if (!this.hasShownGuide) {
      this.hasShownGuide = true;
      this.showTemplateGuide();
    }
  }

  onFocussleekflowTemplateName() {
    if (!this.hasShownGuide) {
      this.hasShownGuide = true;
      this.showsleekflowTemplateGuide();
    }
  }

  // loadEventsCompany() {
  //   this.EventService.getEventsCompany().subscribe((res: any) => {
  //     this.EventCompanyList = res;
  //     if (this.company_id) {
  //       this.addEditForm.patchValue({ company_id: this.company_id });
  //     }
  //   });
  // }
}

@Component({
  selector: 'template-name-snackbar-inline',
  template: `
    <div class="template-guide-snack" style="position: relative; padding: 16px; max-width: 400px;">
      
      <button mat-icon-button 
        (click)="close()"
        style="position: absolute;top: 5px;
          right: 8px;
          background-color: black;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;">
  <mat-icon>close</mat-icon>
</button>
      
      <h4>This Field is used for Notification Title</h4>
      
       <!-- <div style="margin-top: 16px; text-align: right;">
         <button mat-raised-button color="warn" (click)="close()" style="
          background-color: #FA5738; 
          color: #fff; 
        ">
          Close
        </button> 
      </div> -->
    </div>
  `
})



export class TemplateNameSnackbarInline {
  constructor(
    private snackBarRef: MatSnackBarRef<TemplateNameSnackbarInline>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { onClose: () => void }
  ) {}

  close() {
    this.snackBarRef.dismiss();
    if (this.data?.onClose) {
      this.data.onClose();
    }
  }
}
@Component({
  selector: 'SleekflowTemplateName',
  template: `
    <div class="template-guide-snack" style="position: relative; padding: 16px; max-width: 400px;">
      
      <button mat-icon-button 
        (click)="close()"
        style="position: absolute;top: 5px;
          right: 8px;
          background-color: black;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;">
  <mat-icon>close</mat-icon>
</button>
      
      <h4>This Field is Sleekflow Template Name</h4>
      
       <!-- <div style="margin-top: 16px; text-align: right;">
         <button mat-raised-button color="warn" (click)="close()" style="
          background-color: #FA5738; 
          color: #fff; 
        ">
          Close
        </button> 
      </div> -->
    </div>
  `
})



export class SleekflowTemplateName {
  constructor(
    private snackBarRef: MatSnackBarRef<SleekflowTemplateName>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { onClose: () => void }
  ) {}

  close() {
    this.snackBarRef.dismiss();
    if (this.data?.onClose) {
      this.data.onClose();
    }
  }
}


@Component({
  selector: 'template-guide-snackbar-inline',
  template: `
    <div class="template-guide-snack">
      <div style="display:flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h4>📋 How to Create Event Message Template?</h4>
          <ul>
            <li><strong>@CustomerName</strong> – Customer name</li>
            <li><strong>@Nationality</strong> – Country (Optional)</li>
            <li><strong>@Company</strong> – Company name</li>
          </ul>
          <p>
            <strong>Example:</strong><br>
            🎉  Happy National Day, @CustomerName! Celebrate this Special Day With Us and Enjoy a 400 AED Gift Voucher from @Company. 🎁
          </p>
          <small>💡 Placeholders automatically insert real values when sending notification message.</small>
          <!-- <div style="margin-top: 12px; text-align: right;">
            <button mat-raised-button color="primary" (click)="snackBar.dismiss()">Close</button>
          </div> -->
        </div>
        <button mat-icon-button (click)="snackBar.dismiss()"  style="position: absolute;top: 5px;
          right: 8px;
          background-color: black;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;" aria-label="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `
})
export class TemplateGuideSnackbarInline {
  constructor(public snackBar: MatSnackBar) {}
}
