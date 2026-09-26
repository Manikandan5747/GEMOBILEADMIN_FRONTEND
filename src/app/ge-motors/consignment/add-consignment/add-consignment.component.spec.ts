import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsignmentComponent } from './add-consignment.component';

describe('AddConsignmentComponent', () => {
  let component: AddConsignmentComponent;
  let fixture: ComponentFixture<AddConsignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConsignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
