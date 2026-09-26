import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTypeFormComponent } from './add-edit-type-form.component';

describe('AddEditTypeFormComponent', () => {
  let component: AddEditTypeFormComponent;
  let fixture: ComponentFixture<AddEditTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
