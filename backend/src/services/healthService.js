import { testConnection } from '../config/db.js';

export async function checkHealth() {
  const dbHealth = await testConnection();

  return {
    status: dbHealth.connected ? 'ok' : 'degraded',
    service: 'rplearn-backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    database: {
      type: 'PostgreSQL',
      status: dbHealth.connected ? 'connected' : 'disconnected',
      latencyMs: dbHealth.latencyMs,
      ...(dbHealth.connected
        ? {
            name: dbHealth.database,
            user: dbHealth.user,
            version: dbHealth.version,
            serverTime: dbHealth.serverTime,
          }
        : {
            error: dbHealth.error,
          }),
    },
  };
}
