import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedModulePrivilegeComponent } from './related-module-privilege.component';

describe('RelatedModulePrivilegeComponent', () => {
  let component: RelatedModulePrivilegeComponent;
  let fixture: ComponentFixture<RelatedModulePrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedModulePrivilegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedModulePrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
