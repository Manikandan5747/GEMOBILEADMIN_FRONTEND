import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInspectionReportRedirComponent } from './request-inspection-report-redir.component';

describe('RequestInspectionReportRedirComponent', () => {
  let component: RequestInspectionReportRedirComponent;
  let fixture: ComponentFixture<RequestInspectionReportRedirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestInspectionReportRedirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInspectionReportRedirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
