import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAddressComponent } from './mobile-address.component';

describe('MobileAddressComponent', () => {
  let component: MobileAddressComponent;
  let fixture: ComponentFixture<MobileAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
