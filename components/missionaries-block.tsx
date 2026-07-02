const CHURCH_MISSIONARY_URL =
  "https://www.churchofjesuschrist.org/welcome/meet-with-missionaries?lang=eng";

// TODO: Replace with actual Tooele missionary phone number (OQ-3)
const MISSIONARY_PHONE = "(435) 555-0199";
const MISSIONARY_PHONE_TEL = "+14355550199";

export function MissionariesBlock() {
  return (
    <section aria-labelledby="missionaries-heading" className="bg-surface text-on-surface">
      <div className="mx-auto w-full max-w-container-max px-container-px py-section-v-mobile lg:px-container-px-lg lg:py-section-v">
        <div className="max-w-3xl">
          <p className="text-section-label tracking-[0.14em] text-on-surface-muted">OUR MISSIONARIES</p>
          <h2 id="missionaries-heading" className="mt-stack-sm text-headline-mobile md:text-headline">
            MEET WITH MISSIONARIES
          </h2>
          <p className="mt-stack-md text-body-lg text-on-surface-muted">
            Missionaries can help you learn about Jesus Christ, answer questions, and connect with a local worship
            community. Call the Tooele missionaries or request a visit through the Church website.
          </p>
          <div className="mt-stack-lg flex flex-col items-start gap-stack-sm sm:flex-row sm:items-center">
            <a
              href={`tel:${MISSIONARY_PHONE_TEL}`}
              aria-label={`Call Tooele Missionaries: ${MISSIONARY_PHONE}`}
              className="inline-flex min-h-[44px] items-center text-body font-bold text-accent-rust underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-rust"
            >
              {MISSIONARY_PHONE}
            </a>
            <a
              href={CHURCH_MISSIONARY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-none bg-accent-rust px-[32px] py-[14px] text-center text-cta tracking-[0.1em] text-on-accent-rust transition-colors hover:bg-[#8f3f23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-rust"
            >
              Meet With Missionaries
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
