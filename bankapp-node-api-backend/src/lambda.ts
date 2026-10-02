import serverlessExpress from '@codegenie/serverless-express';
import app from './app';

// The adapter intercepts API Gateway payloads and simulates standard Express requests
const expressHandler = serverlessExpress({ app });

export const handler = async (
	event: Parameters<typeof expressHandler>[0],
	context: Parameters<typeof expressHandler>[1],
) => expressHandler(event, context);