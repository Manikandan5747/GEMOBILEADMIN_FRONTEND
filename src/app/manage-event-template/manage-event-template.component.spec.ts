import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventTemplateComponent } from './manage-event-template.component';

describe('ManageEventTemplateComponent', () => {
  let component: ManageEventTemplateComponent;
  let fixture: ComponentFixture<ManageEventTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
