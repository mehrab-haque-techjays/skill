/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios');

const sendAlertNotifications = (accessToken, eventData, isMarkAsSafe = false) => {
    return new Promise((resolve) => {
        Promise.all([
            axios({
                method: 'post',
                url: `https://qa-api.e1app.com/v1/api/alert/${isMarkAsSafe ? 'mark-as-safe' : 'create'}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: isMarkAsSafe ? eventData.safeEvent : eventData.alertEvent
            }).catch(error => {
                console.error('Error sending alert notification:', error);
                return null;
            })
            // ,
            // axios({
            //     method: 'post',
            //     url: 'http://e1-chat-qa.eba-ksniifcd.us-west-2.elasticbeanstalk.com/handle-alert',
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //         'Content-Type': 'application/json'
            //     },
            //     data: eventData.socketEvent
            // }).catch(error => {
            //     console.error('Error sending socket notification:', error);
            //     return null;
            // })
        ]).then(results => {
            resolve(results);
        }).catch(error => {
            console.error('Error in Promise.all:', error);
            resolve([null, null]);
        });
        resolve([null, null]);
    });
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to emergency one, if you are in emergency, say "I am in emergency" or say "I am worried" ! we shall send alert to neighbours right away...';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CreateEmergencyAlertIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CreateEmergencyAlertIntent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        const { accessToken } = handlerInput.requestEnvelope.session.user;

        if (accessToken) {
            try {
                const response = await axios({
                    method: 'post',
                    url: 'https://qa-api.e1app.com/v1/integration/alert',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        alertType: 1
                    }
                });

                speakOutput = response.data.msg;
                // sendAlertNotifications(accessToken, response.data);

            } catch (error) {
                console.error('Error sending alert:', error);
                speakOutput = 'Sorry, there was an error sending the emergency alert. Please try again.';
            }
        } else {
            speakOutput = 'Please link your account in the Alexa app to use this feature.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const CreateWorriedAlertIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CreateWorriedAlertIntent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        const { accessToken } = handlerInput.requestEnvelope.session.user;

        if (accessToken) {
            try {
                const response = await axios({
                    method: 'post',
                    url: 'https://qa-api.e1app.com/v1/integration/alert',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        alertType: 2
                    }
                });

                speakOutput = response.data.msg;
                // sendAlertNotifications(accessToken, response.data);

            } catch (error) {
                console.error('Error sending alert:', error);
                speakOutput = 'Sorry, there was an error sending the worried alert. Please try again.';
            }
        } else {
            speakOutput = 'Please link your account in the Alexa app to use this feature.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const MarkAsSafeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MarkAsSafeIntent';
    },
    async handle(handlerInput) {
        let speakOutput = '';
        const { accessToken } = handlerInput.requestEnvelope.session.user;

        if (accessToken) {
            try {
                const response = await axios({
                    method: 'delete',
                    url: 'https://qa-api.e1app.com/v1/integration/alert',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                speakOutput = response.data.msg;
                // sendAlertNotifications(accessToken, response.data, true);

            } catch (error) {
                console.error('Error marking as safe:', error);
                speakOutput = 'Sorry, there was an error marking you as safe. Please try again.';
            }
        } else {
            speakOutput = 'Please link your account in the Alexa app to use this feature.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CreateEmergencyAlertIntentHandler,
        CreateWorriedAlertIntentHandler,
        MarkAsSafeIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();