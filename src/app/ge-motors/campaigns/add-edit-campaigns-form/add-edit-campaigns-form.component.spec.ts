import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCampaignsFormComponent } from './add-edit-campaigns-form.component';

describe('AddEditCampaignsFormComponent', () => {
  let component: AddEditCampaignsFormComponent;
  let fixture: ComponentFixture<AddEditCampaignsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCampaignsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCampaignsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
