import { gql, GraphQLClient } from "graphql-request";
import { SubscriptionClient } from "graphql-subscriptions-client";

export type ASYNC_ACTION = {
  request: string;
  outputFields: string[];
};

export type ASYNC_ACTIONS = {[key: string]: ASYNC_ACTION};

class AsyncActionClient {
  asyncActions: ASYNC_ACTIONS;
  graphQLClient: GraphQLClient;
  subscriptionClient: SubscriptionClient;

  constructor(hasuraEndpoint: string, hasuraAdminSecret: string, actions: ASYNC_ACTIONS, ) {
    this.asyncActions = actions;

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
    callback: (a: string) => void,
    actionName: string,
    variables: { [key: string]: any } = {}
  ): void {
    const asyncAction = this.asyncActions[actionName];

    const getActionResultRequest = (id: string) => gql`
subscription asyncActionResponse {
  ${actionName}(id: "${id}") {
    errors
    output {
      ${asyncAction.outputFields.join(' ')}
    }
  }
}  
`;

    this.graphQLClient.request(asyncAction.request, variables).then((data) => {
      const actionResultRequest = getActionResultRequest(data[actionName]);

      const subscription = this.subscriptionClient
        .request({ query: actionResultRequest })
        // so lets actually do something with the response
        .subscribe({
          next(response: { [key: string]: any }) {
            const data = response?.data[actionName]?.output;
            if (data) {
              subscription.unsubscribe();
              callback(JSON.stringify(data));
            }
          },
        });
    });
  }
}

export default AsyncActionClient;

