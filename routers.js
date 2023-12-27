import Router from 'express';
import multer from 'multer';

import {
    uploadStatisticFile,
    getStatisticByYear,
    getStatisticByRegion,
    getStatisticByYearId,
    downloadTemplateFile,
    getYearListFromFile
} from './handlers/statistic-file.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get data
router.get('/byYear', getStatisticByYear);

router.get('/byYear/:yearId', getStatisticByYearId);

router.get('/byRegion', getStatisticByRegion);

router.get('/year-list', getYearListFromFile)

//Get template file
router.get('/download-template', downloadTemplateFile)

// Save file
router.post(
    '/upload',
    upload.single('file'),
    uploadStatisticFile
);

export default router;
