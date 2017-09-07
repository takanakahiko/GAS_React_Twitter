function GET_CONSUMER_KEY_(){
  return ""+PropertiesService.getScriptProperties().getProperty("CONSUMER_KEY");
};
function GET_CONSUMER_SECRET_(){
  return ""+PropertiesService.getScriptProperties().getProperty("CONSUMER_SECRET");
};

function getTwitterService() {
  var service = OAuth1.createService('twitter')
  .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
  .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
  .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
  .setConsumerKey(GET_CONSUMER_KEY_())
  .setConsumerSecret(GET_CONSUMER_SECRET_())
  .setCallbackFunction('authCallback')
  .setCache(CacheService.getUserCache());
  OAuth1.getCallbackUrl = function() {
    return getMyUrl();
  }
  return service;
}

function hasAccess(){
  var service = getTwitterService();
  return service.hasAccess();
}

function auth(){
  var service = getTwitterService();
  var authorizationUrl = service.authorize();
  return authorizationUrl;
}

var twitter_base_url = 'https://api.twitter.com/1.1/';

function postAccessTwitter(endPoint, payload){
  var service = getTwitterService();
  var payload_str = payloadToString(payload);
  var options = {method:'post', escaping:false, payload:payload_str};
  var twitter_base_url = 'https://api.twitter.com/1.1/';
  var url = twitter_base_url+endPoint+'.json';
  var response = service.fetch(url, options);
  return JSON.parse(response.getContentText());
};

function getAccessTwitter(endPoint, payload){
  var service = getTwitterService();
  var payload_str = payloadToString(payload);
  var twitter_base_url = 'https://api.twitter.com/1.1/';
  var url = twitter_base_url+endPoint+'.json?'+payload_str;
  if(payload_str=="") url = twitter_base_url+endPoint+'.json';
  var response = service.fetch(url);
  return JSON.parse(response.getContentText());
};

function payloadToString(payload){
  return Object.keys(payload).map(function(key) {
    return encodeToRfc3986(key)+'='+encodeToRfc3986(payload[key]);
  }).join('&');
}

function encodeToRfc3986(str) {
  return encodeURIComponent(str).replace(/[!'()]/g, function(char) {
    return escape(char);
  }).replace(/\*/g, "%2A");
}