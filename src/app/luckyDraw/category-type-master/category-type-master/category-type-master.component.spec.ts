import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTypeMasterComponent } from './category-type-master.component';

describe('CategoryTypeMasterComponent', () => {
  let component: CategoryTypeMasterComponent;
  let fixture: ComponentFixture<CategoryTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
