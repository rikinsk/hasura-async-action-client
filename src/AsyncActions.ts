import { gql } from "graphql-request";

type ASYNC_ACTIONS = { [key: string]: string };

export const APP_ASYNC_ACTIONS: ASYNC_ACTIONS = {
  sleepyAction: gql`
    mutation sleepAction($sleep: Int!) {
      sleepyAction(sleep: $sleep)
    }
  `,
};
