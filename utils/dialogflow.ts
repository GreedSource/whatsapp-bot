import dialogflow from "@google-cloud/dialogflow";

// const config = require("./config");

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
};

const sessionClient = new dialogflow.SessionsClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials,
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
const sendToDialogFlow = async (
  msg: string,
  session: string,
  params?: any
): Promise<any> => {
  let textToDialogFlow = msg;
  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.GOOGLE_PROJECT_ID,
      session
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: textToDialogFlow,
          languageCode: process.env.DF_LANGUAGE_CODE,
        },
      },
      queryParams: {
        payload: {
          fields: params,
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    if (result) {
      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);
      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
        return result.fulfillmentText;
      } else {
        console.log("  No intent matched.");
      }
    } else {
      throw new Error("No response from DialogFlow");
    }
  } catch (error) {
    console.error(error);
  }
};

export default { sendToDialogFlow };
