import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertQuoteComponent } from './convert-quote.component';

describe('ConvertQuoteComponent', () => {
  let component: ConvertQuoteComponent;
  let fixture: ComponentFixture<ConvertQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
