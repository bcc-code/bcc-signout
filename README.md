# bcc-signout
This repository holds main part of solution developed in-house by BCC that enhances Auth0 feature-set with Single Sign Out feature,
loosely based on OpenID Connect backchannel logout [RFC-draft](https://openid.net/specs/openid-connect-backchannel-1_0.html). It works by extending Auth0 Login flow with Auth0 action (other repository) that dispatches session metadata (user identifier + app) to this service, which stores it. When logout request is dispatched, this service looks up all registered sessions for same user and calls stored app logout URLs one by one. 


