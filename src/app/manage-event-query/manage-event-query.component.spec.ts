import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventQueryComponent } from './manage-event-query.component';

describe('ManageEventQueryComponent', () => {
  let component: ManageEventQueryComponent;
  let fixture: ComponentFixture<ManageEventQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEventQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEventQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
