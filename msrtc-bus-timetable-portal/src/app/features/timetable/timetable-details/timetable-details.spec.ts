import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDetails } from './timetable-details';

describe('TimetableDetails', () => {
  let component: TimetableDetails;
  let fixture: ComponentFixture<TimetableDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
