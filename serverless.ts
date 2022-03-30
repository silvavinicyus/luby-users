import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'luby-users',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"]
      }
    ]
  },
  // import the function via paths
  functions: { 
    createUser: {
      handler: "src/functions/createUser.handler",
      events: [
        {
          http: {
            path: "createuser",
            method: "post",

            cors: true
          }
        }
      ]
    },
    showUser: {
      handler: "src/functions/showUser.handler",
      events:[
        {
          http: {
            path: "showuser/{id}",
            method: "get",

            cors: true
          }
        }
      ]
    },
    indexUser: {
      handler: "src/functions/indexUser.handler",
      events: [
        {
          http: {
            path: "indexuser",
            method: "get",

            cors: true
          }
        }
      ]
    },
    updateUser: {
      handler: "src/functions/updateUser.handler",
      events:[
        {
          http: {
            path: "updateuser/{id}",
            method: "put",

            cors: true
          }
        }
      ]
    },
    deleteUser: {
      handler: "src/functions/deleteUser.handler",
      events:[
        {
          http: {
            path: "deleteuser/{id}",
            method: "delete",

            cors: true
          }
        }
      ]
    } 
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      dbUsers: {
        Type: "AWS::DynamoDB::Table",        
        Properties: {
          TableName: "users",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ]
        },        
      }
    }
  }
};

module.exports = serverlessConfiguration;
