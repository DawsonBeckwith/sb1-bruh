import { CORS_CONFIG } from './config';

const corsHeaders = {
  'Access-Control-Allow-Origin': CORS_CONFIG.ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': CORS_CONFIG.ALLOWED_HEADERS.join(', ')
};

export const createResponse = (statusCode: number, body?: any) => ({
  statusCode,
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json'
  },
  body: body ? JSON.stringify(body) : undefined
});

export const successResponse = (data: any) => createResponse(200, data);
export const errorResponse = (error: Error | string) => createResponse(400, {
  error: error instanceof Error ? error.message : error
});
export const corsResponse = () => createResponse(204);