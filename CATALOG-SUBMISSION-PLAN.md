# MCP Catalog Submission Plan

Step-by-step plan for submitting `jitbit-helpdesk-mcp` to all major MCP directories.

**Prerequisites:**
- [x] npm package published (`jitbit-helpdesk-mcp@1.0.0`)
- [x] GitHub repo public (`jitbit/jitbit-helpdesk-mcp`)
- [x] `smithery.yaml` included in repo
- [x] README with setup instructions

---

## 1. Official MCP Registry (highest priority)

The official registry at https://registry.modelcontextprotocol.io — used by Claude and other MCP clients.

**Steps:**

1. Install the publisher CLI:
   ```bash
   npm install -g @anthropic-ai/mcp-publisher
   ```

2. Log in with GitHub:
   ```bash
   mcp-publisher login
   ```
   Go to https://github.com/login/device and enter the code shown.

3. Add `mcpName` to `package.json`:
   ```json
   "mcpName": "io.github.jitbit/jitbit-helpdesk"
   ```
   (Must start with `io.github.<your-github-username>/` when using GitHub auth.)

4. Publish:
   ```bash
   mcp-publisher publish
   ```

5. Verify at https://registry.modelcontextprotocol.io

**Docs:** https://modelcontextprotocol.io/registry/quickstart

---

## 2. Smithery

Popular MCP catalog at https://smithery.ai — `smithery.yaml` is already in the repo.

**Steps:**

1. Install Smithery CLI:
   ```bash
   npm install -g @anthropic-ai/smithery
   ```

2. Publish:
   ```bash
   smithery mcp publish https://github.com/jitbit/jitbit-helpdesk-mcp -n jitbit/jitbit-helpdesk
   ```

3. Verify at https://smithery.ai/server/jitbit/jitbit-helpdesk

**Docs:** https://smithery.ai/docs

---

## 3. mcp.so

Community-driven directory at https://mcp.so with 17,000+ servers listed.

**Steps:**

1. Go to https://mcp.so
2. Click **"Submit"** in the navigation bar
3. Provide the GitHub repo URL: `https://github.com/jitbit/jitbit-helpdesk-mcp`
4. Fill in details:
   - **Name:** Jitbit Helpdesk MCP Server
   - **Description:** Search and read support tickets from Jitbit Helpdesk via AI assistants. Works with SaaS and on-premise installations.
   - **Category:** Customer Support / Helpdesk

---

## 4. PulseMCP

Directory at https://www.pulsemcp.com with 11,000+ servers, updated daily.

**Steps:**

1. Go to https://www.pulsemcp.com/use-cases/submit
2. Submit the GitHub repo URL: `https://github.com/jitbit/jitbit-helpdesk-mcp`
3. Fill in details:
   - **Name:** Jitbit Helpdesk MCP Server
   - **Description:** Search and read support tickets from Jitbit Helpdesk via AI assistants. Works with SaaS and on-premise installations.
   - **Use case:** Customer Support

---

## 5. Glama

MCP hosting + directory at https://glama.ai/mcp/servers — auto-indexes from npm but you can also submit directly.

**Steps:**

1. Go to https://glama.ai/mcp/servers
2. Click **"Add Server"**
3. Provide the GitHub repo URL or npm package name
4. Glama may also auto-discover the package from npm within a few days

---

## 6. mcpservers.org (Awesome MCP Servers)

Community-curated list at https://mcpservers.org

**Steps:**

1. Go to the GitHub repo behind mcpservers.org
2. Submit a PR adding `jitbit-helpdesk-mcp` under the appropriate category (Customer Support / Helpdesk)
3. Include: name, one-line description, and link to GitHub repo

---

## 7. Docker MCP Catalog

Docker's built-in MCP catalog at https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/

**Steps:**

1. Add a `Dockerfile` to the repo (not yet done — optional for v1)
2. Submit via Docker's MCP catalog submission process
3. Lower priority — revisit after other catalogs are done

---

## Copy-Paste Description

Use this consistent description across all submissions:

> **Jitbit Helpdesk MCP Server**
>
> An MCP server that lets AI assistants search and read support tickets from Jitbit Helpdesk. Works with both SaaS and on-premise installations. Three read-only tools: search tickets, list tickets, and get ticket with full conversation thread.
>
> - npm: `npx -y jitbit-helpdesk-mcp`
> - GitHub: https://github.com/jitbit/jitbit-helpdesk-mcp

---

## Submission Tracker

| Catalog | Status | URL |
|---------|--------|-----|
| npm | Done | https://www.npmjs.com/package/jitbit-helpdesk-mcp |
| Official MCP Registry | Pending | |
| Smithery | Pending | |
| mcp.so | Pending | |
| PulseMCP | Pending | |
| Glama | Pending | |
| mcpservers.org | Pending | |
| Docker MCP Catalog | Pending | |
