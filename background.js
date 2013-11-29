    //              // resulting url
    // audible      // http://www.audible.com/?source_code=COMA0230WS012110&AID=10298646&PID=4897915  
    // mint         // https://www.mint.com/?PID=4897915&priorityCode=4216102399&source=cj_pfm
    // bestbuy      // http://www.bestbuy.com/?AID=10483113&PID=4897915&ref=39&CJPID=4897915&loc=01
    // thinkgeek    // http://www.thinkgeek.com/index.shtml?cpg=cj&ref=&CJURL=&CJID=3282554
    // newegg       // http://www.newegg.com/index.aspx?nm_mc=AFC-C8Junction&cm_mmc=AFC-C8Junction-_-Branding-_-na-_-na&AID=10440554&PID=4897915
    // guitarcenter // http://www.guitarcenter.com/?CJAID=10453836&CJPID=4897915

var configurations = {
      audible : { 
        rx: /^http.*?\.audible\.com.*?\/pd\/.*/i,
        params: [
          { param: "source_code", paramValue: "COMA0230WS012110" },
          { param: "AID", paramValue: "10298646" },
          { param: "PID", paramValue: "4897915" }
        ]
      },
      mint : { 
        rx: /^http.*?\.mint\.com/i, 
        params: [
          { param: "PID", paramValue: "4897915" },
          { param: "priorityCode", paramValue: "4216102399" },
          { param: "source", paramValue: "cj_pfm" }
        ]
      },
      bestbuy : {
       rx: /^http.*?\.bestbuy\.com.*?site.*?\?id=/i, 
       params: [
         { param: "AID", paramValue: "10483113" },
         { param: "PID", paramValue: "4897915" },
         { param: "ref", paramValue: "39" },
         { param: "CJPID", paramValue: "4897915" },
         { param: "loc", paramValue: "01" }
       ]
      },
      thinkgeek : { 
        rx: /^http.*?\.thinkgeek\.com\/product\//i, 
        params: [
          { param: "cpg", paramValue: "cj" },
          { param: "ref", paramValue: "" },
          { param: "CJURL", paramValue: "" },
          { param: "CJID", paramValue: "3282554"}
        ]
      },
      neweggcom : {
       rx: /^http.*?\.newegg\.com.*?(product.product\.aspx\?item=|special.shellshocker\.aspx\?)/i,
       params: [
         { param: "nm_mc", paramValue: "AFC-C8Junction" },
         { param: "cm_mmc", paramValue: "AFC-C8Junction-_-Branding-_-na-_-na" },
         { param: "AID", paramValue: "10440554" },
         { param: "PID", paramValue: "4897915" }
       ]
      },
      neweggca : {
       rx: /^http.*?\.newegg\.ca.*?\/(product.product\.aspx\?item=|special.shellshocker\.aspx\?)/i,
       params: [
         { param: "nm_mc", paramValue: "AFC-C8junctionCA" },
         { param: "cm_mmc", paramValue: "AFC-C8JunctionCA-_-homepage-_-na-_-na" },
         { param: "AID", paramValue: "10606701" },
         { param: "PID", paramValue: "4897915" }
       ]
      },
      woot : {
       rx: /^http.*?\.woot\.com.*?\/offers\/.*/i,
       params: [
         { param: "utm_campaign", paramValue: "Commission+Junction+-+10848750" },
         { param: "utm_source", paramValue: "Commission+Junction+Publisher+-+4897915" },
         { param: "utm_medium", paramValue: "affiliate+-+Woot%21+Logo" }
       ]
      },
      guitarcenter : {
        rx: /^http.*?\.guitarcenter\.com\/.*[a-z0-9]{9}-i[a-z0-9]{7}\.gc/i, 
        params: [
          { param: "CJAID", paramValue: "10453836" },
          { param: "CJPID", paramValue: "4897915" }
        ]
      }
    };
    
    function addTag(info) {
        var tUrl = info.url;
        var r = { cancel: false };
        
        console.log("Inside addTag() "); 
        
        for ( var config in configurations) { 
          if( configurations.hasOwnProperty(config) ) {
            if (tUrl.match(configurations[config].rx) ) { 
              //gracefully acknowledge existing affiliate tags
              if (tUrl.indexOf(configurations[config].params[0].param) == -1 ) {    
                r = { redirectUrl: tUrl+(tUrl.indexOf("?") == -1 ? "?" : "&") + createTag(configurations[config].params) };
                // A supported site was found
                // get the current window
                chrome.windows.getCurrent(function (currentWindow) {
                  // get the selected tab inside the current window
                  chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs) {
                    chrome.pageAction.show(tabs[0].id);
                  });
                });
                break;
              }
            } 
          }
        }
        return r;
    }

    function createTag(params) {
      var result = "";
      for( var i = 0; i < params.length; i++ ) {
        result = result + params[i].param + "=" + params[i].paramValue;
        if( i >= 0 && i < params.length - 1 ) {
            result = result + "&";
        }
      }
      return result;
    }

  
  if (!chrome.webRequest.onBeforeRequest.hasListener(addTag)) {   
//    var site_urls = []; 
//    for (x in sites) { 
//      site_urls.push("*://*."+sites[x].url+"/*");
//    }
    
   var site_urls = [ 
            "http://*.audible.com/*",
            "http://*.mint.com/*",
            "http://*.bestbuy.com/site/*\?id=*",
            "http://*.thinkgeek.com/*",
            "http://*.newegg.com/Product/Product.aspx\?Item=*",
            "http://*.newegg.com/Special/ShellShocker.aspx\?*",
            "http://*.newegg.ca/Product/Product.aspx\?Item=*",
            "http://*.newegg.ca/Special/ShellShocker.aspx\?*",
            "http://*.guitarcenter.com/*",
            "http://*.woot.com/*"
    ];
  
    chrome.webRequest.onBeforeRequest.addListener(addTag, { urls: site_urls }, [ "blocking" ]); 
  }