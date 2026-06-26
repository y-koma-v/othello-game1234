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
        "「つめたいよぅ」「はねが ぬれちゃう」",
        "カラフルな ことりたちは、ちいさな すの なかに まあるくなって、ふるえています。",
        "でも、コクラは なぜか ぜんぜん へいきでした。"
      ]
    },
    {
      alt: "羽の上を転がる雨粒を不思議そうに見るコクラ",
      lines: [
        "コクラは ふしぎに おもいました。",
        "どうして ぼくだけ ぬれないんだろう？",
        "ちょこんと くびを かたむけて、",
        "じぶんの くろい はねを じっと みつめます。",
        "はねに あたった あめつぶが、",
        "ころころ ころんで、ぽたんと おちていきました。"
      ]
    },
    {
      alt: "雨にぬれて震える黄色い鳥を心配そうに見るコクラ",
      lines: [
        "そのとき、コクラのめに",
        "となりの えだに とまった",
        "ちいさな とりが みえました。",
        "きいろい はねが、びしょびしょ。",
        "ぷるぷる ぷるぷる、ふるえています。",
        "「さむいのかな…」",
        "コクラは そっと、",
        "となりの えだに とびうつりました。"
      ]
    },
    {
      alt: "小さな翼を広げ、黄色い鳥を雨から守るコクラ",
      lines: [
        "コクラは　ゆっくり",
        "くろい つばさを　ひろげました。",
        "ざあ、と かぜが　ふきました。",
        "でも　きいろい とりには",
        "あめが　あたりません。",
        "「あったかい…」",
        "きいろい とりが　つぶやきました。",
        "コクラの むねに、",
        "ぽわっと した ものが",
        "ひろがりました。"
      ]
    },
    {
      alt: "翼の上でガラス玉のように光る雨粒を見つめるコクラ",
      lines: [
        "コクラは　ふと、",
        "じぶんの　はねを　みました。",
        "つめたい あめが、",
        "はねの うえを　ころころと",
        "すべっていきます。",
        "まるで　ちいさな",
        "ガラスの たまの ようです。",
        "コクラの はねは、",
        "ちっとも　ぬれていませんでした。"
      ]
    },
    {
      alt: "コクラの翼を魔法の傘みたいと喜ぶ黄色い鳥",
      lines: [
        "「わあ、すごい！」",
        "きいろい とりが",
        "めを まあるく して さけびました。",
        "「コクラの つばさは、",
        "まほうの かさ みたいだね！」"
      ]
    },
    {
      alt: "集まってきた森の鳥たちのために翼を広げるコクラ",
      lines: [
        "つぎつぎに、もりの とりたちが",
        "あつまって きました。",
        "あおいくちばしの とり、",
        "ちゃいろい はねの とり。",
        "「コクラ、ぼくたちも",
        "いれて おくれよ」",
        "コクラは だまって、",
        "もっと つばさを ひろげました。"
      ]
    },
    {
      alt: "コクラの翼の下で暖かそうに集まる森の鳥たち",
      lines: [
        "コクラの おおきな つばさの した。",
        "みんなで まあるくなって、",
        "あめが やむのを まちました。",
        "ざあざあ、と",
        "つめたい あめが ふるけれど、",
        "コクラの つばさの したは、",
        "とても あたたかかったです。"
      ]
    },
    {
      alt: "雨上がりの森にかかる大きな虹",
      lines: [
        "やがて、あめが やみました。",
        "くもの すきまから、",
        "きらきらと ひかりが",
        "さしこみます。",
        "みあげると、もりの うえに",
        "おおきな にじが",
        "かかっていました。"
      ]
    },
    {
      alt: "虹の空へ飛び立つ鳥たちを見送るコクラ",
      lines: [
        "とりたちは",
        "うれしそうに はねばたき、",
        "「コクラ、ありがとう！」",
        "と、つぎつぎに",
        "そらへ とびたっていきました。",
        "コクラは ぽつんと、",
        "みおくっていました。"
      ]
    },
    {
      alt: "光を浴びて青紫に輝く自分の翼をうれしそうに見るコクラ",
      lines: [
        "コクラは じぶんの",
        "くろい つばさを みつめました。",
        "ひかりを あびた つばさは、",
        "ほんのり あおく、",
        "うつくしく かがやいています。",
        "コクラは、つぎの あめのひが",
        "すこし たのしみに なりました。"
      ]
    }
  ];

  var current = 0;
  var image = document.getElementById("page-image");
  var story = document.getElementById("story-text");
  var btnPrev = document.getElementById("flip-prev");
  var btnNext = document.getElementById("flip-next");
  var card = document.querySelector(".page-card");

  function render(direction) {
    var page = pages[current];

    if (direction && card) {
      var outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
      var inClass  = direction === "next" ? "slide-in-right" : "slide-in-left";
      card.classList.add(outClass);
      setTimeout(function () {
        card.classList.remove(outClass);
        card.classList.add(inClass);
        update(page);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            card.classList.remove(inClass);
          });
        });
      }, 180);
    } else {
      update(page);
    }
  }

  function update(page) {
    image.src = "illustrations/page" + (current + 1) + ".jpg";
    image.alt = page.alt;
    story.replaceChildren();
    page.lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      story.appendChild(p);
    });
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === pages.length - 1;
    btnNext.setAttribute("aria-label", current === pages.length - 1 ? "おしまい" : "次のページ");
  }

  btnPrev.addEventListener("click", function () {
    if (current > 0) { current -= 1; render("prev"); }
  });
  btnNext.addEventListener("click", function () {
    if (current < pages.length - 1) { current += 1; render("next"); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft"  && current > 0)               { current -= 1; render("prev"); }
    if (e.key === "ArrowRight" && current < pages.length - 1) { current += 1; render("next"); }
  });

  render();
}());
