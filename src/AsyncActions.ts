import { gql } from "graphql-request";
import { ASYNC_ACTIONS } from "./AsyncActionClient";

export const APP_ASYNC_ACTIONS: ASYNC_ACTIONS = {
  sleepyAction: {
    request: gql`
      mutation sleepAction($sleep: Int!) {
        sleepyAction(sleep: $sleep)
      }
    `,
    outputFields: ['msg', 'status'],
  },
};
