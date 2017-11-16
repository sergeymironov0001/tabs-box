chrome.browserAction.onClicked.addListener(function(activeTab)
{
    // var newURL = "http://www.youtube.com/";
    // chrome.tabs.create({ url: newURL });

       chrome.tabs.create({
            'url': chrome.extension.getURL('popup.html')
       });        
});