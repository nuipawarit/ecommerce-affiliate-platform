import { Router } from 'express';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../middleware/async-handler';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import { createProductSchema, searchProductSchema, productIdSchema } from '../validations/product.validation';
import { successResponse } from '../utils/response';
import { z } from 'zod';

const router = Router();
const productService = new ProductService();

const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined)
});

router.post(
  '/search',
  validateBody(searchProductSchema),
  asyncHandler(async (req, res) => {
    const { url, sku } = req.body;
    const results = await productService.searchProducts({ url, sku });

    res.json(successResponse(results));
  })
);

router.post(
  '/',
  requireAuth,
  validateBody(createProductSchema),
  asyncHandler(async (req, res) => {
    const { url, sku, marketplace } = req.body;
    const product = await productService.create({ url, sku, marketplace });

    res.status(201).json(successResponse(product));
  })
);

router.get(
  '/',
  validateQuery(paginationSchema),
  asyncHandler(async (req, res) => {
    const { page, limit } = req.query as { page?: number; limit?: number };
    const result = await productService.getAllProducts({ page, limit });

    res.json(successResponse(result));
  })
);

router.get(
  '/:id',
  validateParams(productIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id!);

    res.json(successResponse(product));
  })
);

router.get(
  '/:id/offers',
  validateParams(productIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await productService.getProductOffers(id!);

    res.json(successResponse(result));
  })
);

router.put(
  '/:id/refresh',
  requireAuth,
  validateParams(productIdSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await productService.refreshProduct(id!);

    res.json(successResponse(product));
  })
);

const addOfferSchema = z.object({
  url: z.string().url(),
  marketplace: z.enum(['lazada', 'shopee'])
});

router.post(
  '/:id/offers',
  requireAuth,
  validateParams(productIdSchema),
  validateBody(addOfferSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { url, marketplace } = req.body;
    const product = await productService.addOfferToProduct(id!, { url, marketplace });

    res.json(successResponse(product));
  })
);

const checkSimilarSchema = z.object({
  title: z.string().min(1),
  threshold: z.number().min(0).max(1).optional()
});

router.post(
  '/check-similar',
  validateBody(checkSimilarSchema),
  asyncHandler(async (req, res) => {
    const { title, threshold } = req.body;
    const similarProducts = await productService.findSimilarProducts(title, threshold);

    res.json(successResponse(similarProducts));
  })
);

export default router;
