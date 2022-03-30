import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async ( event ) => {
    const id = event.pathParameters.id;

    await document.delete({
      TableName: "users",
      Key: {
        "id": id
      }
    }).promise();

    return{
      statusCode: 204,
      body: JSON.stringify({})
    }
}