import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const eventBridgeClient = new EventBridgeClient({ region: "us-east-1" });

export const sendEvent = async (event) => {
  try {
    // Parse the incoming request body
    console.log('<vsr> entered the function');
    console.log(event);
    console.log(event.body);
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      body = event.body;
    }

    // Define the event to send to EventBridge
    const params = {
      Entries: [
        {
          Source: "my.application",
          DetailType: "MyCustomDetail",
          Detail: JSON.stringify(body),
          EventBusName: "MyNewCustomEventBus",
        },
      ],
    };

    // Send the event to EventBridge
    const command = new PutEventsCommand(params);
    const result = await eventBridgeClient.send(command);

    console.log("Event sent successfully:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Event sent successfully!",
        result,
      }),
    };
  } catch (error) {
    console.error("Error sending event:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error sending event",
        error: error.message,
      }),
    };
  }
};
