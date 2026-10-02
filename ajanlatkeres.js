document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       BEÁLLÍTÁSOK
       ======================================== */

    const WORKER_URL =
        "https://rough-thunder-293f.szivospatrikev.workers.dev/";


    /* ========================================
       DOM ELEMEK
       ======================================== */

    const form =
        document.getElementById("quoteForm");

    const formMessage =
        document.getElementById("formMessage");

    const successModal =
        document.getElementById("successModal");

    const successModalClose =
        document.getElementById("successModalClose");

    const successModalOk =
        document.getElementById("successModalOk");


    /* ========================================
       SIKERES KÜLDÉS — POPUP MEGNYITÁSA
       ======================================== */

    function openSuccessModal() {

        if (!successModal) return;

        successModal.classList.add("show");

        successModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    /* ========================================
       POPUP BEZÁRÁSA
       ======================================== */

    function closeSuccessModal() {

        if (!successModal) return;

        successModal.classList.remove(
            "show"
        );

        successModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }


    /* ========================================
       POPUP GOMBOK
       ======================================== */

    if (successModalClose) {

        successModalClose.addEventListener(
            "click",
            closeSuccessModal
        );

    }


    if (successModalOk) {

        successModalOk.addEventListener(
            "click",
            closeSuccessModal
        );

    }


    /* ========================================
       HÁTTÉRRE KATTINTÁS
       ======================================== */

    if (successModal) {

        const backdrop =
            successModal.querySelector(
                ".success-modal-backdrop"
            );

        if (backdrop) {

            backdrop.addEventListener(
                "click",
                closeSuccessModal
            );

        }

    }


    /* ========================================
       ESC BILLENTYŰ
       ======================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                successModal &&
                successModal.classList.contains("show")
            ) {

                closeSuccessModal();

            }

        }
    );


    /* ========================================
       KIVÁLASZTOTT AJÁNLATTÍPUS
       ======================================== */

    function getSelectedType() {

        if (
            form &&
            form.dataset.type === "reklam"
        ) {

            return "reklam";

        }

        return "website";
    }


    /* ========================================
       AJÁNLATKÉRÉS
       ======================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* ========================================
                   GOMB
                   ======================================== */

                const submitButton =
                    form.querySelector(
                        ".form-submit"
                    );


                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "AJÁNLATKÉRÉS ELKÜLDÉSE →";


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        document.documentElement.lang === "en"
                            ? "SENDING..."
                            : "KÜLDÉS FOLYAMATBAN...";

                }


                /* ========================================
                   HIBAÜZENET TÖRLÉSE
                   ======================================== */

                if (formMessage) {

                    formMessage.textContent = "";

                    formMessage.style.color = "";

                }


                try {

                    /* ========================================
                       FORM ADATOK
                       ======================================== */

                    const formData =
                        new FormData(form);


                    /* ========================================
                       KÖZÖS MEZŐK
                       ======================================== */

                    const nev =
                        formData.get("Név") || "-";


                    const ceg =
                        formData.get("Cég") || "-";


                    const email =
                        formData.get("Email") || "-";


                    const telefon =
                        formData.get("Telefon") || "-";


                    const projekt =
                        formData.get("Projekt leírása") || "-";


                    /* ========================================
                       AJÁNLATTÍPUS
                       ======================================== */

                    const type =
                        getSelectedType();


                    /* ========================================
                       WEBOLDAL ADATOK
                       ======================================== */

                    let csomag = "-";

                    let hatarido = "-";

                    let koltsegkeret = "-";

                    let finalDescription = "";


                    if (type === "website") {

                        csomag =
                            formData.get(
                                "Weboldal csomag"
                            ) || "-";


                        hatarido =
                            formData.get(
                                "Weboldal határidő"
                            ) || "-";


                        koltsegkeret =
                            formData.get(
                                "Weboldal költségkeret"
                            ) || "-";


                        finalDescription = `
WEBOLDAL / WEBSHOP

${projekt}
                        `.trim();

                    }


                    /* ========================================
                       REKLÁM ADATOK
                       ======================================== */

                    if (type === "reklam") {

                        const reklamTipus =
                            formData.get(
                                "Reklám típusa"
                            ) || "-";


                        const reklamFelulelet =
                            formData.get(
                                "Reklám felület"
                            ) || "-";


                        const reklamMeret =
                            formData.get(
                                "Reklám méret"
                            ) || "-";


                        hatarido =
                            formData.get(
                                "Reklám határidő"
                            ) || "-";


                        koltsegkeret =
                            formData.get(
                                "Reklám költségkeret"
                            ) || "-";


                        csomag =
                            `REKLÁM — ${reklamTipus}`;


                        finalDescription = `
REKLÁM KÉSZÍTÉS

Reklám felület:
${reklamFelulelet}

Reklám méret/formátum:
${reklamMeret}

Megrendelő leírása:
${projekt}
                        `.trim();

                    }


                    /* ========================================
                       ALAP VALIDÁCIÓ
                       ======================================== */

                    if (!nev || nev === "-") {

                        throw new Error(
                            "A név megadása kötelező."
                        );

                    }


                    if (!email || email === "-") {

                        throw new Error(
                            "Az email cím megadása kötelező."
                        );

                    }


                    if (!projekt || projekt === "-") {

                        throw new Error(
                            "A projekt leírása kötelező."
                        );

                    }


                    if (!type) {

                        throw new Error(
                            "Válaszd ki az ajánlat típusát."
                        );

                    }


                    /* ========================================
                       WORKER PAYLOAD
                       ======================================== */

                    const payload = {

                        nev,

                        ceg,

                        email,

                        telefon,

                        csomag,

                        hatarido,

                        koltsegkeret,

                        projektLeiras:
                            finalDescription

                    };


                    /* ========================================
                       WORKER KÜLDÉS
                       ======================================== */

                    const response =
                        await fetch(
                            WORKER_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Origin":
                                        window.location.origin
                                },

                                body:
                                    JSON.stringify(
                                        payload
                                    )
                            }
                        );


                    /* ========================================
                       VÁLASZ
                       ======================================== */

                    const result =
                        await response.json();


                    /* ========================================
                       HIBA ELLENŐRZÉS
                       ======================================== */

                    if (
                        !response.ok ||
                        result.success === false
                    ) {

                        throw new Error(
                            result.message ||
                            "Az ajánlatkérés küldése sikertelen."
                        );

                    }


                    /* ========================================
                       SIKERES KÜLDÉS
                       ======================================== */

                    form.reset();


                    /* visszaállítjuk WEBOLDAL-ra */

                    const websiteRadio =
                        form.querySelector(
                            'input[name="ajanlatTipus"][value="website"]'
                        );


                    if (websiteRadio) {

                        websiteRadio.checked = true;

                        websiteRadio.dispatchEvent(
                            new Event("change", {
                                bubbles: true
                            })
                        );

                    }


                    form.dataset.type =
                        "website";


                    /* ========================================
                       SIKER POPUP
                       ======================================== */

                    openSuccessModal();


                } catch (error) {

                    console.error(
                        "Ajánlatkérés hiba:",
                        error
                    );


                    /* ========================================
                       HIBAÜZENET
                       ======================================== */

                    if (formMessage) {

                        formMessage.style.color =
                            "#ff4d4d";


                        formMessage.textContent =
                            error.message ||
                            (
                                document.documentElement.lang === "en"

                                    ? "There was a problem sending your request. Please try again later."

                                    : "Hiba történt az elküldés során. Kérlek, próbáld meg később újra."
                            );

                    }

                } finally {

                    /* ========================================
                       GOMB VISSZAÁLLÍTÁSA
                       ======================================== */

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalText;

                    }

                }

            }
        );

    }

});