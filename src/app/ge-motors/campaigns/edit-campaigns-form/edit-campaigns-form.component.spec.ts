import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCampaignsFormComponent } from './edit-campaigns-form.component';

describe('EditCampaignsFormComponent', () => {
  let component: EditCampaignsFormComponent;
  let fixture: ComponentFixture<EditCampaignsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCampaignsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCampaignsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
