import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { NightscoutService } from '../src/nightscout/nightscout.service';
import { NightscoutModule } from '../src/nightscout/nightscout.module';

describe('NightscoutApi (e2e)', () => {
  let service: NightscoutService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), NightscoutModule],
    }).compile();

    service = moduleFixture.get<NightscoutService>(NightscoutService);
  });

  it('should connect to Nightscout and return a valid status', async () => {
    const status = await service.getStatus();

    expect(status).toBeDefined();
    expect(status.status).toBe('ok');
    expect(status.apiEnabled).toBe(true);
  });

  it('should fetch at least one recent entry', async () => {
    const entries = await service.getEntries({ count: 1 });

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].sgv).toBeDefined();
  });
});
