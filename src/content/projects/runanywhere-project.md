---
title: "RunAnywhere Remote Server Control"
description: "Zero-dependency remote server control tool with web panel, persistent terminal, and cross-platform Go runner."
year: 2026
tags: ["Go", "Node.js", "Express", "WebSocket", "PostgreSQL", "Remote Control", "Terminal", "Cross-Platform", "Admin Panel", "Security"]
category: "personal"
subcategory: "devops"
---

RunAnywhere is a developer-focused remote server control tool that lets you manage any machine from a web panel. Install a lightweight Go runner on any device (Linux, macOS, Windows) and control it securely via a browser. All communication is over WebSocket, with zero runtime dependencies on target machines.

## Features

- **Zero-Dependency Runner**: Single static Go binary, no runtime required
- **Web Panel**: Terminal-style UI for command execution and persistent shell sessions
- **Cross-Platform**: Works on Linux, macOS, and Windows (native PowerShell installer)
- **Real-Time Control**: WebSocket-based, low-latency command and terminal streaming
- **Device Info**: Auto-registers system info (CPU, RAM, disk, IP, uptime, kernel)
- **Admin Panel**: Next.js admin dashboard for user, runner, and log management
- **Security**: JWT auth, brute-force protection, auto-uninstall for revoked runners
- **Dual Execution Modes**: Per-command and persistent terminal session support
- **Easy Install**: One-line bash or PowerShell install scripts

## Implementation

Install the runner on any server using a one-liner. The runner connects to the central server via WebSocket, registers device info, and waits for commands. The web panel lets you select a runner, execute commands, or open a persistent terminal session. All output streams in real time to your browser.

## Technical Architecture

- **Runner**: Go (static binary, cross-compiled for all major OS/arch)
- **Server**: Node.js (Express + raw WebSocket, single process)
- **Database**: PostgreSQL (users, tokens, logs, settings)
- **Web Panel**: Plain HTML/JS (no frameworks)
- **Admin Panel**: Next.js (user/runner management, logs, settings)
- **Security**: JWT, brute-force lockout, auto-uninstall for revoked/unauthorized runners
- **Communication**: All messages are JSON over WebSocket

## Use Cases

- **Remote Server Management**: Run commands, scripts, or open terminals on any machine
- **Fleet Monitoring**: View device info and status for all connected runners
- **Admin Oversight**: Manage users, runners, and login logs from a secure dashboard
- **DevOps Automation**: Integrate with CI/CD or custom workflows for remote execution

## Capabilities

- Execute shell commands on any connected runner
- Open persistent terminal sessions (bash/cmd)
- View real-time stdout/stderr and exit codes
- Monitor device info and runner status
- Manage users, tokens, and runners via admin panel
- Secure, auditable login and command history (in-session)

## Technologies

- Go (runner)
- Node.js (server)
- Express, ws (WebSocket)
- PostgreSQL
- Next.js (admin panel)
- HTML/CSS/JS (web panel)
- JWT, bcrypt (security)

## Demo

![RunAnywhere Demo](https://raw.githubusercontent.com/hardikhari96/runanywhere/main/demo.gif)

