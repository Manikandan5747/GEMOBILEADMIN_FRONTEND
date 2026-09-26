import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLeadsComponent } from './add-edit-leads.component';

describe('AddEditLeadsComponent', () => {
  let component: AddEditLeadsComponent;
  let fixture: ComponentFixture<AddEditLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
