import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { PocLambdaTsExpressLambda } from "./constructs/lambda";
import { ApiKeySourceType, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PREFIX } from "./configs";

export class PocLambdaTsExpressStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "api", {
      restApiName: "PocLambdaTsExpress",
      apiKeySourceType: ApiKeySourceType.HEADER,
      description: "PocLambdaTsExpress / Description",
      deployOptions: {
        stageName: "dev"
      },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"]
      }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////  PRODUCTS  //////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const pocLambdaTsExpress = new PocLambdaTsExpressLambda(this, "poc", `poc`, `app.ts`, {});

    api.root.resourceForPath("/").addProxy({
      defaultIntegration: new LambdaIntegration(pocLambdaTsExpress.lambda, { proxy: true }),
      anyMethod: true
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////  API KEY  ///////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const apiPlan = api.addUsagePlan(`${PREFIX}-api-usage-plan`, {
      name: "Basic Usage Plan",
      throttle: {
        rateLimit: 10,
        burstLimit: 2
      },
      apiStages: [
        {
          api,
          stage: api.deploymentStage
        }
      ]
    });

    const key = api.addApiKey(`${PREFIX}-api-key`, {
      apiKeyName: `${PREFIX}-api-key`
    });
    apiPlan.addApiKey(key);

    new CfnOutput(this, `apiKeyId`, {
      value: key.keyId,
      exportName: "apiKeyId"
    });

    new CfnOutput(this, `restApiId`, {
      value: api.restApiId,
      exportName: "restApiId"
    });
  }
}
