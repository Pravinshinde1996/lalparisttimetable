import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableList } from './timetable-list';

describe('TimetableList', () => {
  let component: TimetableList;
  let fixture: ComponentFixture<TimetableList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
