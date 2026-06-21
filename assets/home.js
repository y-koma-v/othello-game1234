(function () {
  "use strict";

  var data = window.UGOU_HOME;
  var worksGrid = document.getElementById("works-grid");
  var channelsGrid = document.getElementById("channels-grid");

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderWorks() {
    if (!data || !Array.isArray(data.works) || !worksGrid) return;

    data.works.forEach(function (work) {
      var card = element("a", "work-card tone-" + work.tone);
      card.href = work.href;

      var top = element("div", "work-card-top");
      var identity = element("span", "work-identity", work.number + " / " + work.kind);
      var arrow = element("span", "card-arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      top.appendChild(identity);
      top.appendChild(arrow);

      var body = element("div", "work-card-body");
      var title = element("h3", "work-title", work.title);
      var summary = element("p", "work-summary", work.summary);
      body.appendChild(title);
      body.appendChild(summary);

      var footer = element("div", "work-card-footer");
      footer.appendChild(element("span", "work-action", work.action));
      if (work.date) footer.appendChild(element("time", "work-date", work.date));

      card.appendChild(top);
      card.appendChild(body);
      card.appendChild(footer);
      worksGrid.appendChild(card);
    });
  }

  function renderChannels() {
    if (!data || !Array.isArray(data.channels) || !channelsGrid) return;

    data.channels.forEach(function (channel) {
      var card = element("a", "channel-card");
      card.href = channel.href;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", channel.name + "で" + channel.label + "（外部サイト）");

      var mark = element("span", "channel-mark", channel.mark);
      mark.setAttribute("aria-hidden", "true");
      var copy = element("span", "channel-copy");
      copy.appendChild(element("strong", "channel-name", channel.name));
      copy.appendChild(element("span", "channel-label", channel.label));
      var arrow = element("span", "channel-arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");

      card.appendChild(mark);
      card.appendChild(copy);
      card.appendChild(arrow);
      channelsGrid.appendChild(card);
    });
  }

  renderWorks();
  renderChannels();

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}());
