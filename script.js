"use strict";

/* ---------- 1. ELEMENTS & KATB KETAB DETAILS ---------- */

const body = document.body;

const opening = document.getElementById("opening");
const openInvitationButton = document.getElementById("openInvitation");

const musicButton =
    document.getElementById("musicButton") ||
    document.getElementById("musicToggle");

const weddingMusic = document.getElementById("weddingMusic");

const calendarDays = document.getElementById("calendarDays");

const calendarButton =
    document.getElementById("calendarButton") ||
    document.getElementById("addToCalendar");

const countdownMessage =
    document.getElementById("countdownMessage") ||
    document.querySelector(".countdown-message");

const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const KATB_KETAB = {
    groom: "Mohamed",
    bride: "Dina",
    date: "2026-10-30",
    time: "19:00",
    venue: "قاعة النور بجوار مسجد آل رشدان",
    location: "قاعة النور بجوار مسجد آل رشدان، مدينة نصر، القاهرة، مصر",
    formspreeEndpoint: "https://formspree.io/f/xkjoyaob"
};


/* ---------- 2. OPENING EXPERIENCE ---------- */

function openInvitation() {
    if (!opening || opening.classList.contains("is-opening")) {
        return;
    }

    opening.classList.add("is-opening");
    body.classList.remove("is-loading");

    window.setTimeout(() => {
        opening.style.display = "none";

        if (hero) {
            hero.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }
    }, reducedMotion ? 50 : 1100);

    // تشغيل الموسيقى بعد تفاعل المستخدم مع الدعوة.
    playMusic();
}

if (openInvitationButton) {
    openInvitationButton.addEventListener("click", openInvitation);
}


/* ---------- 3. MUSIC PLAYER ---------- */

function updateMusicButton(isPlaying) {
    if (!musicButton) return;

    musicButton.classList.toggle("playing", isPlaying);
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.setAttribute(
        "aria-label",
        isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"
    );

    musicButton.title = isPlaying
        ? "إيقاف الموسيقى"
        : "تشغيل الموسيقى";

    const icon = document.getElementById("musicIcon");
    const label = document.getElementById("musicLabel");

    if (icon) {
        icon.textContent = isPlaying ? "Ⅱ" : "♫";
    }

    if (label) {
        label.textContent = isPlaying
            ? "إيقاف الموسيقى"
            : "تشغيل الموسيقى";
    }
}

async function playMusic() {
    if (!weddingMusic || !musicButton) return;

    try {
        await weddingMusic.play();
        updateMusicButton(true);
    } catch (error) {
        updateMusicButton(false);

        console.info(
            "تعذر تشغيل الموسيقى. تأكد من وجود الملف music/wedding.mp3.",
            error
        );
    }
}

function pauseMusic() {
    if (!weddingMusic) return;

    weddingMusic.pause();
    updateMusicButton(false);
}

if (musicButton && weddingMusic) {
    musicButton.addEventListener("click", () => {
        if (weddingMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    weddingMusic.addEventListener("play", () => {
        updateMusicButton(true);
    });

    weddingMusic.addEventListener("pause", () => {
        updateMusicButton(false);
    });

    weddingMusic.addEventListener("ended", () => {
        updateMusicButton(false);
    });

    weddingMusic.addEventListener("error", () => {
        updateMusicButton(false);
        console.warn("تعذر تحميل ملف الموسيقى. راجع مسار الملف.");
    });
}


/* ---------- 4. COUNTDOWN ---------- */

// الجمعة 30 أكتوبر 2026، الساعة 7 مساءً بتوقيت القاهرة.
// استخدام offset +02:00 يحدد الموعد صراحةً دون الاعتماد على توقيت الجهاز.
const katbKetabDate = new Date(
    "2026-10-30T19:00:00+02:00"
).getTime();

const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

function padNumber(value) {
    return String(value).padStart(2, "0");
}

function updateCountdown() {
    const difference = katbKetabDate - Date.now();

    if (difference <= 0) {
        Object.values(countdownElements).forEach((element) => {
            if (element) element.textContent = "00";
        });

        if (countdownMessage) {
            countdownMessage.textContent =
                "النهارده يوم كتب كتاب محمد ودينا ❤️ ربنا يتمم لنا على خير.";
        }

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    if (countdownElements.days) {
        countdownElements.days.textContent = padNumber(days);
    }

    if (countdownElements.hours) {
        countdownElements.hours.textContent = padNumber(hours);
    }

    if (countdownElements.minutes) {
        countdownElements.minutes.textContent = padNumber(minutes);
    }

    if (countdownElements.seconds) {
        countdownElements.seconds.textContent = padNumber(seconds);
    }
}

updateCountdown();
window.setInterval(updateCountdown, 1000);


/* ---------- 5. OCTOBER 2026 CALENDAR ---------- */

function createCalendar() {
    if (!calendarDays || calendarDays.dataset.created === "true") {
        return;
    }

    calendarDays.dataset.created = "true";

    const year = 2026;
    const month = 9; // October; January = 0.

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // ترتيب الأيام يبدأ بالاثنين.
    const mondayStart = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < mondayStart; i++) {
        const emptyCell = document.createElement("span");
        emptyCell.className = "empty";
        emptyCell.setAttribute("aria-hidden", "true");
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");
        dayElement.textContent = String(day);

        if (day === 30) {
            dayElement.classList.add("wedding-day");
            dayElement.setAttribute(
                "aria-label",
                "October 30, 2026 — Mohamed and Dina's Katb Ketab"
            );
            dayElement.setAttribute(
                "title",
                "كتب كتاب محمد ودينا — الجمعة 30 أكتوبر 2026"
            );
        } else {
            dayElement.setAttribute(
                "aria-label",
                `October ${day}, ${year}`
            );
        }

        calendarDays.appendChild(dayElement);
    }
}

createCalendar();


/* ---------- 6. ADD KATB KETAB TO GOOGLE CALENDAR ---------- */

if (calendarButton) {
    calendarButton.addEventListener("click", () => {
        const title = "Mohamed & Dina — Katb Ketab";

        // موعد كتب الكتاب: 7 مساءً إلى 9 مساءً.
        const start = "20261030T190000";
        const end = "20261030T210000";

        const details = [
            "دعوة لحضور كتب كتاب محمد ودينا",
            "التاريخ: الجمعة 30 أكتوبر 2026",
            "الوقت: الساعة 7 مساءً بتوقيت القاهرة",
            "المكان: قاعة النور بجوار مسجد آل رشدان، مدينة نصر، القاهرة"
        ].join("\n");

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: title,
            dates: `${start}/${end}`,
            location: KATB_KETAB.location,
            details,
            ctz: "Africa/Cairo"
        });

        const googleCalendarUrl =
            "https://calendar.google.com/calendar/render?" +
            params.toString();

        window.open(
            googleCalendarUrl,
            "_blank",
            "noopener,noreferrer"
        );
    });
}


/* ---------- 7. GUEST MESSAGES — FORMSPREE ---------- */

function addGuestMessageStyles() {
    if (document.getElementById("guest-message-styles")) return;

    const style = document.createElement("style");
    style.id = "guest-message-styles";

    style.textContent = `
        .guest-wishes-section {
            position: relative;
            padding: clamp(70px, 10vw, 120px) 18px;
            background: #f8f5ef;
            color: #183b5b;
            text-align: center;
            overflow: hidden;
        }

        .guest-wishes-inner {
            width: min(100%, 650px);
            margin: 0 auto;
        }

        .guest-wishes-kicker {
            margin-bottom: 14px;
            color: #9e7a3e;
            font: 600 9px/1.8 Montserrat, sans-serif;
            letter-spacing: .15em;
        }

        .guest-wishes-title {
            margin-bottom: 16px;
            color: #183b5b;
            font: 400 clamp(38px, 7vw, 60px)/1.1 "Cormorant Garamond", Georgia, serif;
        }

        .guest-wishes-description {
            max-width: 480px;
            margin: 0 auto 30px;
            color: #857f76;
            font: 400 15px/2 Cairo, sans-serif;
        }

        .guest-wishes-form {
            display: grid;
            gap: 15px;
            padding: clamp(20px, 5vw, 35px);
            border: 1px solid rgba(158, 122, 62, .45);
            background: rgba(255, 253, 249, .85);
            text-align: right;
            box-shadow: 0 20px 55px rgba(54, 49, 39, .06);
        }

        .guest-wishes-form label {
            display: block;
            margin-bottom: 7px;
            color: #183b5b;
            font: 500 13px/1.8 Cairo, sans-serif;
        }

        .guest-wishes-form input,
        .guest-wishes-form textarea {
            display: block;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            padding: 13px 14px;
            border: 1px solid rgba(158, 122, 62, .35);
            border-radius: 0;
            outline: none;
            color: #183b5b;
            background: #fffdf9;
            font: 400 14px/1.8 Cairo, sans-serif;
            transition: border-color .2s ease, box-shadow .2s ease;
        }

        .guest-wishes-form input:focus,
        .guest-wishes-form textarea:focus {
            border-color: #9e7a3e;
            box-shadow: 0 0 0 3px rgba(198, 166, 107, .14);
        }

        .guest-wishes-form textarea {
            min-height: 125px;
            resize: vertical;
        }

        .guest-wishes-submit {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-height: 48px;
            padding: 12px 20px;
            border: 1px solid #9e7a3e;
            color: #fff;
            background: #183b5b;
            font: 600 12px/1.8 Cairo, sans-serif;
            cursor: pointer;
            transition: background .25s ease, transform .25s ease;
        }

        .guest-wishes-submit:hover {
            color: #183b5b;
            background: #e8d7ad;
            transform: translateY(-2px);
        }

        .guest-wishes-submit:disabled {
            cursor: wait;
            opacity: .65;
            transform: none;
        }

        .guest-wishes-status,
        .form-status {
            min-height: 24px;
            margin: 0;
            color: #315675;
            font: 400 13px/1.9 Cairo, sans-serif;
            text-align: center;
        }

        .guest-wishes-status.success,
        .form-status.success {
            color: #276749;
        }

        .guest-wishes-status.error,
        .form-status.error {
            color: #a12626;
        }

        @media (max-width: 480px) {
            .guest-wishes-section {
                padding-inline: 15px;
            }

            .guest-wishes-form {
                padding: 20px 15px;
            }
        }
    `;

    document.head.appendChild(style);
}

function createGuestMessageSection() {
    // استخدم نموذج HTML الموجود بدل إنشاء نموذج مكرر.
    const existingForm =
        document.getElementById("guestMessageForm") ||
        document.querySelector("[data-guest-message-form]") ||
        document.querySelector('form[action*="formspree.io"]');

    if (existingForm) {
        return existingForm;
    }

    addGuestMessageStyles();

    const section = document.createElement("section");
    section.id = "guest-wishes";
    section.className = "guest-wishes-section";

    section.innerHTML = `
        <div class="guest-wishes-inner">
            <p class="guest-wishes-kicker">A NOTE FROM YOU</p>

            <h2 class="guest-wishes-title">Your Wishes</h2>

            <p class="guest-wishes-description" dir="rtl">
                فرحتنا هتكمل بكلامكم الحلو ودعواتكم ❤️
                سيبولنا رسالة جميلة تفضل ذكرى غالية معانا.
            </p>

            <form
                id="guestMessageForm"
                class="guest-wishes-form"
                action="${KATB_KETAB.formspreeEndpoint}"
                method="POST"
                accept-charset="UTF-8"
            >
                <div>
                    <label for="guestName">اسمك</label>
                    <input
                        id="guestName"
                        name="name"
                        type="text"
                        placeholder="اكتب اسمك هنا"
                        autocomplete="name"
                        maxlength="100"
                        required
                    >
                </div>

                <div>
                    <label for="guestEmail">البريد الإلكتروني (اختياري)</label>
                    <input
                        id="guestEmail"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autocomplete="email"
                    >
                </div>

                <div>
                    <label for="guestMessage">رسالتك لمحمد ودينا</label>
                    <textarea
                        id="guestMessage"
                        name="message"
                        placeholder="اكتب تهنئتك أو دعواتك الجميلة..."
                        maxlength="2000"
                        required
                    ></textarea>
                </div>

                <input
                    type="hidden"
                    name="_subject"
                    value="رسالة تهنئة جديدة لكتب كتاب محمد ودينا"
                >

                <button class="guest-wishes-submit" type="submit">
                    <span>إرسال الرسالة</span>
                    <span aria-hidden="true">♡</span>
                </button>

                <p
                    class="guest-wishes-status"
                    id="guestMessageStatus"
                    role="status"
                    aria-live="polite"
                ></p>
            </form>
        </div>
    `;

    const finalSection =
        document.querySelector(".final") ||
        document.querySelector("#final");

    if (finalSection && finalSection.parentNode) {
        finalSection.parentNode.insertBefore(section, finalSection);
    } else {
        document.body.appendChild(section);
    }

    return section.querySelector("form");
}

function setupGuestMessageForm() {
    addGuestMessageStyles();

    const form = createGuestMessageSection();

    if (!form || form.dataset.formspreeReady === "true") return;

    form.dataset.formspreeReady = "true";
    form.action = KATB_KETAB.formspreeEndpoint;
    form.method = "POST";

    let subject = form.querySelector('[name="_subject"]');

    if (!subject) {
        subject = document.createElement("input");
        subject.type = "hidden";
        subject.name = "_subject";
        form.appendChild(subject);
    }

    subject.value = "رسالة تهنئة جديدة لكتب كتاب محمد ودينا";

    let status =
        form.querySelector("#guestMessageStatus") ||
        form.querySelector(".guest-wishes-status") ||
        form.querySelector(".form-status");

    if (!status) {
        status = document.createElement("p");
        status.className = "guest-wishes-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        form.appendChild(status);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const submitButton = form.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const originalButtonText = submitButton
            ? (
                submitButton.tagName === "INPUT"
                    ? submitButton.value
                    : submitButton.innerHTML
            )
            : "";

        status.textContent = "جاري إرسال رسالتك...";
        status.className = "guest-wishes-status";

        if (submitButton) {
            submitButton.disabled = true;

            if (submitButton.tagName === "INPUT") {
                submitButton.value = "جاري الإرسال...";
            } else {
                submitButton.textContent = "جاري الإرسال...";
            }
        }

        try {
            const response = await fetch(KATB_KETAB.formspreeEndpoint, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json"
                }
            });

            let result = {};

            try {
                result = await response.json();
            } catch (_) {
                result = {};
            }

            if (!response.ok) {
                const formErrors = Array.isArray(result.errors)
                    ? result.errors.map((item) => item.message).join(" ")
                    : "";

                throw new Error(
                    formErrors ||
                    "تعذر إرسال الرسالة. راجع البيانات وحاول مرة أخرى."
                );
            }

            status.textContent =
                "وصلت رسالتك بنجاح ❤️ شكرًا على تهنئتكم الجميلة.";

            status.className = "guest-wishes-status success";
            form.reset();

        } catch (error) {
            console.error("Formspree submission error:", error);

            status.textContent =
                "حصلت مشكلة أثناء إرسال الرسالة. اتأكد من اتصال الإنترنت وحاول تاني.";

            status.className = "guest-wishes-status error";

        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                if (submitButton.tagName === "INPUT") {
                    submitButton.value = originalButtonText;
                } else {
                    submitButton.innerHTML = originalButtonText;
                }
            }
        }
    });
}

setupGuestMessageForm();


/* ---------- 8. SCROLL REVEAL ---------- */

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* ---------- 9. FLOATING GOLDEN PETALS ---------- */

function createFloatingPetals() {
    const container = document.getElementById("floatingPetals");

    if (!container || reducedMotion) return;

    if (container.dataset.created === "true") return;
    container.dataset.created = "true";

    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    const petalCount = isSmallScreen ? 8 : 15;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement("span");

        petal.className = "petal";
        petal.setAttribute("aria-hidden", "true");

        const left = Math.random() * 100;
        const delay = Math.random() * 14;
        const duration = 10 + Math.random() * 10;
        const drift = -35 + Math.random() * 70;
        const size = 5 + Math.random() * 6;

        petal.style.left = `${left}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.4}px`;
        petal.style.setProperty("--fall-delay", `${delay}s`);
        petal.style.setProperty("--fall-duration", `${duration}s`);
        petal.style.setProperty("--drift", `${drift}px`);

        container.appendChild(petal);
    }
}

createFloatingPetals();


/* ---------- 10. SUBTLE HERO PARALLAX ---------- */

// تقليل التكبير حتى لا يتم قص الصورة أكثر من اللازم.
// التحكم النهائي في ظهور الصورة بالكامل يكون من style.css.
if (hero && heroImage && !reducedMotion) {
    let ticking = false;

    function updateHeroParallax() {
        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (rect.bottom >= 0 && rect.top <= viewportHeight) {
            const progress = Math.max(
                -1,
                Math.min(
                    1,
                    (viewportHeight - rect.top) /
                    (viewportHeight + rect.height) - 0.5
                )
            );

            const translateY = progress * 8;

            heroImage.style.transform =
                `scale(1) translate3d(0, ${translateY}px, 0)`;
        }

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (ticking) return;

        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
    }

    window.addEventListener("scroll", requestParallaxUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestParallaxUpdate, {
        passive: true
    });
}


/* ---------- 11. GOOGLE MAPS LINK ---------- */

function fixMapsLink() {
    const mapsLinks = document.querySelectorAll(
        'a.map-button, a[href*="google.com/maps"], a[href*="maps.app.goo.gl"]'
    );

    const mapsSearchUrl =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(KATB_KETAB.location);

    mapsLinks.forEach((link) => {
        // نصحح الرابط الموجود على زر الخريطة إلى قاعة النور بجوار مسجد آل رشدان.
        link.href = mapsSearchUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}

fixMapsLink();


/* ---------- 12. SAFETY FALLBACK ---------- */

if (!opening) {
    body.classList.remove("is-loading");
}
