function doGet(e) {
  if(hasAccess()){
    return printMainPage();
  }else if(e.parameter.oauth_token){
    console.log("test")
    return printAuthCallback(e);
  }else{
    logout();
    return printRedirect();
  }
}

function printRedirect(){
  var t = HtmlService.createTemplateFromFile("auth");
  t.url = auth();
  return t.evaluate();
}

function printAuthCallback(request) {
  var service = getTwitterService();
  var isAuth = service.handleCallback(request);
  if (isAuth){
    var t = HtmlService.createTemplateFromFile("auth");
    t.url = getMyUrl();
    return t.evaluate();
  }
  return HtmlService.createHtmlOutput('<p>NG</p>');
}

function printMainPage(){
  var t = HtmlService.createTemplateFromFile("index");
  return t.evaluate().setTitle('GASでツイ').addMetaTag('viewport', "width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getMyUrl(){
  Logger.log(ScriptApp.getService().getUrl());
  return ScriptApp.getService().getUrl();
}

function translateToNyaan(text){
  return SocialityFilter.replace(text)
}

function logout(){
  CacheService.getUserCache().remove('oauth1.twitter');
}