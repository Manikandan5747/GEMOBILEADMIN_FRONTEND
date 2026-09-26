import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShowroomCategoryComponent } from './add-showroom-category.component';

describe('AddShowroomCategoryComponent', () => {
  let component: AddShowroomCategoryComponent;
  let fixture: ComponentFixture<AddShowroomCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShowroomCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShowroomCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
