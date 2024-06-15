import express from 'express';
import { listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData} from '../controllers/transactionController.js';

const router = express.Router();


router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar_chart', getBarChartData);
router.get('/pie_chart', getPieChartData);
router.get('/combined_data', getCombinedData);

export default router;