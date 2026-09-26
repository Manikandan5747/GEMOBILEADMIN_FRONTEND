import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeFormComponent } from './edit-type-form.component';

describe('EditTypeFormComponent', () => {
  let component: EditTypeFormComponent;
  let fixture: ComponentFixture<EditTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
