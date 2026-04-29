#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type {
  ClientNotification,
  ClientRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const JITBIT_URL = process.env.JITBIT_URL;
const JITBIT_TOKEN = process.env.JITBIT_TOKEN;

if (!JITBIT_URL) {
  console.error("ERROR: JITBIT_URL environment variable is required. Set it to your Jitbit Helpdesk base URL (e.g. https://yourcompany.jitbit.com).");
  process.exit(1);
}

if (!JITBIT_TOKEN) {
  console.error("ERROR: JITBIT_TOKEN environment variable is required. Copy your API token from your Jitbit profile page.");
  process.exit(1);
}

const upstreamUrl = new URL(`${JITBIT_URL.replace(/\/+$/, "")}/api/mcp`);
const PassthroughResult = z.object({}).passthrough();

async function main() {
  const upstream = new Client({ name: "jitbit-helpdesk-mcp", version: "2.0.0" });

  try {
    await upstream.connect(
      new StreamableHTTPClientTransport(upstreamUrl, {
        requestInit: { headers: { Authorization: `Bearer ${JITBIT_TOKEN}` } },
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to connect to ${upstreamUrl}: ${message}`);
    console.error("This package requires Jitbit Helpdesk 11.21 or later, which exposes /api/mcp. Verify the URL and token.");
    process.exit(1);
  }

  const upstreamInfo = upstream.getServerVersion();
  const capabilities = upstream.getServerCapabilities() ?? {};
  const instructions = upstream.getInstructions();

  const server = new Server(
    {
      name: upstreamInfo?.name ?? "jitbit-helpdesk-mcp",
      version: upstreamInfo?.version ?? "2.0.0",
    },
    { capabilities, instructions }
  );

  server.fallbackRequestHandler = async (request) => {
    return upstream.request(request as ClientRequest, PassthroughResult);
  };

  server.fallbackNotificationHandler = async (notification) => {
    await upstream.notification(notification as ClientNotification);
  };

  upstream.fallbackNotificationHandler = async (notification) => {
    await server.notification(notification as ServerNotification);
  };

  upstream.onclose = () => {
    server.close().catch(() => {});
    process.exit(0);
  };

  await server.connect(new StdioServerTransport());
  console.error(`Jitbit Helpdesk MCP proxy connected to ${upstreamUrl}`);
}

main().catch((error) => {
  console.error("Proxy error:", error);
  process.exit(1);
});
