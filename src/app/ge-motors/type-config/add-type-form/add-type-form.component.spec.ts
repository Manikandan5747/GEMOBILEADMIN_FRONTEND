import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeFormComponent } from './add-type-form.component';

describe('AddTypeFormComponent', () => {
  let component: AddTypeFormComponent;
  let fixture: ComponentFixture<AddTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
