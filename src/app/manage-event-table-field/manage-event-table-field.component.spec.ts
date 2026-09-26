import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventTableFieldComponent } from './manage-event-table-field.component';

describe('ManageEventTableFieldComponent', () => {
  let component: ManageEventTableFieldComponent;
  let fixture: ComponentFixture<ManageEventTableFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventTableFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventTableFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
