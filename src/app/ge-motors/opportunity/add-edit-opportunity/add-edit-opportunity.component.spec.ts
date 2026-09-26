import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOpportunityComponent } from './add-edit-opportunity.component';

describe('AddEditOpportunityComponent', () => {
  let component: AddEditOpportunityComponent;
  let fixture: ComponentFixture<AddEditOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditOpportunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
