import { APIGatewayProxyHandler } from "aws-lambda"

import {document} from '../utils/dynamodbClient';

interface ICreateUser {
  id: string;
  name: string;
  email: string;
  birthday: string;
}

export const handler: APIGatewayProxyHandler = async ( event ) => {
  const { id, name, email, birthday } = JSON.parse(event.body) as ICreateUser;

  await document.put({
    TableName: "users",
    Item: {
      id,
      name,
      email, 
      birthday,
      created_at: new Date().getTime()
    }
  }).promise()

  const user = await document.query({
    TableName: "users",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(user.Items[0])
  }
}