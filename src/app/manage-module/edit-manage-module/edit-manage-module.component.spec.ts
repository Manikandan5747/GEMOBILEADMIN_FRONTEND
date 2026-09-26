import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageModuleComponent } from './edit-manage-module.component';

describe('EditManageModuleComponent', () => {
  let component: EditManageModuleComponent;
  let fixture: ComponentFixture<EditManageModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditManageModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManageModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
