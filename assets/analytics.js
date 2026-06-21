// Google Analytics 4 (GA4) - 烏合ワークス / Ugou Works
// 測定ID を1か所で管理する。変更・停止はこのファイルだけ直せばよい。
(function () {
  var GA_ID = 'G-ZJY35SY4MM';

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
