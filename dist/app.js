var Dashboard;!function(e){angular.module("dashboard",[])}(Dashboard||(Dashboard={}));var Dashboard;!function(e){var t={clientId:"eeaba47d-44e5-4529-9b5d-c19ec219a220",clientSecret:"Lgyd79HEdCpdhsR89qXaZNh",scope:"https://outlook.office.com/calendars.read",endpointOauth:"https://login.microsoftonline.com/common/oauth2/v2.0/authorize"};console.log();var n=function(){function e(e,t,n,r){var o=this;this.$http=e,this.$q=t,this.$interval=n,this.$timeout=r,this.refreshToken=localStorage.refreshToken;var a=this.getParameterByName("code");a||this.refreshToken?this.code=a:this.getCode(),this.getMeetings(),n(function(){return o.getMeetings()},6e5)}return e.prototype.getMeetings=function(){var e=this;if(this.token){var n=new Date;n.setHours(0,0,0,0);var r=new Date(n.toString());r.setDate(r.getDate()+1),this.$http.get("https://outlook.office.com/api/v2.0/me/calendarview?startDateTime="+n.toISOString()+"&endDateTime="+r.toISOString()+"&$select=IsAllDay,Start,End,Subject,Location&$orderby=Start/DateTime",{headers:{Authorization:"Bearer "+this.token}}).success(function(t){e.meetings=t.value.map(function(e){return{from:new Date(e.Start.DateTime),to:new Date(e.End.DateTime),description:e.Subject,location:e.Location.DisplayName,isAllDay:e.IsAllDay}}),e.isLoad=!0}).error(function(){e.token="",e.getMeetings()})}else this.$http.post("http://microsoftoauthproxy.azurewebsites.net/api/token",{clientId:t.clientId,clientSecret:t.clientSecret,code:this.code,refreshToken:this.refreshToken,redirectUri:location.origin}).success(function(t){e.token=t.access_token,e.refreshToken=t.refresh_token,localStorage.refreshToken=e.refreshToken,e.$timeout(3599e3).then(function(){return e.token=""}),e.getMeetings()})["catch"](function(t){400==t.statusCode&&e.getCode()})},e.prototype.getCode=function(){location.href=t.endpointOauth+"?response_type=code&client_id="+t.clientId+"&redirect_uri="+encodeURIComponent(location.origin)+"&scope="+encodeURIComponent(t.scope)+" offline_access"},e.prototype.getParameterByName=function(e){var t=window.location.href,n=new RegExp("[?&#]"+e+"(=([^&#]*)|&|#|$)"),r=n.exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null},e}(),r=function(){function e(){this.bindings={},this.templateUrl="./template/meetings.html",this.controller=["$http","$q","$interval","$timeout",n]}return e}();angular.module("dashboard").component("meetings",new r),angular.module("dashboard").filter("toHours",function(){return function(e){var t=function(e){return("0"+e).slice(-2)};return e.getHours(),t(e.getHours())+":"+t(e.getMinutes())}})}(Dashboard||(Dashboard={}));var Dashboard;!function(e){var t={apiPattern:function(e,t,n,r){return e=e.toLowerCase(),n=n.toLowerCase().replace(/\s/g,"+"),r=r.toLowerCase().replace(/\s/g,"+"),"http://api-ratp.pierre-grimaud.fr/v2/"+e+"/"+t+"/stations/"+n+"?destination="+r}},n=function(){function e(e,n){var r=this,o=function(){e.get(t.apiPattern(r.type,r.ligne,r.station,r.direction)).success(function(e){r.type=e.response.informations.type,r.station=e.response.informations.station.name,r.time=[];for(var t=0,n=e.response.schedules;t<n.length;t++){var o=n[t];r.time.push(o.message)}r.ligne=e.response.informations.line,r.isLoad=!0})};o(),n(o,2e4)}return e}(),r=function(){function e(){this.bindings={station:"@",direction:"@",ligne:"@",type:"@"},this.templateUrl="./template/nextStop.html",this.controller=["$http","$interval",n]}return e}();angular.module("dashboard").component("nextStop",new r),angular.module("dashboard").filter("schedulesToText",function(){return function(e){var t=parseInt(e);return t?"Prochain départ dans "+t+" minutes":"A l'approche"===e||"0 mn"===e?"À l'approche !":"A l'arret"===e?"À l'arrêt !":"PERTURBATIONS"===e?"Perturbations":"Service terminé"}}),angular.module("dashboard").filter("schedulesToclass",function(){return function(e){var t=parseInt(e);return t&&7>t?"close":t?"":"error"}})}(Dashboard||(Dashboard={}));var Dashboard;!function(e){var t=function(){function e(e){var t=this,n=function(){t.now=new Date};n(),e(n,1e4)}return e}(),n=function(){function e(){this.templateUrl="template/time.html",this.restrict="E",this.controller=["$interval",t]}return e}();angular.module("dashboard").filter("readableTime",function(){return function(e){var t=function(e){return("0"+e).slice(-2)},n=t(e.getHours()),r=t(e.getMinutes());return n+":"+r}}),angular.module("dashboard").component("time",new n)}(Dashboard||(Dashboard={}));var Dashboard;!function(e){var t={weatherApiKey:"f0d716b60dc56bf332a979358f824bec",weatherApiUrl:"http://api.openweathermap.org/data/2.5/weather"},n=function(){function e(e,n){var r=this,o=function(){e.get(t.weatherApiUrl,{params:{q:r.city,appid:t.weatherApiKey,units:"metric"}}).success(function(e){r.temp=e.main.temp,r.icon=e.weather[0].icon.substr(0,2),r.city=e.name,r.isLoad=!0}).error(o)};o(),n(o,6e4)}return e}(),r=function(){function e(){this.bindings={city:"@"},this.templateUrl="./template/weather.html",this.controller=["$http","$interval",n]}return e}();angular.module("dashboard").component("weather",new r),angular.module("dashboard").filter("weatherToClass",function(){return function(e){switch(e){case"11":return"icon-thunder";case"09":return"icon-drizzle";case"10":return"icon-drizzle icon-sunny";case"09":return"icon-showers";case"13":return"icon-snowy";case"50":return"icon-mist";case"01":return"icon-sun";case"02":return"icon-cloud";case"04":return"icon-cloud";case"03":return"icon-cloud";default:return""}}}),angular.module("dashboard").filter("weatherToCloudBase",function(){return function(e){switch(e){case"11":return"basethundercloud";case"09":return"basecloud";case"10":return"basecloud";case"09":return"basecloud";case"13":return"basecloud";default:return""}}})}(Dashboard||(Dashboard={}));