function (user, context, callback) {
    const initSlackNotify = require('slack-notify');
    const slackWebHookUrl = "https://hooks.slack.com/services/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";
    const slack = initSlackNotify(slackWebHookUrl);
    if (!!user.clientID && !!user.user_id && !!context.sessionID) {
        const fetch = require('node-fetch');

        const localServiceUrl = "";
        const devServiceUrl = "";
        const finalServiceUrl = localServiceUrl + "/usersession/" + user.user_id;
        
        const messageBody = JSON.parse(JSON.stringify({
            appId: user.clientID,
            userId: user.user_id,
            sessionId: context.sessionID
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
            text: JSON.stringify({message: "Some of needed data is missing!" })
        });
    }


    return callback(null, user, context);
}