(function () {
  "use strict";

  var pages = [
    {
      alt: "雨の森で、黒い羽を見つめる小さなカラスの子コクラ",
      lines: [
        "もりのなかに、ちいさな からすの こ「コクラ」が いました。",
        "あさから、ぽつ、ぽつ、ぽつ。あめが ふってきました。",
        "となりの きの うえでは、いろとりどりの ことりたちが、うれしそうに うたを うたっています。",
        "コクラは、じぶんの まっくろな はねを みて、すこし さみしくなりました。",
        "「ぼくの はねは、まっくろで つまらないなあ」"
      ]
    },
    {
      alt: "雨が強くなる森で、平気そうに枝にとまるコクラ",
      lines: [
        "ザー、ザー、ザー。あめが つよくなってきました。",
        "つめたい あめのかぜが、もりの なかを ふきぬけます。",
        "「つめたいよう」「はねが ぬれちゃう」",
        "カラフルな ことりたちは、ちいさな すの なかに まあるくなって、ふるえています。",
        "でも、コクラは なぜか ぜんぜん へいきでした。"
      ]
    },
    {
      alt: "羽の上を転がる雨粒を不思議そうに見るコクラ",
      lines: [
        "コクラは ふしぎに おもいました。",
        "どうして ぼくだけ ぬれないんだろう？",
        "ちょこんと くびを かたむけて、じぶんの くろい はねを じっと みつめます。",
        "はねに あたった あめつぶが、ころころ ころんで、ぽたんと おちていきました。"
      ]
    },
    {
      alt: "雨にぬれて震える黄色い鳥を心配そうに見るコクラ",
      lines: [
        "そのとき、コクラの めに、となりの えだに とまった ちいさな とりが みえました。",
        "きいろい はねが、びしょびしょ。ぷるぷる、ぷるぷる、ふるえています。",
        "「さむいのかな……」",
        "コクラは そっと、となりの えだに とびうつりました。"
      ]
    },
    {
      alt: "小さな翼を広げ、黄色い鳥を雨から守るコクラ",
      lines: [
        "コクラは ゆっくり、くろい つばさを ひろげました。",
        "ざあ、と かぜが ふきました。でも、きいろい とりには あめが あたりません。",
        "「あったかい……」きいろい とりが つぶやきました。",
        "コクラの むねに、ぽわっと した ものが ひろがりました。"
      ]
    },
    {
      alt: "翼の上でガラス玉のように光る雨粒を見つめるコクラ",
      lines: [
        "コクラは ふと、じぶんの はねを みました。",
        "つめたい あめが、はねの うえを ころころと すべっていきます。",
        "まるで、ちいさな ガラスの たまの ようです。",
        "コクラの はねは、ちっとも ぬれていませんでした。"
      ]
    },
    {
      alt: "コクラの翼を魔法の傘みたいと喜ぶ黄色い鳥",
      lines: [
        "「わあ、すごい！」きいろい とりが、めを まあるく して さけびました。",
        "「コクラの つばさは、まほうの かさ みたいだね！」"
      ]
    },
    {
      alt: "集まってきた森の鳥たちのために翼を広げるコクラ",
      lines: [
        "つぎつぎに、もりの とりたちが あつまって きました。",
        "あおい くちばしの とり、ちゃいろい はねの とり。",
        "「コクラ、ぼくたちも いれて おくれよ」",
        "コクラは だまって、もっと つばさを ひろげました。"
      ]
    },
    {
      alt: "コクラの翼の下で暖かそうに集まる森の鳥たち",
      lines: [
        "コクラの おおきな つばさの した。みんなで まあるくなって、あめが やむのを まちました。",
        "ざあざあ、と つめたい あめが ふるけれど、",
        "コクラの つばさの したは、とても あたたかかったです。"
      ]
    },
    {
      alt: "雨上がりの森にかかる大きな虹",
      lines: [
        "やがて、あめが やみました。",
        "くもの すきまから、きらきらと ひかりが さしこみます。",
        "みあげると、もりの うえに おおきな にじが かかっていました。"
      ]
    },
    {
      alt: "虹の空へ飛び立つ鳥たちを見送るコクラ",
      lines: [
        "とりたちは うれしそうに はねばたき、",
        "「コクラ、ありがとう！」と、つぎつぎに そらへ とびたっていきました。",
        "コクラは ぽつんと、みおくっていました。"
      ]
    },
    {
      alt: "光を浴びて青紫に輝く自分の翼をうれしそうに見るコクラ",
      lines: [
        "コクラは じぶんの くろい つばさを みつめました。",
        "ひかりを あびた つばさは、ほんのり あおく、うつくしく かがやいています。",
        "コクラは、つぎの あめのひが すこし たのしみに なりました。"
      ]
    }
  ];

  var current = 0;
  var image = document.getElementById("page-image");
  var story = document.getElementById("story-text");
  var currentLabel = document.getElementById("current-page");
  var totalLabel = document.getElementById("total-pages");
  var progress = document.getElementById("progress-bar");
  var prev = document.getElementById("prev-btn");
  var next = document.getElementById("next-btn");
  var pageList = document.getElementById("page-list");

  function pad(number) { return String(number).padStart(2, "0"); }

  function render() {
    var page = pages[current];
    image.src = "illustrations/page" + (current + 1) + ".jpg";
    image.alt = page.alt;
    story.replaceChildren();
    page.lines.forEach(function (line) {
      var paragraph = document.createElement("p");
      paragraph.textContent = line;
      story.appendChild(paragraph);
    });
    currentLabel.textContent = pad(current + 1);
    totalLabel.textContent = pad(pages.length);
    progress.style.width = ((current + 1) / pages.length * 100) + "%";
    prev.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    next.textContent = current === pages.length - 1 ? "おしまい" : "次のページ →";
    Array.from(pageList.children).forEach(function (button, index) {
      button.classList.toggle("active", index === current);
      button.setAttribute("aria-current", index === current ? "page" : "false");
    });
  }

  pages.forEach(function (_, index) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "page-dot";
    button.textContent = pad(index + 1);
    button.setAttribute("aria-label", (index + 1) + "ページ目へ");
    button.addEventListener("click", function () { current = index; render(); });
    pageList.appendChild(button);
  });

  prev.addEventListener("click", function () { if (current > 0) { current -= 1; render(); } });
  next.addEventListener("click", function () { if (current < pages.length - 1) { current += 1; render(); } });
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && current > 0) { current -= 1; render(); }
    if (event.key === "ArrowRight" && current < pages.length - 1) { current += 1; render(); }
  });

  render();
}());
