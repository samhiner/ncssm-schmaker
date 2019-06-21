//This is all heavily modified Google Calendar API Sample Code.

// Client ID and API key from the Developer Console
var CLIENT_ID = '804129209055-7fqklputa4c8ips727b16bdtqhqcbdvs.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCV0jMJNCTxXlOkH4kCM1vIMoaxny9AXGo';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

var authorizeButton = document.getElementById('authorize_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {

    authorizeButton.onclick = handleAuthClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function signInStatus() {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
}

/**
 *  Sign in the user upon button click.
 */
async function handleAuthClick(event) {
	if (!signInStatus()) {
    await signIn();
}
insertClasses();
}

async function signIn() {
	alert('I am not a verified publisher, so once you select your account, you will have to click Advanced -> Go to NCSSM Schmaker 2019-20');
	return gapi.auth2.getAuthInstance().signIn();
}

function appendPre(info) {
  console.log(info)
}