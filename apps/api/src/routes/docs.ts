import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../swagger/registry";

const router = Router();

const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none; }",
  customSiteTitle: "Affiliate Platform API",
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
    showRequestHeaders: true,
  },
};

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(openApiSpec, swaggerOptions));

router.get("/json", (_req, res) => {
  res.json(openApiSpec);
});

export default router;
