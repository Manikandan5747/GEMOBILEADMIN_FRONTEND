import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderPdfComponent } from './salesorder-pdf.component';

describe('SalesorderPdfComponent', () => {
  let component: SalesorderPdfComponent;
  let fixture: ComponentFixture<SalesorderPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesorderPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesorderPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
