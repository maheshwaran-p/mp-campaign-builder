import { Test, TestingModule } from '@nestjs/testing';
import { CreativeService } from './creative.service';

describe('CreativeService', () => {
  let service: CreativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreativeService],
    }).compile();

    service = module.get<CreativeService>(CreativeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
