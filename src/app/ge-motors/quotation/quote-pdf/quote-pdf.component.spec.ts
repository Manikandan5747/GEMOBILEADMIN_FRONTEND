import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePdfComponent } from './quote-pdf.component';

describe('QuotePdfComponent', () => {
  let component: QuotePdfComponent;
  let fixture: ComponentFixture<QuotePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
