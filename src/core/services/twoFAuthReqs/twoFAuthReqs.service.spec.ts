import { Test, TestingModule } from '@nestjs/testing';
import { TwoFAuthReqsService } from './twoFAuthReqs.service';

describe('TwoFauthReqsService', () => {
  let service: TwoFAuthReqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFAuthReqsService],
    }).compile();

    service = module.get<TwoFAuthReqsService>(TwoFAuthReqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
