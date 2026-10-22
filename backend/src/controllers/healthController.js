import { checkHealth } from '../services/healthService.js';

export async function getHealth(req, res, next) {
  try {
    const health = await checkHealth();
    const httpStatus = health.status === 'ok' ? 200 : 503;
    res.status(httpStatus).json(health);
  } catch (err) {
    next(err);
  }
}
