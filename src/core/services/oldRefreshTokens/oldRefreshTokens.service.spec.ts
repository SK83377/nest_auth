import { Test, TestingModule } from '@nestjs/testing';
import { OldRefreshTokensService } from './oldRefreshTokens.service';

describe('OldRefreshTokensService', () => {
  let service: OldRefreshTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OldRefreshTokensService],
    }).compile();

    service = module.get<OldRefreshTokensService>(OldRefreshTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
