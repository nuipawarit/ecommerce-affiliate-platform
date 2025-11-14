import { describe, it, expect, beforeEach } from 'bun:test';
import { CampaignService } from '../campaign.service';

describe('CampaignService', () => {
  let service: CampaignService;

  beforeEach(() => {
    service = new CampaignService();
  });

  it('should create an instance of CampaignService', () => {
    expect(service).toBeInstanceOf(CampaignService);
  });
});
