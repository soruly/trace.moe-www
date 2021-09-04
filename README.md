# trace.moe-www

[![License](https://img.shields.io/github/license/soruly/trace.moe-www.svg?style=flat-square)](https://github.com/soruly/trace.moe-www/blob/master/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/soruly/trace.moe-www/Docker%20Image%20CI?style=flat-square)](https://github.com/soruly/trace.moe-www/actions)
[![Docker](https://img.shields.io/docker/pulls/soruly/trace.moe-www?style=flat-square)](https://hub.docker.com/r/soruly/trace.moe-www)
[![Docker Image Size](https://img.shields.io/docker/image-size/soruly/trace.moe-www/latest?style=flat-square)](https://hub.docker.com/r/soruly/trace.moe-www)
[![Discord](https://img.shields.io/discord/437578425767559188.svg?style=flat-square)](https://discord.gg/K9jn6Kj)

Front-end website for [trace.moe](https://github.com/soruly/trace.moe)

## Getting Started

```
docker run -it --rm -p 3000:3000 ghcr.io/soruly/trace.moe-www:latest
```

## Development

```
git clone https://github.com/soruly/trace.moe-www.git
cd trace.moe-www
npm install
npm run dev
```

You can also use [pm2](https://pm2.keymetrics.io/) to run this in background in cluster mode.

Use below commands to start / restart / stop server.

```
npm run start
npm run stop
npm run reload
npm run restart
npm run delete
```

To change the number of nodejs instances, edit ecosystem.config.json
