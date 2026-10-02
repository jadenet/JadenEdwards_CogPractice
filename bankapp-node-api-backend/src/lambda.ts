import serverlessExpress from '@codegenie/serverless-express';
import app from './app';

// The adapter intercepts API Gateway payloads and simulates standard Express requests
export const handler = serverlessExpress({ app });