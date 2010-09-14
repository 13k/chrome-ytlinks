var ui = {
  dialog: {
    widget: null,

    build: function(data) {
      if (ui.dialog.widget) {
        ui.dialog.widget.remove();
      }

      var text = data.join("<br/>");

      ui.dialog.widget = $("<div/>")
        .attr("title", "YTLinks")
        .append($("<p/>").append(text));

      $(document.body).append(ui.dialog.widget);

      $(ui.dialog.widget).dialog({
        autoOpen: false,
        width: 400
      });
    },

    open: function() {
      ui.dialog.widget.dialog('open');
    },

    close: function() {
      ui.dialog.widget.dialog('close');
    }
  },

  show: function(data) {
    ui.dialog.build(data);
    ui.dialog.open();
  }
};

(function() {
  if (document instanceof HTMLDocument) {
    var selection = window.getSelection();

    if (selection.rangeCount > 0) {
      var range = window.getSelection().getRangeAt(0);
      var contents = range.cloneContents();
      // sendRequest will serialize the JSON object but it can't serialize DOM
      // nodes (if they have circular references, which is almost every case).
      var html_content = $("<div/>").append(contents).html();
      var data = {
        "type": "parse_selection",
        "data": html_content
      };

      chrome.extension.sendRequest(data, function(response) {
        ui.show(response);
      });
    }
  }
})();
