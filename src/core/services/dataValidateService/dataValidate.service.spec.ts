import { Test, TestingModule } from '@nestjs/testing';
import { DataValidateService } from './dataValidate.service';

describe('DataValidateService', () => {
  let service: DataValidateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataValidateService],
    }).compile();

    service = module.get<DataValidateService>(DataValidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
