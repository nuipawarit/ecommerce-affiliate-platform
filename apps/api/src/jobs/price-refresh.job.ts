import cron from "node-cron";
import { prisma } from "@repo/database";
import { ProductService } from "../services/product.service";
import { updateJobStatus } from "../utils/job-status";

const productService = new ProductService();

export function startPriceRefreshJob() {
  cron.schedule("0 */6 * * *", async () => {
    console.log(
      `[PriceRefreshJob] Starting price refresh at ${new Date().toISOString()}`
    );

    const startTime = Date.now();
    let processed = 0;
    let updated = 0;
    let errors = 0;

    try {
      const products = await prisma.product.findMany({
        include: {
          offers: {
            where: {
              isActive: true,
            },
          },
        },
      });

      console.log(
        `[PriceRefreshJob] Found ${products.length} products to process`
      );

      for (const product of products) {
        try {
          const result = await productService.refreshProduct(product.id);

          processed++;

          if (result?.offers && result.offers.length > 0) {
            updated += result.offers.length;
          }

          console.log(
            `[PriceRefreshJob] Refreshed product ${product.id}: ${result?.offers?.length || 0} offers updated`
          );
        } catch (error) {
          errors++;
          console.error(
            `[PriceRefreshJob] Failed to refresh product ${product.id}:`,
            error instanceof Error ? error.message : error
          );
        }
      }

      const duration = Date.now() - startTime;

      console.log(
        `[PriceRefreshJob] Completed in ${duration}ms - Processed: ${processed}, Updated: ${updated}, Errors: ${errors}`
      );

      await updateJobStatus(duration, processed, updated, errors);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[PriceRefreshJob] Critical error during job execution:`,
        error
      );

      await updateJobStatus(duration, processed, updated, errors + 1);
    }
  });

  console.log("[PriceRefreshJob] Scheduled to run every 6 hours (0 */6 * * *)");
}
