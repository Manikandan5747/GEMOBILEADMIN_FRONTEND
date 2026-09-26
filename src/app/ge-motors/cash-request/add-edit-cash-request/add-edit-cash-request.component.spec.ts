import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCashRequestComponent } from './add-edit-cash-request.component';

describe('AddEditCashRequestComponent', () => {
  let component: AddEditCashRequestComponent;
  let fixture: ComponentFixture<AddEditCashRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCashRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCashRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
