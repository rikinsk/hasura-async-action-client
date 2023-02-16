# Hasura Async Action Client

Simple JS client for running [Hasura async actions](https://hasura.io/docs/latest/actions/async-actions/).

Hasura async actions return an action id immediately and the actual result of the action can be fetched via a subscription to that id.

Hasura Async Action Client accepts an action name, action request and request variables and calls a callback when the async action
completes.

## Usage

```js
const asyncHandler = new AsyncActionClient(
  HASURA_ENDPOINT,
  HASURA_ADMIN_SECRET
);

  asyncHandler.callAsyncAction(
    "<action_name>",
    gql`
      <action_request>
    `,
    {"<variables>"},
    ["<response_field_array>"],
    successCallbackFn
  );
```

For example:
```JS
asyncHandler.callAsyncAction(
  "sleepAction",
  gql`
    mutation sleepAction($sleep: Int!) {
      sleepyAction(sleep: $sleep)
    }
  `,
  { sleep: sleepTime },
  ["status", "msg"],
  successCallbackFn
);
```

### Local Dev

#### Hasura

Deploy hasura from `hasura` directory

#### Action handler

Run `actionHandler.js`

#### App

In the project directory, you can run:

##### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

##### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
