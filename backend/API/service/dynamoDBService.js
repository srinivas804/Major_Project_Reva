const AWS = require("aws-sdk");

AWS.config = new AWS.Config();
// AWS.config.accessKeyId = process.env.ACCESS_KRY_ID;
// AWS.config.secretAccessKey = "secretKey";
// AWS.config.region = "us-east-1";

AWS.config.update({
  accessKeyId: 'AKIA4O2LQZTCPTD64KZX',
  secretAccessKey: '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',
  region: 'ap-south-1',
});
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

const queryItems = async (params) => {
  try {
    return documentClient.query(params).promise();
  } catch (error) {
    console.log("ERROR IN QUERY ITEMS FUNC : ", error.message);
  }
  return null;
};

const getItem = async (params) => {
  try {
    return (await documentClient.get(params).promise())?.Item;
  } catch (error) {
    console.log("ERROR IN GET ITEM FUNC : ", error.message);
  }
  return null;
};

const putItem = async (params) => {
  try {
    return await documentClient.put(params).promise();
  } catch (error) {
    console.log("ERROR IN PUT ITEM FUNC : ", error.message);
  }
  return null;
};

module.exports = { queryItems, getItem, putItem };
