import { Test, TestingModule } from '@nestjs/testing';
import { LogInAttemptsService } from './logInAttempts.service';

describe('LogInAttemptsService', () => {
  let service: LogInAttemptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogInAttemptsService],
    }).compile();

    service = module.get<LogInAttemptsService>(LogInAttemptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
