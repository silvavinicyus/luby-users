import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";


export const handler: APIGatewayProxyHandler = async (event) => {
  const id  = event.pathParameters.id;  

  const user = await document.query({
    TableName: "users",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();  
  
  if(user.Items.length <= 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "There is no user with the given id"
      })
    }
  }    
  
  return {
    statusCode: 200,
    body: JSON.stringify(user.Items[0])
  }
}