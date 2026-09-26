import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomCategoryComponent } from './showroom-category.component';

describe('ShowroomCategoryComponent', () => {
  let component: ShowroomCategoryComponent;
  let fixture: ComponentFixture<ShowroomCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowroomCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
