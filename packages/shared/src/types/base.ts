import type {
  Product as DbProduct,
  Offer as DbOffer,
  Campaign as DbCampaign,
  Link as DbLink,
  Click as DbClick,
  CampaignProduct as DbCampaignProduct,
} from '@repo/database';

export { Marketplace, CampaignStatus } from '@repo/database';

type SerializeDate<T> = T extends Date
  ? string
  : T extends Date | null
  ? string | null
  : T;

type ApiSafeType<T> = {
  [K in keyof T]: SerializeDate<T[K]>;
};

export type Product = ApiSafeType<DbProduct>;
export type Offer = ApiSafeType<DbOffer>;
export type Campaign = ApiSafeType<DbCampaign>;
export type Link = ApiSafeType<DbLink>;
export type Click = ApiSafeType<DbClick>;
export type CampaignProduct = ApiSafeType<DbCampaignProduct>;
