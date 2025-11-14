import { customAlphabet } from 'nanoid';
import { prisma } from '@repo/database';

const nanoidLowercase = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 4);

export async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = baseSlug;
  let attempt = 0;
  const maxAttempts = 10;

  while (attempt < maxAttempts) {
    const existing = await prisma.campaign.findUnique({
      where: { slug }
    });

    if (!existing) {
      return slug;
    }

    const suffix = nanoidLowercase();
    slug = `${baseSlug}-${suffix}`;
    attempt++;
  }

  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}
