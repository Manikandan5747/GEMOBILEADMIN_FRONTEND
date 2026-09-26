import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventTableComponent } from './manage-event-table.component';

describe('ManageEventTableComponent', () => {
  let component: ManageEventTableComponent;
  let fixture: ComponentFixture<ManageEventTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
