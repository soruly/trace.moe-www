# trace.moe-www

[![License](https://img.shields.io/github/license/soruly/trace.moe-www.svg?style=flat-square)](https://github.com/soruly/trace.moe-www/blob/master/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/soruly/trace.moe-www/Node.js%20CI?style=flat-square)](https://github.com/soruly/trace.moe-www/actions)
[![Discord](https://img.shields.io/discord/437578425767559188.svg?style=flat-square)](https://discord.gg/K9jn6Kj)

Front-end website for [trace.moe](https://github.com/soruly/trace.moe)

### Prerequisites

- Node.js 14.x
- git
- [pm2](https://pm2.keymetrics.io/) (optional)

### Install

Install Prerequisites first, then:

```
git clone https://github.com/soruly/trace.moe-www.git
cd trace.moe-www
npm install
```

### Configuration

- Copy `.env.example` to `.env`
- Edit `.env` as appropriate for your setup

### Start server

```
node server.js
```

You can also use pm2 to run this in background in cluster mode.

Use below commands to start / restart / stop server.

```
npm run start
npm run stop
npm run reload
npm run restart
npm run delete
```

To change the number of nodejs instances, edit ecosystem.config.json
