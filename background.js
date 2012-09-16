    //              // source URL                                     // resulting url
    // audible      // http://www.dpbolvw.net/click-4897915-10298646  // http://www.audible.com/?source_code=COMA0230WS012110&AID=10298646&PID=4897915  
    // mint         // http://www.tkqlhce.com/click-4897915-10789102  // https://www.mint.com/?PID=4897915&priorityCode=4216102399&source=cj_pfm
    // bestbuy      // http://www.jdoqocy.com/click-4897915-10483113  // http://www.bestbuy.com/?AID=10483113&PID=4897915&ref=39&CJPID=4897915&loc=01
    // thinkgeek    // http://www.kqzyfj.com/click-4897915-10784884   // http://www.thinkgeek.com/index.shtml?cpg=cj&ref=&CJURL=&CJID=3282554
    // newegg       // http://www.dpbolvw.net/click-4897915-10440554  // http://www.newegg.com/index.aspx?nm_mc=AFC-C8Junction&cm_mmc=AFC-C8Junction-_-Branding-_-na-_-na&AID=10440554&PID=4897915
    // amazonuk     // http://www.amazon.co.uk/?tag=jupitebroadc-21  
    // amazon       // http://www.amazon.com/?tag=thelinactsho-20
    // amazon       // http://www.amazon.de/?tag=jupitebroad02-21
    // NOTE:  Once this is finalized, you might want to STRINK/ofuscate this some how.  

    var sites = {
        amazon:     { url: "amazon.com", tag:"tag=thelinactsho-20"},
        amazonuk:   { url: "amazon.co.uk", tag:"tag=jupitebroadc-21"}, 
        amazonde:   { url: "amazon.de", tag:"tag=jupitebroad02-21"}, 
        audible:    { url: "audible.com", tag:"source_code=COMA0230WS012110&AID=10298646&PID=4897915"}, 
        mint:       { url: "mint.com", tag:"PID=4897915&priorityCode=4216102399&source=cj_pfm"},
        bestbuy:    { url: "bestbuy.com", tag:"AID=10483113&PID=4897915&ref=39&CJPID=4897915&loc=01"},
        thinkgeek:  { url: "thinkgeek.com", tag:"cpg=cj&ref=&CJURL=&CJID=3282554"},
        newegg:     { url: "newegg.com", tag:"nm_mc=AFC-C8Junction&cm_mmc=AFC-C8Junction-_-Branding-_-na-_-na&AID=10440554&PID=4897915"}
    };
    
    function addTag(info) {
        var tUrl = info.url;
        var r = { cancel: false };
        
        console.log("Inside addTag() "); 
        
        for (x in sites) { 
          if (tUrl.indexOf(sites[x].url) >= 0) { 
            if (tUrl.indexOf(sites[x].tag) == -1 ) {    
              r = { redirectUrl: tUrl+(tUrl.indexOf("?") == -1 ? "?" : "&")+sites[x].tag };
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
        
        return r;
    }

  
  if (!chrome.webRequest.onBeforeRequest.hasListener(addTag)) {   
//    var site_urls = []; 
//    for (x in sites) { 
//      site_urls.push("*://*."+sites[x].url+"/*");
//    }
    
   var site_urls = [ 
            "http://*.amazon.com/*/dp/*",
            "http://*.amazon.com/dp/*",
            "http://*.amazon.com/exec/obidos/tg/detail/*",
            "http://*.amazon.com/gp/product/*",
            "http://*.amazon.com/o/*",
            "http://*.amazon.co.uk/*/dp/*",
            "http://*.amazon.co.uk/dp/*",
            "http://*.amazon.co.uk/exec/obidos/tg/detail/*",
            "http://*.amazon.co.uk/gp/product/*",
            "http://*.amazon.co.uk/o/*",
            "http://*.amazon.de/*/dp/*",
            "http://*.amazon.de/dp/*",
            "http://*.amazon.de/exec/obidos/tg/detail/*",
            "http://*.amazon.de/gp/product/*",
            "http://*.amazon.de/o/*",
            "http://*.audible.com/*",
            "http://*.mint.com/*",
            "http://*.bestbuy.com/site/*\?id=*",
            "http://*.thinkgeek.com/*",
            "http://*.newegg.com/Product/Product.aspx\?Item=*",
            "http://*.newegg.com/Special/ShellShocker.aspx\?*"
    ];
  
    chrome.webRequest.onBeforeRequest.addListener(addTag, { urls: site_urls }, [ "blocking" ]); 
  }