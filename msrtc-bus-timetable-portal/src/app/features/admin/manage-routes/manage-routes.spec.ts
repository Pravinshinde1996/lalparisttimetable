import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoutes } from './manage-routes';

describe('ManageRoutes', () => {
  let component: ManageRoutes;
  let fixture: ComponentFixture<ManageRoutes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoutes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRoutes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
