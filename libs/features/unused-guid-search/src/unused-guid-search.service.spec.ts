import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { UnusedGuidService } from './unused-guid-search.service';
import { MysqlQueryService } from '@keira/shared/db-layer';

describe('UnusedGuidSearchService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: MysqlQueryService, useValue: instance(mock(MysqlQueryService)) }],
    }),
  );

  it('should be defined', () => {
    const service: UnusedGuidService = TestBed.inject(UnusedGuidService);
    expect(service).toBeDefined();
  });
});
