import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSelectMultiColumnsComponent } from './mat-select-multi-columns.component';

describe('MatSelectMultiColumnsComponent', () => {
  let component: MatSelectMultiColumnsComponent;
  let fixture: ComponentFixture<MatSelectMultiColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatSelectMultiColumnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSelectMultiColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
