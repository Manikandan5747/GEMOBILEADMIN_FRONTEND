import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRequestComponent } from './cash-request.component';

describe('CashRequestComponent', () => {
  let component: CashRequestComponent;
  let fixture: ComponentFixture<CashRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
