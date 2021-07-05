function (user, context, callback) {
    const initSlackNotify = require('slack-notify');
    const slackWebHookUrl = "";
    const slack = initSlackNotify(slackWebHookUrl);
    if (!!user.clientID && !!user.user_id && !!context.sessionID && !!context.request.query.state) {
        const fetch = require('node-fetch');

        const localServiceUrl = "";
        const devServiceUrl = "";
        const finalServiceUrl = localServiceUrl + "/usersession/" + user.user_id;
        
        const messageBody = JSON.parse(JSON.stringify({
            userId: user.user_id,
            sessionId: context.sessionID,
          	state: context.request.query.state
        }));


        slack.success({
            text: JSON.stringify({ user: user, context: context, message: messageBody })
        });

        fetch(finalServiceUrl, {
            method: 'post',
            body: JSON.stringify(messageBody),
            headers: { 'Content-Type': 'application/json' },
        })
            .catch(err => {
                slack.success({
                    text: JSON.stringify({ response: err, status: "ERROR" })
                });
            })
            .then(res => res.json())
            .then(json => {
                slack.success({
                    text: JSON.stringify({ response: json, status: "OK" })
                });
            });
    } else {
        slack.success({
            text: JSON.stringify({message: "Some of needed data is missing!", data: {
                clientId: user.clientID,
            	userId: user.user_id,
            	sessionId: context.sessionID,
            	state: context.request.query.state} })
        });
    }


    return callback(null, user, context);
}