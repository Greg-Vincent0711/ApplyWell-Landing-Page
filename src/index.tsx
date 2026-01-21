import "./index.css";
import React from "react";
import { render } from "react-dom";
import { PostHogProvider } from "posthog-js/react";
import { App } from "./App";

render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: "2025-05-24",
        capture_exceptions: true,
        // MODE is a built in env var
        debug: import.meta.env.MODE === "development",
      }}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>,
  document.getElementById("root")
);