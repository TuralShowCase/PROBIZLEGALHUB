/**
 * TEAM PAGE - UNIQUE JAVASCRIPT (team.js)
 * Page-specific functionality only. Shared code is in ../common/general.js
 */

"use strict";

window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// TEAM MODULE
// =============================================================================
PROBIZ.team = (function () {
  // Compute relative path to /images/ from the current page depth
  const _imgBase = (function () {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const langIdx = parts.findIndex(p => ['az', 'en', 'ru'].includes(p));
    if (langIdx === -1) return '/images/';
    return '../'.repeat(parts.length - langIdx) + 'images/';
  })();

  // Simple HTML sanitizer to prevent XSS
  const _sanitize = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    div
      .querySelectorAll("script, [onload], [onerror], [onclick], [onmouseover]")
      .forEach((el) => el.remove());
    return div.innerHTML;
  };

  // Translation helper — falls back to az if key missing in current lang
  const _t = (key) => {
    if (typeof PROBIZ.translations === "undefined" || typeof PROBIZ.i18n === "undefined") return key;
    const lang = PROBIZ.i18n.getLang();
    const dict = PROBIZ.translations[lang];
    if (dict && dict[key] !== undefined) return dict[key];
    const az = PROBIZ.translations.az;
    return (az && az[key] !== undefined) ? az[key] : key;
  };

  // Team Data — roleKey / practiceKeys / bioKey map to translation keys
  const teamData = {
    "zeynalov-elsen": {
      name: "Zeynalov Elşən Elxan oğlu",
      shortName: "Zeynalov Elşən",
      role: "Direktor | Vəkil",
      roleKey: "team.role_director",
      img: _imgBase + "Zeynalov Elşən.avif",
      objectPosition: "center 25%",
      practice: ["Arbitraj hüququ", "Korporativ hüquq", "Müqavilələr hüququ"],
      practiceKeys: ["team.practice_arbitraj", "team.practice_korporativ", "team.practice_muqavile"],
      bioKey: "team.zeynalov_bio",
      bio: `
                <p>Zeynalov Elşən Elxan oğlu "PROBIZ LEGAL HUB" MMC-nin təsisçisi və baş direktoru olaraq, kommersiya və korporativ hüquq sahəsində 20 ildən artıq peşəkar təcrübəyə malikdir. Mürəkkəb arbitraj mübahisələri və müqavilə hüququ üzrə dərin ekspertizası ilə tanınan Elşən bəy, müştərilərinin biznes maraqlarını ən yüksək peşəkar standartlarla təmin edir.</p>
                <p>Şirkətlərin yaradılması, strukturlaşdırılması və kommersiya mübahisələrinin uğurlu həlli onun əsas ixtisas sahələrindəndir.</p>
            `,
      education: [
        "2013-2014 Azərbaycan Dövlət İqtisad Universiteti, Biznesin təşkili və İdarə edilməsi (MBA), Magistr",
        "1998-2002 Bakı Dövlət Universiteti, Hüquq fakultəsi, Bakalavr",
      ],
    },
    "abdullayeva-arzu": {
      name: "Abdullayeva Arzu İldırım qızı",
      shortName: "Abdullayeva Arzu",
      role: "Hüquqşünas",
      roleKey: "team.role_legal_counsel",
      img: _imgBase + "Abdullayeva Arzu.avif",
      practice: ["Hüquqi Təhlil", "Sənədlərin Tərtibi", "Məhkəmə İşinə Hazırlıq"],
      practiceKeys: ["team.practice_huquqi_tahlil", "team.practice_senedler", "team.practice_mehkeme_hazirlig"],
      bioKey: "team.abdullayeva_bio",
      bio: `
                <p>Abdullayeva Arzu İldırım qızı hüquqi sənədlərin tərtibi və məhkəmə hazırlığı üzrə ixtisaslaşmış əzmkar hüquqşünasdır. O, mülki və korporativ hüquq sahəsində sənədlərin tərtibi, məhkəməyəqədər araşdırmalar və müştəri sorğularının analizi üzrə 3 illik iş təcrübəsinə malikdir.</p>
                <p>Arzu xanım detallara verdiyi diqqət və məsuliyyətli yanaşması ilə komandanın ayrılmaz bir hissəsinə çevrilmişdir.</p>
            `,
      education: ["2018-2022 Bakı Dövlət Universiteti, Bakalavr"],
    },
    "babazade-ilqar": {
      name: "Babazadə İlqar Hacıağa oğlu",
      shortName: "Babazadə İlqar",
      role: "Kadr İşləri üzrə Ekspert",
      roleKey: "team.role_hr_expert",
      img: _imgBase + "Babazadə İlqar.avif",
      practice: ["Kadr İdarəetməsi", "Əmək Qanunvericiliyi", "İnsan Resursları"],
      practiceKeys: ["team.practice_kadr_idareetme", "team.practice_emek_qanun", "team.practice_insan_resurslari"],
      bioKey: "team.babazade_bio",
      bio: `
                <p>Babazadə İlqar Hacıağa oğlu kadr inzibatçılığı və əmək qanunvericiliyi üzrə 25 illik böyük iş təcrübəsinə malik peşəkar ekspertdir. İnsan resurslarının düzgün idarə edilməsi, işə qəbul, və əmək mübahisələrinin qanunvericilik çərçivəsində tənzimlənməsi onun fəaliyyətinin əsasını təşkil edir.</p>
                <p>O, şirkətlərdə kadr auditinin aparılması və İR sistemlərinin qurulması üzrə ixtisaslaşmışdır.</p>
            `,
      education: [
        "1999-2003 Azərbaycan Memarlıq və İnşaat Universiteti, Bakalavr",
      ],
    },
    "mammedova-sovket": {
      name: "Məmmədova Şövkət Vidadi qızı",
      shortName: "Məmmədova Şövkət",
      role: "İnsan Resursları üzrə Biznes Tərəfdaş",
      roleKey: "team.role_hr_partner",
      img: _imgBase + "Məmmədova Şövkət.avif",
      practice: ["İR Strategiyası", "Təşkilati İnkişaf", "Kadr Proseslərinin Analizi"],
      practiceKeys: ["team.practice_ir_strategiya", "team.practice_teshkilati_inkisaf", "team.practice_kadr_analiz"],
      bioKey: "team.mammedova_bio",
      bio: `
                <p>Məmmədova Şövkət Vidadi qızı şirkətin strateji məqsədlərinə uyğun olaraq insan resursları siyasətinin formalaşdırılmasına cavabdehdir. O, 20 illik peşəkar fəaliyyəti ərzində təşkilati inkişaf, kadrların idarə edilməsi və biznes tərəfdaşlığı sahəsində böyük nailiyyətlər əldə etmişdir.</p>
                <p>Şövkət xanım rəhbərlik ilə işçilər arasında körpü yaradaraq korporativ mədəniyyətin inkişafına əhəmiyyətli töhfə verir.</p>
            `,
      education: [
        "2001-2005 Azərbaycan Dövlət Pedaqoji Universiteti, Bakalavr (Fərqlənmə)",
      ],
    },
    "zeynalova-gulsen": {
      name: "Zeynalova Gülşən Zahir qızı",
      shortName: "Zeynalova Gülşən",
      role: "İnsan Resursları üzrə Menecer",
      roleKey: "team.role_hr_manager",
      img: _imgBase + "gulsen-zeynalova.avif",
      objectPosition: "center 70%",
      practice: ["İşə Qəbul Prosesi", "Heyətin Qiymətləndirilməsi", "Performans Analizi"],
      practiceKeys: ["team.practice_ise_qebul", "team.practice_heyetin_qiymet", "team.practice_performans"],
      bioKey: "team.zeynalova_bio",
      bio: `
                <p>Zeynalova Gülşən Zahir qızı heyətin planlaşdırılması, seçimi və performansa nəzarət üzrə 23 illik zəngin təcrübəyə malik peşəkar menecerdir. O, şirkətin kadr potensialının artırılmasında və istedadların cəlb edilməsində həlledici rol oynayır.</p>
                <p>Qüsursuz kommunikasiya bacarıqları ilə şirkət daxilində komanda ruhunun qorunmasına və işçi məmnuniyyətinə böyük təsir göstərir.</p>
            `,
      education: ["1999-2003 Bakı Slavyan Universiteti, Bakalavr (Fərqlənmə)"],
    },
    "eliyev-subhan": {
      name: "Əliyev Sübhan Fərmayıl oğlu",
      shortName: "Əliyev Sübhan",
      role: "Vəkil",
      roleKey: "team.role_advocate",
      img: _imgBase + "Əliyev Sübhan.avif",
      practice: ["Cinayət Hüququ", "Publik və İnzibati Hüquq", "Vergi Hüququ"],
      practiceKeys: ["team.practice_cinayat", "team.practice_publik_inzibati", "team.practice_vergi_huququ"],
      bioKey: "team.eliyev_bio",
      bio: `
                <p>Əliyev Sübhan Fərmayıl oğlu publik və inzibati hüquq, həmçinin cinayət və vergi hüququ üzrə uğurlu nəticələri olan məhkəmə vəkilidir. 20 illik iş təcrübəsi sayəsində o, ən mürəkkəb hüquqi vəziyyətlərdə belə müştərilərinin maraqlarını dərindən qorumağı bacarır.</p>
                <p>Sübhan bəyin analitik xüsusiyyətləri məhkəmə zalında strategiyanın qüsursuz icrasına şərait yaradır.</p>
            `,
      education: [
        "2012–2018: Bakı Dövlət Universiteti, Konstitusiya hüququ kafedrası, Doktorantura",
        "2005–2010: Bakı Dövlət Universiteti, Konstitusiya hüququ kafedrası, Aspirantura",
        "2003-2005 Bakı Dövlət Universiteti, Magistratura",
        "2002 Bakı Dövlət Universiteti, Bakalavr",
      ],
      scientificAchievementKeys: ["team.scientific_degree", "team.scientific_title"],
    },
    "memmedli-lale": {
      name: "Məmmədli Lalə Firdovsi qızı",
      shortName: "Məmmədli Lalə",
      role: "Vəkil",
      roleKey: "team.role_advocate",
      img: _imgBase + "lale-memmedova.avif",
      practice: ["Ailə Hüququ", "Gömrük Hüququ", "Publik və İnzibati Hüquq"],
      practiceKeys: ["team.practice_aile", "team.practice_gomruk", "team.practice_publik_inzibati"],
      bioKey: "team.memmedli_bio",
      bio: `
                <p>Məmmədli Lalə Firdovsi qızı ailə, əmək, gömrük və publik hüquq sahələrində yüksək savadı və təcrübəsi ilə fərqlənən gənc, lakin iddialı vəkildir. 5 illik iş təcrübəsinə baxmayaraq, o, öz akademik biliklərini praktikada məharətlə tətbiq edərək bir çox çətin işləri uğurla tamamlamışdır.</p>
                <p>Elmi dərəcəyə doğru irəliləyən Lalə xanım, hər bir müraciətə fərdi və detallı yanaşması ilə müştərilərin etimadını qazanır.</p>
            `,
      education: [
        "Bakı Dövlət Universiteti, Doktorantura",
        "Bakı Dövlət Universiteti, Dövlət Hüququ Magistratura (Fərqlənmə)",
        "Bakı Dövlət Universiteti, Bakalavr (Fərqlənmə)",
      ],
    },
    "esgerov-xaliq": {
      name: "Əsgərov Xaliq Fərman oğlu",
      shortName: "Əsgərov Xaliq",
      role: "Vəkil",
      roleKey: "team.role_advocate",
      img: _imgBase + "Əskərov Xaliq.avif",
      practice: ["Ailə Hüququ", "Cinayət Hüququ", "Əmək və Əmlak Hüququ"],
      practiceKeys: ["team.practice_aile", "team.practice_cinayat", "team.practice_emek_emlak"],
      bioKey: "team.esgerov_bio",
      bio: `
                <p>Əsgərov Xaliq Fərman oğlu müvəffəqiyyətlə başa çatan çoxsaylı mülki, əmlak, ailə və əmək mübahisələri ilə tanınan güclü təcrübəyə malik vəkildir. Onun 24 illik iş stajı qanunvericiliyin bütün incəliklərinə bələd olduğunu təsdiqləyir.</p>
                <p>O cümlədən cinayət, publik və inzibati hüquq sahələrində də proaktiv müdafiə üsullarını tətbiq edərək, məhkəmə proseslərində üstünlük əldə etməyin yollarını dəqiq bilir.</p>
            `,
      education: [
        "Bakı Dövlət Universiteti, Dövlət Hüququ, Magistr",
        "2002 Bakı Dövlət Universiteti, Bakalavr",
      ],
    },
  };

  let modal;
  let modalEl;
  let modalImg;
  let modalRole;
  let modalName;
  let modalBio;
  let modalEducation;
  let modalScientificTitle;
  let modalScientificAchievements;

  const init = () => {
    _renderTeamCards();

    modalEl = document.getElementById("teamModal");
    if (!modalEl) return;

    modal = new bootstrap.Modal(modalEl);
    modalImg = document.getElementById("modalImg");
    modalRole = document.getElementById("modalRole");
    modalName = document.getElementById("modalName");
    modalBio = document.getElementById("modalBio");
    modalEducation = document.getElementById("modalEducation");
    modalScientificTitle = document.getElementById("modalScientificTitle");
    modalScientificAchievements = document.getElementById("modalScientificAchievements");

    _bindEvents();
    _animateHero();
    _animateGrid();
    _handleInitialHash();

    // Re-render cards when language changes
    document.addEventListener("plh:langChange", () => {
      _renderTeamCards();
      _bindCardEvents();
    });
  };

  const _renderTeamCards = () => {
    const container = document.getElementById("team-grid-container");
    if (!container) return;

    let html = "";
    Object.keys(teamData).forEach((id) => {
      const data = teamData[id];
      const role = _t(data.roleKey);
      const viewBioText = _t("team.view_bio");
      const practiceHtml = data.practiceKeys.map((key) => `
        <div class="practice-item">
          <i class="bi bi-check-circle-fill"></i> ${_t(key)}
        </div>
      `).join("");

      const objectPositionHtml = data.objectPosition ? `style="object-position: ${data.objectPosition};"` : "";

      html += `
        <div class="col-lg-4 col-md-6" id="${id}">
          <div class="team-card shadow-sm h-100 team-card-trigger" data-id="${id}">
            <div class="team-img-container">
              <img
                src="${data.img}"
                alt="${data.shortName} — ${role}"
                loading="lazy"
                ${objectPositionHtml}
              />
            </div>
            <div class="team-card-body">
              <span class="team-role">${role}</span>
              <h3 class="team-name">${data.shortName}</h3>
              <div class="practice-list">
                ${practiceHtml}
              </div>
              <span class="btn-link-custom view-bio-btn" aria-label="${data.shortName} haqqında tam bioqrafiyanı oxuyun">
                ${viewBioText} <i class="bi bi-arrow-right"></i>
              </span>
              <div class="team-accent-line"></div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const _bindCardEvents = () => {
    const triggers = document.querySelectorAll(".team-card-trigger");
    triggers.forEach((card) => {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");

      const handler = (e) => {
        e.preventDefault();
        const id = card.getAttribute("data-id");
        _openModal(id);
      };

      card.addEventListener("click", handler);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler(e);
        }
      });
    });
  };

  const _animateHero = () => {
    if (typeof gsap === "undefined") return;
    gsap.fromTo(
      ".animate-fade-up",
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      },
    );
  };

  const _bindEvents = () => {
    _bindCardEvents();

    const whatsappBtn = document.querySelector(".mobile-whatsapp-sticky");

    // Smooth scroll state for the modal info column (desktop mouse wheel)
    let _scrollTarget = 0;
    let _scrollRaf = null;

    // Touch scroll state for mobile
    let _touchStartY = 0;

    const _animateInfoCol = (infoCol) => {
      const dist = _scrollTarget - infoCol.scrollTop;
      if (Math.abs(dist) < 0.5) {
        infoCol.scrollTop = _scrollTarget;
        _scrollRaf = null;
        return;
      }
      infoCol.scrollTop += dist * 0.12; // lerp factor — tweak for faster/slower feel
      _scrollRaf = requestAnimationFrame(() => _animateInfoCol(infoCol));
    };

    // Intercept every wheel event on the modal overlay (covers full viewport).
    // stopPropagation stops Lenis on window; preventDefault stops native page scroll.
    // deltaY updates a target position; RAF loop lerps scrollTop toward it smoothly.
    const _onModalWheel = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const infoCol = modalEl.querySelector(".modal-info-col");
      if (!infoCol) return;
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 24;
      if (e.deltaMode === 2) delta *= infoCol.clientHeight;
      const maxScroll = infoCol.scrollHeight - infoCol.clientHeight;
      _scrollTarget = Math.max(0, Math.min(_scrollTarget + delta, maxScroll));
      if (!_scrollRaf) _scrollRaf = requestAnimationFrame(() => _animateInfoCol(infoCol));
    };

    // Touch handlers — route touchmove anywhere on the modal to the info col
    const _onModalTouchStart = (e) => {
      _touchStartY = e.touches[0].clientY;
    };

    const _onModalTouchMove = (e) => {
      const infoCol = modalEl.querySelector(".modal-info-col");
      if (!infoCol) return;
      const delta = _touchStartY - e.touches[0].clientY;
      _touchStartY = e.touches[0].clientY;
      const maxScroll = infoCol.scrollHeight - infoCol.clientHeight;
      if (maxScroll <= 0) return; // nothing to scroll — let browser handle
      e.preventDefault();
      infoCol.scrollTop = Math.max(0, Math.min(infoCol.scrollTop + delta, maxScroll));
    };

    modalEl.addEventListener("shown.bs.modal", () => {
      if (whatsappBtn) whatsappBtn.style.display = "none";
      const infoCol = modalEl.querySelector(".modal-info-col");
      _scrollTarget = infoCol ? infoCol.scrollTop : 0; // sync target to current position
      modalEl.addEventListener("wheel", _onModalWheel, { passive: false });
      modalEl.addEventListener("touchstart", _onModalTouchStart, { passive: true });
      modalEl.addEventListener("touchmove", _onModalTouchMove, { passive: false });
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
      if (whatsappBtn) whatsappBtn.style.display = "";
      modalEl.removeEventListener("wheel", _onModalWheel);
      modalEl.removeEventListener("touchstart", _onModalTouchStart);
      modalEl.removeEventListener("touchmove", _onModalTouchMove);
      if (_scrollRaf) { cancelAnimationFrame(_scrollRaf); _scrollRaf = null; }
    });
  };

  const _openModal = (id) => {
    const data = teamData[id];
    if (!data) return;

    modalImg.src = data.img;
    modalImg.style.objectPosition = data.objectPosition || "center";
    modalImg.alt = data.name;
    modalRole.textContent = _t(data.roleKey);
    modalName.textContent = data.name;
    modalBio.innerHTML = _sanitize(_t(data.bioKey) || data.bio);

    modalEducation.innerHTML = "";
    if (data.education) {
      data.education.forEach((edu) => {
        const li = document.createElement("li");
        li.textContent = edu;
        modalEducation.appendChild(li);
      });
    }

    if (modalScientificAchievements && modalScientificTitle) {
      const achievementKeys = data.scientificAchievementKeys;
      if (achievementKeys && achievementKeys.length > 0) {
        modalScientificTitle.style.display = "block";
        modalScientificAchievements.style.display = "block";
        modalScientificAchievements.innerHTML = "";
        achievementKeys.forEach((key) => {
          const li = document.createElement("li");
          li.textContent = _t(key);
          modalScientificAchievements.appendChild(li);
        });
      } else {
        modalScientificTitle.style.display = "none";
        modalScientificAchievements.style.display = "none";
        modalScientificAchievements.innerHTML = "";
      }
    }

    modal.show();

    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        modalImg,
        { scale: 1.1, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
      );
      tl.fromTo(
        ".modal-info-col > *",
        { y: 25, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3",
      );
    }
  };

  const _animateGrid = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = document.querySelectorAll(".team-card");

    gsap.fromTo(
      cards,
      { y: 100, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".team-grid-section",
          start: "top 80%",
        },
      },
    );
  };

  const _handleInitialHash = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#")) {
      const id = hash.substring(1);
      if (teamData[id]) {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            _openModal(id);
          }
        }, 500);
      }
    }
  };

  return { init };
})();

// =============================================================================
// INITIALIZATION
// =============================================================================

/* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  PROBIZ.team.init();
});
