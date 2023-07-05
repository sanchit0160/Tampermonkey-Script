// ==UserScript==
// @name         Quillbot Premium Unlocker
// @namespace    
// @version      0.1
// @description  Unlocks Quillbot Premium.
// @author       
// @match        https://quillbot.com/*
// @icon         https://quillbot.com/favicon.png
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        none
// @license      WTFPL
// ==/UserScript==

/*Credits - Special thanks to longkidkoolstar and cxxjackie @greasyfork*/
/* global ajaxHooker*/
(function() {
    'use strict';
    ajaxHooker.hook(request => {
        if (request.url.endsWith('get-account-details')) {
            request.response = res => {
                const json=JSON.parse(res.responseText);
                const a="data" in json?json.data:json;
                a.profile.lang = "en-US";
                a.profile.accepted_premium_modes_tnc=true;
                a.profile.ip = "";
                a.profile.location.city = "";
                a.profile.location.countryCode = "US";
                a.profile.location.postal = "";
                a.profile.premium=true;
                res.responseText=JSON.stringify("data" in json?(json.data=a,json):a);
                console.log(res.responseText);
            };
        }
    });
})();
