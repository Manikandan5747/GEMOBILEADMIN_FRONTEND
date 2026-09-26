import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditShowroomCategoryFormComponent } from './add-edit-showroom-category-form.component';

describe('AddEditShowroomCategoryFormComponent', () => {
  let component: AddEditShowroomCategoryFormComponent;
  let fixture: ComponentFixture<AddEditShowroomCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditShowroomCategoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditShowroomCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
