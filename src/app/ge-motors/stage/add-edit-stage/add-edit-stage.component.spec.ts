import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditStageComponent } from './add-edit-stage.component';

describe('AddEditStageComponent', () => {
  let component: AddEditStageComponent;
  let fixture: ComponentFixture<AddEditStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditStageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
