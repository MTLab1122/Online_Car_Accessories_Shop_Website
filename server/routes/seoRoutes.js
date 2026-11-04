import express from 'express';
import { getRobotsTxt, getSitemapXml, getLlmsTxt } from '../controllers/seoController.js';

const router = express.Router();

router.get('/robots.txt', getRobotsTxt);
router.get('/sitemap.xml', getSitemapXml);
router.get('/llms.txt', getLlmsTxt);

export default router;
