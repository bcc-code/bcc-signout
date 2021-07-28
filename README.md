# bcc-signout
This repository holds main part of solution developed in-house by BCC that enhances Auth0 feature-set with Single Sign Out feature,
loosely based on OpenID Connect backchannel logout [RFC-draft](https://openid.net/specs/openid-connect-backchannel-1_0.html). It works by extending Auth0 Login flow with Auth0 action (other repository) that dispatches session metadata (user identifier + app) to this service, which stores it. When logout request is dispatched, this service looks up all registered sessions for same user and calls stored app logout URLs one by one. 

# installation
1. Like most of nodejs projects, you can clone it and run ```npm i```  to install dependencies it. 
2. In order for app to actually run
you must create .env file with these keys
```
REDIS_HOST
REDIS_PORT
PORT
AUTH0_SECRET=AUTH0_SECRET
ENVIRONMENT=TEST
```


3. Another thing that is required is working redis instance that env vars would point to. You can either run it locally or by docker.
This repository contains docker-compose file that could be used to run redis, this server and simple mock-server that you can use to check if outgoing request are ok.
4. When you have all this you can start server by running ```npm run dev``` or ```npm run debug```. Project has .vscode directory with debug config both for app and tests

# how it works     
// TODO: put here drawings of data flow

1. Solution for federated, single logout consists of few parts:
    - Auth0 rule (in this repository) that dispatches requests with login metadata to this server
    - simple express backend that has ```userSession``` and ```logout``` endpoints (more on this later)
    - redis cache that servers as data storage for userSessions

2. Auth0 rule sends POST request to endpoint ```/usersession/:userID``` with payload in JSON
```json
{
    "clientId":"CLIENTID", 
    "sessionId":"sessionID", 
    "state": "STATE"
}
````
3. Backend fetches application (by clientId) logout Url, that will be used to perform single logout (currently mapping from client_ids to urls is maintained in static JSON file)
4. Data is saved in redis instance as simple Key -> Value ```USERID::SESSIONID::CLIENTID -> URL::STATE``` with TTL seto to 31 days
5. This server has also another endpoint ```logout``` that accepts GET requests with NEEDED query params:
```url
SERVER_URL/logout?userId=USERID&sessionId=SESSIONID
````
6. Server checks for existence of said session, and once confirmed fetches all stored sessions of same SessionId for this user and tries to 
perform GET request without any body as such: ```callbackUrl?state=STATE```, for example
```
http://localhost:5555/logout?state=state
```
and then responds to caller with statuses of all login attempts.

7. Important! This server wont clear your Auth0 session nor social provider session. During logout flow this responsibility still lies within client app that user wants to logout from.

# infrastructure
This project is hosted on google cloud platform and consists of:
- cloudbuild
- cloudbuild trigger on push to main branch
- cloudbuild trigger on dev tags (you can tag commit by running ```./triggers/trigger-dev.sh ``` )
- cloud run instances
- cloud domain for production instance
- VPC serverless connector
- memorystore redis instance
- logging and monitoring

# contribution
each is welcome, code of conduct and license will be established once alpha release is accepted.

potential ares to work on:
- different storage for client configurations
- encryption of communication between Auth0 and this server
- transactions for redis operations
- auto-logout of sessions that are nearing TTL

# service Urls
- https://signout-dev-i7vver6zya-lz.a.run.app -> signout-dev (signout-dev.bcc.no)
- https://signout-i7vver6zya-lz.a.run.app -> signout prod (signout.bcc.no)