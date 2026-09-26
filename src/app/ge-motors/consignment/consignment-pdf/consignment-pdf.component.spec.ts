import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentPdfComponent } from './consignment-pdf.component';

describe('ConsignmentPdfComponent', () => {
  let component: ConsignmentPdfComponent;
  let fixture: ComponentFixture<ConsignmentPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
