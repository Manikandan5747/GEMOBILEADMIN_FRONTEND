import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCityFormComponent } from './add-edit-city-form.component';

describe('AddEditCityFormComponent', () => {
  let component: AddEditCityFormComponent;
  let fixture: ComponentFixture<AddEditCityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCityFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
