/// <reference types="vite/client" />

declare module "*.css";
declare module "lodash-es";
declare const __DEV__: boolean;

interface Window {
  twttr: {
    widgets: {
      createTweet: (
        tweetID: string,
        element: HTMLElement | null,
      ) => Promise<unknown>;
    };
  };
}
