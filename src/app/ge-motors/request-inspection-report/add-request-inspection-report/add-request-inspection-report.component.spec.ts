import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestInspectionReportComponent } from './add-request-inspection-report.component';

describe('AddRequestInspectionReportComponent', () => {
  let component: AddRequestInspectionReportComponent;
  let fixture: ComponentFixture<AddRequestInspectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestInspectionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestInspectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
