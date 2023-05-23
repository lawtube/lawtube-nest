import { Test, TestingModule } from '@nestjs/testing';
import { WSGateway } from './websocket.gateway';

describe('WSGateway', () => {
  let gateway: WSGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WSGateway],
    }).compile();

    gateway = module.get<WSGateway>(WSGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
