import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInspectionReportComponent } from './request-inspection-report.component';

describe('RequestInspectionReportComponent', () => {
  let component: RequestInspectionReportComponent;
  let fixture: ComponentFixture<RequestInspectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestInspectionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInspectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
