import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarownerTypeComponent } from './edit-carowner-type.component';

describe('EditCarownerTypeComponent', () => {
  let component: EditCarownerTypeComponent;
  let fixture: ComponentFixture<EditCarownerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCarownerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarownerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
