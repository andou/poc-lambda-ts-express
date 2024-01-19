/* eslint-disable @typescript-eslint/no-unused-vars */
import express = require("express");
import serverless = require("serverless-http");
import routes from "./routes";
import middy from "@middy/core";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { logger, metrics, tracer } from "../../common/powertools";

const app = express();

app.use(express.json());

app.use("/", routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send();
});

export const handler = middy(serverless(app))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(captureLambdaHandler(tracer, { captureResponse: false }))
  .use(logMetrics(metrics, { throwOnEmptyMetrics: false, captureColdStartMetric: true }));
