document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("quoteForm");
    const formMessage = document.getElementById("formMessage");

    const successModal = document.getElementById("successModal");
    const successModalClose = document.getElementById("successModalClose");
    const successModalOk = document.getElementById("successModalOk");


    /* ========================================
       CLOUDFLARE WORKER
       ======================================== */

    const WORKER_URL =
        "https://rough-thunder-293f.szivospatrikev.workers.dev/";


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
                        "KÜLDÉS FOLYAMATBAN...";

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
                       ADATOK BEOLVASÁSA
                       ======================================== */

                    const formData =
                        new FormData(form);


                    const nev =
                        String(
                            formData.get("Név") || ""
                        ).trim();


                    const ceg =
                        String(
                            formData.get("Cég") || ""
                        ).trim();


                    const email =
                        String(
                            formData.get("Email") || ""
                        ).trim();


                    const telefon =
                        String(
                            formData.get("Telefon") || ""
                        ).trim();


                    const csomag =
                        String(
                            formData.get("Csomag") || ""
                        ).trim();


                    const hatarido =
                        String(
                            formData.get("Határidő") || ""
                        ).trim();


                    const koltsegkeret =
                        String(
                            formData.get("Költségkeret") || ""
                        ).trim();


                    const projektLeiras =
                        String(
                            formData.get("Projekt leírása") || ""
                        ).trim();


                    /* ========================================
                       KÖTELEZŐ MEZŐK ELLENŐRZÉSE
                       ======================================== */

                    if (
                        !nev ||
                        !email ||
                        !csomag ||
                        !projektLeiras
                    ) {

                        throw new Error(
                            "Kérlek, töltsd ki az összes kötelező mezőt."
                        );

                    }


                    /* ========================================
                       EMAIL ELLENŐRZÉSE
                       ======================================== */

                    const emailRegex =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (!emailRegex.test(email)) {

                        throw new Error(
                            "Kérlek, adj meg egy érvényes email-címet."
                        );

                    }


                    /* ========================================
                       CLOUDFLARE WORKERNEK KÜLDENDŐ ADATOK
                       ======================================== */

                    const requestData = {

                        nev: nev,

                        ceg: ceg,

                        email: email,

                        telefon: telefon,

                        csomag: csomag,

                        hatarido: hatarido,

                        koltsegkeret: koltsegkeret,

                        projektLeiras: projektLeiras

                    };


                    /* ========================================
                       KÜLDÉS A CLOUDFLARE WORKERNEK
                       ======================================== */

                    const response =
                        await fetch(
                            WORKER_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        requestData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    /* ========================================
                       WORKER VÁLASZ ELLENŐRZÉSE
                       ======================================== */

                    if (
                        !response.ok ||
                        !result.success
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
                            "Hiba történt az elküldés során. Kérlek, próbáld meg később újra.";

                    }

                } finally {

                    /* ========================================
                       GOMB VISSZAÁLLÍTÁSA
                       ======================================== */

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            originalText;

                    }

                }

            }
        );

    }

});
