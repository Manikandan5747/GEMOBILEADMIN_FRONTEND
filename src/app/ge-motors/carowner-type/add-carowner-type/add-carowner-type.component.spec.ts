import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarownerTypeComponent } from './add-carowner-type.component';

describe('AddCarownerTypeComponent', () => {
  let component: AddCarownerTypeComponent;
  let fixture: ComponentFixture<AddCarownerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarownerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarownerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
