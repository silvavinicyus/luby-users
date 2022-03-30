import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters.id;

  const { name } = JSON.parse(event.body);    

  await document.update({
    TableName: "users",
    Key: {
      "id": id
    },
    UpdateExpression: "set #name = :name",
    ExpressionAttributeValues: {      
      ":name": name
    },
    ExpressionAttributeNames: {
      "#name": "name"
    }
  }).promise();

  const user = await document.query({
    TableName: "users",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(user.Items[0])
  }
}