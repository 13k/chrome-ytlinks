jQueryUiCustomCSS = [
  ".ui-widget-content { border: 1px solid #d9d6c4; background: #eceadf url(images/ui-bg_fine-grain_10_eceadf_60x60.png) 50% 50% repeat; color: #1f1f1f; }",
  ".ui-widget-header { border: 1px solid #d4d1bf; background: #ffffff url(images/ui-bg_fine-grain_15_ffffff_60x60.png) 50% 50% repeat; color: #453821; font-weight: bold; }",
  ".ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { border: 1px solid #cbc7bd; background: #f8f7f6 url(images/ui-bg_fine-grain_10_f8f7f6_60x60.png) 50% 50% repeat; font-weight: bold; color: #654b24; }",
  ".ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus { border: 1px solid #654b24; background: #654b24 url(images/ui-bg_fine-grain_65_654b24_60x60.png) 50% 50% repeat; font-weight: bold; color: #ffffff; }",
  ".ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active { border: 1px solid #d9d6c4; background: #eceadf url(images/ui-bg_fine-grain_15_eceadf_60x60.png) 50% 50% repeat; font-weight: bold; color: #140f06; }",
  ".ui-state-highlight, .ui-widget-content .ui-state-highlight, .ui-widget-header .ui-state-highlight  {border: 1px solid #b2a266; background: #f7f3de url(images/ui-bg_fine-grain_15_f7f3de_60x60.png) 50% 50% repeat; color: #3a3427; }",
  ".ui-state-error, .ui-widget-content .ui-state-error, .ui-widget-header .ui-state-error {border: 1px solid #681818; background: #b83400 url(images/ui-bg_fine-grain_68_b83400_60x60.png) 50% 50% repeat; color: #ffffff; }",
  ".ui-icon { width: 16px; height: 16px; background-image: url(images/ui-icons_222222_256x240.png); }",
  ".ui-widget-content .ui-icon {background-image: url(images/ui-icons_222222_256x240.png); }",
  ".ui-widget-header .ui-icon {background-image: url(images/ui-icons_b83400_256x240.png); }",
  ".ui-state-default .ui-icon { background-image: url(images/ui-icons_b83400_256x240.png); }",
  ".ui-state-hover .ui-icon, .ui-state-focus .ui-icon {background-image: url(images/ui-icons_ffffff_256x240.png); }",
  ".ui-state-active .ui-icon {background-image: url(images/ui-icons_8c291d_256x240.png); }",
  ".ui-state-highlight .ui-icon {background-image: url(images/ui-icons_3572ac_256x240.png); }",
  ".ui-state-error .ui-icon, .ui-state-error-text .ui-icon {background-image: url(images/ui-icons_fbdb93_256x240.png); }",
  ".ui-widget-overlay { background: #6e4f1c url(images/ui-bg_diagonal-maze_20_6e4f1c_10x10.png) 50% 50% repeat; opacity: .60;filter:Alpha(Opacity=60); }",
  ".ui-widget-shadow { margin: 0 0 0 -10px; padding: 5px; background: #000000 url(images/ui-bg_diagonal-maze_40_000000_10x10.png) 50% 50% repeat; opacity: .60;filter:Alpha(Opacity=60); -moz-border-radius: 18px; -webkit-border-radius: 18px; border-radius: 18px; }"
];

jQueryUiCustomCSS = $.map(jQueryUiCustomCSS, function(css) {
  var m = css.match(/url\((.*?)\)/);
  var url = chrome.extension.getURL(m[1]);
  return css.replace(/url\(.*?\)/, "url(" + url + ")");
}).join("\n");

console.log(jQueryUiCustomCSS);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.type != "parse_selection") {
    return;
  }

  var links = getYTLinks($(request.data));
  sendResponse(links);
});

chrome.contextMenus.create({
  "type": "normal",
  "title": "Get Youtube links",
  "contexts": ["selection"],
  "onclick": onYTLContextClick
});

function onYTLContextClick(info, tab) {
  chrome.tabs.executeScript(tab.id, {"file": "jquery-1.4.2.min.js"});
  chrome.tabs.executeScript(tab.id, {"file": "jquery-ui-1.8.4.custom.min.js"});
  chrome.tabs.insertCSS(tab.id, {"file": "jquery-ui-1.8.4.custom.css"});
  chrome.tabs.insertCSS(tab.id, {"code": jQueryUiCustomCSS});
  chrome.tabs.executeScript(tab.id, {"file": "tab_selection.js"});
}

function getYTLinks(doc) {
  var embed_params = doc.find("object param[name='movie'][value*='youtube']");
  var links = new Array();

  embed_params.each(function(i, e) {
    var movie_url = e.value;
    var movie_id = parseMovieURL(movie_url);
    links.push(generateYTLink(movie_id));
  });

  return links;
}

function parseMovieURL(url) {
  return url.replace(/^.*youtube\.com\/v\/([^&?]+).*/, "$1");
}

function generateYTLink(movie_id) {
  return "http://www.youtube.com/watch?v=" + movie_id;
}
