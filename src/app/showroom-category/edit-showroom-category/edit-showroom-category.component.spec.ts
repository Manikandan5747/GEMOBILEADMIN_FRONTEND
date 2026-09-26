import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShowroomCategoryComponent } from './edit-showroom-category.component';

describe('EditShowroomCategoryComponent', () => {
  let component: EditShowroomCategoryComponent;
  let fixture: ComponentFixture<EditShowroomCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShowroomCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShowroomCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
