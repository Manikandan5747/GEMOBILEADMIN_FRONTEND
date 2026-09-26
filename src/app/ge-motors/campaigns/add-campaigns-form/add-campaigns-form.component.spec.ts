import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCampaignsFormComponent } from './add-campaigns-form.component';

describe('AddCampaignsFormComponent', () => {
  let component: AddCampaignsFormComponent;
  let fixture: ComponentFixture<AddCampaignsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCampaignsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCampaignsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
