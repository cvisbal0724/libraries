import { TestBed } from '@angular/core/testing';

import { MatSelectSearchService } from './mat-select-search.service';

describe('MatSelectSearchService', () => {
  let service: MatSelectSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatSelectSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
