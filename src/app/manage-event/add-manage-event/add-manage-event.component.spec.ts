import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManageEventComponent } from './add-manage-event.component';

describe('AddManageEventComponent', () => {
  let component: AddManageEventComponent;
  let fixture: ComponentFixture<AddManageEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManageEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManageEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
