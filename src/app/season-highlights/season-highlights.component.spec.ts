import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonHighlightsComponent } from './season-highlights.component';

describe('SeasonHighlightsComponent', () => {
  let component: SeasonHighlightsComponent;
  let fixture: ComponentFixture<SeasonHighlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonHighlightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
