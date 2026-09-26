import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManageModuleComponent } from './add-manage-module.component';

describe('AddManageModuleComponent', () => {
  let component: AddManageModuleComponent;
  let fixture: ComponentFixture<AddManageModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManageModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManageModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
