# certainty_poker

Social game that tests both one's knowledge and ability to doubt themselves.

## Getting started

1. Start the GraphQL server using

Add a .env file to the ./server directory with

```
REDISCLOUD_URL=your-locally-running-redis-host:your-locally-running-redis-port
REDISCLOUD_PASSWORD=your-locally-running-redis-password
SMALL_BLIND=1
DOUBLE_EVERY_NTH_ROUND=4
```

Start a redis server with the defined host, port and pw.

```
go run cmd/server.go
```

2. Start the frontend using

```
cd client
npm install
npm start
```
