import { TestBed } from '@angular/core/testing';

import { MatSelectMultiColumnsService } from './mat-select-multi-columns.service';

describe('MatSelectMultiColumnsService', () => {
  let service: MatSelectMultiColumnsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatSelectMultiColumnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
