import { gql, GraphQLClient } from "graphql-request";
import { SubscriptionClient } from "graphql-subscriptions-client";

class AsyncActionClient {
  graphQLClient: GraphQLClient;
  subscriptionClient: SubscriptionClient;

  constructor(hasuraEndpoint: string, hasuraAdminSecret: string) {
    this.graphQLClient = new GraphQLClient(`http://${hasuraEndpoint}`, {
      headers: { "x-hasura-admin-secret": hasuraAdminSecret },
    });

    this.subscriptionClient = new SubscriptionClient(`ws://${hasuraEndpoint}`, {
      reconnect: true,
      lazy: true, // only connect when there is a query
      connectionParams: {
        headers: { "x-hasura-admin-secret": hasuraAdminSecret },
      },
      connectionCallback: (error) => {
        error && console.error(error);
      },
    });
  }

  callAsyncAction(
    actionName: string,
    actionRequest: string,
    variables: { [key: string]: any } = {},
    outputFields: string[],
    successCallback: (a: string) => void
  ): void {
    const getActionResultRequest = (id: string) => gql`
subscription asyncActionResponse {
  ${actionName}(id: "${id}") {
    errors
    output {
      ${outputFields.join(" ")}
    }
  }
}  
`;

    this.graphQLClient.request(actionRequest, variables).then((data) => {
      const actionResultRequest = getActionResultRequest(data[actionName]);

      const subscription = this.subscriptionClient
        .request({ query: actionResultRequest })
        // so lets actually do something with the response
        .subscribe({
          next(response: { [key: string]: any }) {
            const data = response?.data[actionName]?.output;
            if (data) {
              subscription.unsubscribe();
              successCallback(JSON.stringify(data));
            }
          },
        });
    });
  }
}

export default AsyncActionClient;
