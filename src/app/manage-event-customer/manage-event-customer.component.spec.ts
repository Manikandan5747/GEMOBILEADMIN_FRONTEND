import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventCustomerComponent } from './manage-event-customer.component';

describe('ManageEventCustomerComponent', () => {
  let component: ManageEventCustomerComponent;
  let fixture: ComponentFixture<ManageEventCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
