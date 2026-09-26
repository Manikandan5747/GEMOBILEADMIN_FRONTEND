import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSettingFormComponent } from './add-edit-setting-form.component';

describe('AddEditSettingFormComponent', () => {
  let component: AddEditSettingFormComponent;
  let fixture: ComponentFixture<AddEditSettingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSettingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
