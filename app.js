// JavaScript Document
"use strict";
// jQuery conflict with native prototype.

//angular.element() === jQuery() === $();
// using the angular ui of Bootstrap
var app = angular.module('myApp', ['ngCookies', 'ui.bootstrap', 'ngFileUpload']);

app.constant('config', {
	serverHost: serverHost,
	webRoot: webRoot,
	requireLoginPage: requireLoginPage,
	afterLoginPage: afterLoginPage,
	
	editMode: directiveEditMode,
	reservedPath: reservedPath,
	CookiesEffectivePath: CookiesEffectivePath,
});

app.config(['config', '$httpProvider', function(config, $httpProvider) {
	config.test = "Keith";
	
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    // $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    // $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;
}]);

app.service('Core', ['$rootScope', 'config', function($rootScope, config){
	var core = this;
	
	core.RegistryConfig = function(){
		$rootScope.globalCriteria = {};
		
		$rootScope.globalCriteria.editMode = config.editMode;
		
		$rootScope.serverHost = config.serverHost;
		$rootScope.webRoot = config.webRoot;
		
		$rootScope.webRoot += "/";	
		$rootScope.requireLoginPage = $rootScope.webRoot+config.requireLoginPage;
		$rootScope.afterLoginPage = $rootScope.webRoot+config.afterLoginPage;
		
		$rootScope.controller = $rootScope.webRoot+config.reservedPath.controller;
		$rootScope.templateFolder = $rootScope.webRoot+config.reservedPath.templateFolder;
		$rootScope.screenTemplate = $rootScope.templateFolder+config.reservedPath.screenTemplate;
		
		$rootScope.CookiesEffectivePath = config.CookiesEffectivePath;

		// Server Environment
		$rootScope.serEnv = {};
		$rootScope.serEnv.phpRecordLimit = 10; // assume PHP select reocrd limit as 10, must match with server side
	}
	
	core.ConvertMySQLDataType = function(mySqlDataType){
        var dataType ="string";
        if(mySqlDataType == "varchar" || 
            mySqlDataType == "char" || 
            mySqlDataType == "tinytext" || 
            mySqlDataType == "text" || 
            mySqlDataType == "mediumtext" || 
            mySqlDataType == "longtext"){
            dataType = "string";
        }
        else if (mySqlDataType == "datetime" ||
            mySqlDataType == "timestamp"  ||
            mySqlDataType == "date" ){
            dataType = "date";
        }
        else if (mySqlDataType == "double" ||
            mySqlDataType == "decimal"  ||
            mySqlDataType == "float"  ||
            mySqlDataType == "tinyint"  ||
            mySqlDataType == "smallint"  ||
            mySqlDataType == "mediumint"  ||
            mySqlDataType == "int"  ||
            mySqlDataType == "bigint" ){
            dataType = "double";
        }
        return dataType;
	}
	core.IsSystemField = function(fieldName){

        var isSystemField = false;

        switch (fieldName)
        {
            // skill these colummn
            case "line":
            case "systemUpdateDate":
            case "systemUpdateUser":
            case "systemUpdateProgram":
            case "createDate":
            case "createUser":
            case "lastUpdateUser":
            // case "lastUpdateDate":
                isSystemField = true;
                break;
        }

        return isSystemField;
	}
	
	core.RegistryConfig();
	return core;
}]);

app.service('LockManager', ['$rootScope', '$timeout', function($rootScope, $cookies){
	var locker = this;
	locker.lockArea = {};
	locker.tagName = "";
	locker.programId = "";

	locker.LockAllControls = function(lockArea, tagName){
		// var lockArea = locker.lockArea;
		// var tagName = locker.tagName;
		// tagName = tagName.toLowerCase();

		var isLockArea = CheckLockArea(lockArea);
		if(!isLockArea)
			return;

		console.log("LockAllControls(): "+tagName);

		if(tagName == "entry")
		{
			LockEntryControls(lockArea, true);
		}
		else
		{
			LockPageViewControls(lockArea, true);
		}
	}

	locker.LockAllInputBox = function(lockArea, tagName){
		tagName = tagName.toLowerCase();
		LockAllInputBox(lockArea, true);
	}

	locker.UnLockSubmitButton = function(lockArea, tagName){
		tagName = tagName.toLowerCase();
		LockSubmitButton(lockArea, false);
	}

	locker.UnLockAllControls = function(lockArea, tagName){
		// var lockArea = locker.lockArea;
		// var tagName = locker.tagName;

		var isLockArea = CheckLockArea(lockArea);
		if(!isLockArea)
			return;

		console.log("UnLockAllControls(): "+tagName);

		if(tagName == "entry")
		{
			LockEntryControls(lockArea, false);
		}
		else
		{
			LockPageViewControls(lockArea, false);
		}
	}

	function CheckLockArea(lockArea){
		var isValid = true;
		if(!lockArea){
			console.log("LockManager: lock area have not defined. Avoid to UnLockAllControls().")
			isValid = false;
		}
		return isValid;
	}

	function LockPageViewControls(lockArea, isLock){
		var fieldset = lockArea.find("fieldset")
		$(fieldset).prop("disabled", isLock)
		
		var input = lockArea.find("input")
		$(input).prop("disabled", isLock)
	    
	    var textarea = lockArea.find("textarea")
	    $(textarea).prop("disabled", isLock)

		var button = lockArea.find("button")
		$(button).prop("disabled", isLock)
	}

	function LockEntryControls(lockArea, isLock){
		var fieldset = lockArea.find("fieldset")
		$(fieldset).prop("disabled", isLock)
		
		var input = lockArea.find("input")
		$(input).prop("disabled", isLock)

		var textarea = lockArea.find("textarea")
		$(textarea).prop("disabled", isLock)

		// var nonSubmitButton = lockArea.find("button:not([type='submit'])")
		var nonSubmitButton = lockArea.find("button[type='submit']")
		nonSubmitButton.prop("disabled", isLock)

		// var button = lockArea.find(".submitBtn button")
		// $(button).prop("disabled", isLock)

		var editBtn = lockArea.find("editbox button")
		$(editBtn).prop("disabled", isLock)
	}

	function LockAllInputBox(lockArea, isLock){
		var fieldset = lockArea.find("fieldset")
		$(fieldset).prop("disabled", isLock)
		
		var input = lockArea.find("input")
		$(input).prop("disabled", isLock)
	    
	    var textarea = lockArea.find("textarea")
	    $(textarea).prop("disabled", isLock)
	}

	function LockSubmitButton(lockArea, isLock){
		var button = lockArea.find(".submitBtn button")
		$(button).prop("disabled", isLock)
		var subminButton = lockArea.find("button[type='submit']")
		$(subminButton).prop("disabled", isLock)
	}

	return locker;
}]);

app.service('Security', ['$rootScope', 'Core', 'CookiesManager', '$cookies', 'MessageService', function($rootScope, Core, $jqCookies, $cookies, MessageService) {
	var secure = this;
	var rootScope = $rootScope;
   
	secure.IsAlreadyLogin = function(callbackFtn){
		var url = $rootScope.serverHost;
		//var clientID = secure.GetSessionID();
		
		var submitData = {"Session": ""};
		submitData.Action = "CheckLogin";

		var jqxhr = $.ajax({
		  type: 'POST',
		  url: url+'/model/ConnectionManager.php',
		  data: JSON.stringify(submitData),
		  //dataType: "json", // [xml, json, script, or html]
		  dataType: "json",
		});
		jqxhr.done(function (data, textStatus, jqXHR) {
		});
		jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
		});
		jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
  			var isUserAlreadyLogin = false;
  			if(textStatus == "success"){
	  			var gData = data_or_JqXHR;
	  			if(data_or_JqXHR.Status == "LoginSuccess" || gData.Status == "OK"){
					isUserAlreadyLogin = true;
			       }
  			}
			callbackFtn && callbackFtn(isUserAlreadyLogin);
		});
	}
	
	secure.GetSessionID = function(){
        var sessionID = $jqCookies.Read("SessionID");
        return sessionID;
	}

	/**
	 *return object {
	 *	CompanyCode - string, 
	 *	UserCode - string, login id
	 *	Password - string, login password
	 *	StaffID - string, staff id without @staff@
	 *}
	*/
	secure.GetLoginData = function(){
        var loginDataString = $jqCookies.Read("LoginData");
        var loginObj = {};
        if(typeof(loginDataString) != "undefined"){
	        if(!loginDataString.IsNullOrEmpty()){
	        	loginObj = JSON.parse(loginDataString);
	        }
        }
        return loginObj;
	}
	
	// redirect a page require user login
	secure.RedirectToLoginPage = function(){
	   window.location = rootScope.requireLoginPage;
	}
	
	// redirect to a page after the user login
	secure.RedirectToMainPage = function(){
	   window.location = rootScope.afterLoginPage;
	}
	
	secure.GoToMenuIfSessionExists = function(){
		secure.IsAlreadyLogin(function(isUserAlreadyLogin){
			if(isUserAlreadyLogin){
				secure.RedirectToMainPage();
			}
		});
	}
	
	secure.RequiresAuthorization = function(){
		secure.IsAlreadyLogin(function(isUserAlreadyLogin){
			if(!isUserAlreadyLogin){
				alert("Session was timeout, please login agian");
				secure.RedirectToLoginPage();
			}
		});
	}

	secure.SuccessButUnexpected = function(jqXHR, textStatus, errorThrown){
		// console.warn("Server response status:200 but response unexpected");
		console.log("textStatus: " + textStatus);
		console.log(jqXHR);
		console.log(errorThrown);
	}

	secure.ServerResponse499 = function(jqXHR, textStatus, errorThrown){
		console.log("Server response status:499");
		console.log("Require login again");

		var gotoLoginAgain = confirm("Server Session timeout, leave this page to login again.");

		if(gotoLoginAgain){
			secure.ClearSessionNUserData();
			secure.RedirectToLoginPage();
		}
	}

	secure.ServerResponseInFail = function(jqXHR, textStatus, errorThrown){
		console.warn("jqxhr.fail, recevied (jqXHR, textStatus, errorThrown)")
		console.log("textStatus: " + textStatus);
		console.log(jqXHR);
		console.log(errorThrown);

		if(jqXHR.status == 499){
			secure.ServerResponse499(jqXHR, textStatus, errorThrown);
		}else if(jqXHR.responseText === ""){
			console.log("HTTP responseText is empty!")
			// Security.ServerResponse499(jqXHR, textStatus, errorThrown);
		}
	}


	secure.HttpPromiseFail = function(reason){
		console.warn("HttpRequest promise return as fail");
		console.dir(reason);
        MessageService.addMsg(reason);
	}

	/**
	 * @param {Object} loginDataObj - {"UserCode":"...","Password":"...","CompanyCode":"..."}
	 */
	secure.LoginNRedirect = function(loginDataObj, scope){
		var url = $rootScope.serverHost;
		var submitData = loginDataObj;
		submitData.UserCode.toLowerCase();

		submitData.Action = "Login";

  			var jqxhr = $.ajax({
  				type: 'POST',
  				url: url+'/model/ConnectionManager.php',
  				data: JSON.stringify(submitData),
  				dataType: "json", // [xml, json, script, or html]
  			});
  			jqxhr.done(function (data, textStatus, jqXHR) {

  			});
  			jqxhr.fail(function (jqXHR, textStatus, errorThrown) {

  			});
  			jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
  				// console.log("jqxhr.always, recevied (data_or_JqXHR, textStatus, jqXHR_or_errorThrown)")
  				scope.LoginResult(data_or_JqXHR, textStatus, jqXHR_or_errorThrown);
  				
  				if(textStatus == "success"){
	  				var gData = data_or_JqXHR;
	  				if(gData.Status == "success" || data_or_JqXHR.Status == "LoginSuccess"){
						$jqCookies.Save("SessionID", gData.SESSION_ID);
						submitData.UserCode = submitData.UserCode.toUpperCase();
						$jqCookies.Save("LoginData", JSON.stringify(submitData));
			        }
			        
		  			if(gData.Status == "success" || data_or_JqXHR.Status == "LoginSuccess"){
						alert("login success");
						secure.RedirectToMainPage();
					}
  				}

  			});
	}

	secure.SetTimeout = function(){
		var url = $rootScope.serverHost;
		var submitData = {"timeout": 3000000};

		var jqxhr = $.ajax({
			type: 'POST',
			url: url+'/SETTIMEOUT',
			data: JSON.stringify(submitData),
			dataType: "json", // [xml, json, script, or html]
		});

		jqxhr.done(function (data, textStatus, jqXHR) {
		});
		jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
			//secure.RedirectToMainPage();
		});
	}

	secure.LogoutNRedirect = function(){
		var url = $rootScope.serverHost;
		
		secure.IsAlreadyLogin(function(isUserAlreadyLogin){
			if(!isUserAlreadyLogin){
				alert("Session already destroyed.");
				secure.ClearSessionNUserData();
				secure.RedirectToLoginPage();
				return;
			}
		});
		
		var clientID = secure.GetSessionID();
		
		var submitData = {"Session": clientID};
		submitData.Action = "Logout";

		var jqxhr = $.ajax({
		  type: 'POST',
		  url: url+'/model/ConnectionManager.php',
		  data: JSON.stringify(submitData),
		  //dataType: "json", // [xml, json, script, or html]
		  dataType: "html",
		});
		jqxhr.done(function (data, textStatus, jqXHR) {
			secure.ClearSessionNUserData();
			alert("logout success");
			secure.RedirectToLoginPage();
		});
		jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
		  console.log("jqxhr.fail, recevied (jqXHR, textStatus, errorThrown)")
		  console.log("textStatus: " + textStatus);
		  console.log(jqXHR);
		  console.log(errorThrown);
	
		});
		jqxhr.always(function (data_or_JqXHR, textStatus, jqXHR_or_errorThrown) {
		});
	}

	secure.ClearSessionNUserData = function(){
		$jqCookies.Remove("SessionID");
		$jqCookies.Remove("LoginData");
		return true;
	}

	secure.IsSystemField = function(fieldName){

        var isSystemField = false;

        switch (fieldName)
        {
            // skill these colummn
            case "Line":
            case "UserAccessGroups":
            case "UserGroups":
            case "Used":
            case "SysLastUpdateUser":
            case "SysLastUpdateDate":
            case "SysLastUpdatePgm":
            case "CreateDate":
            case "CreateUser":
            case "LastUpdateUser":
            case "LastUpdateDate":
                isSystemField = true;
                break;
        }

        return isSystemField;
	}
}]);

app.service('CookiesManager', function($rootScope, $cookies) {
	var cookies = this;
	var rootScope = $rootScope;
   
	cookies.Save = function(name, value){
		//Define lifetime of the cookie. Value can be a Number which will be interpreted as days from time of creation or a Date object. If omitted, the cookie becomes a session cookie.
		var expiryDay = 1;
		
		//Define the path where the cookie is valid. By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior). If you want to make it available for instance across the entire domain use path: '/'. Default: path of page where the cookie was created.
		$.cookie(name, value, { expires: expiryDay, path: '/' });
	}
	cookies.Read = function(name){
		var value;
		value = $.cookie(name);
		return value;
	}
	cookies.Remove = function(name){
		var removeStatus = $.removeCookie(name, { path: '/' });
		return removeStatus;
	}
	cookies.RemoveAllCookies = function(){
		var allCookies = $.cookie();
		for(var key in allCookies){
			var removeResultDesc = "Remove cookies: "+key;
			var removeStatus = $.removeCookie(key);
			removeResultDesc += removeStatus;
			console.log(removeResultDesc);
		}
	}
	cookies.PrintAllCookies = function(){
		var allCookies = $.cookie();
		var cooliesAsJsonText = JSON.stringify(allCookies, null, 4);
		console.dir(allCookies);
		console.log(cooliesAsJsonText);
	}
});