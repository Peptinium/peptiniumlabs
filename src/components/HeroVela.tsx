import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import vialAsset from "@/assets/vial/RT_AVANT_TRANSPARENT.png.asset.json";
import penAsset from "@/assets/hero/peptinium-pen.png.asset.json";
import pillAsset from "@/assets/hero/peptinium-pill.png.asset.json";
import avatarsAsset from "@/assets/hero/lab-avatars.webp.asset.json";
import { useRevealBlur } from "@/hooks/useScrollBlur";

/**
 * Editorial hero inspired by Vela — massive serif headline,
 * floating trio (vial + pen + pill), pill CTAs, uppercase micro-labels.
 * Kept Peptinium brand DA (cyan → violet → magenta) as accents only.
 */
export function HeroVela() {
  useRevealBlur();
  return (
    <section className="relative overflow-hidden bg-background">

      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 30%, color-mix(in oklab, var(--brand-violet) 10%, transparent) 0%, transparent 65%), radial-gradient(45% 45% at 15% 80%, color-mix(in oklab, var(--brand-cyan) 8%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Beam sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-px left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-[oklch(0.62_0.26_296)] to-transparent [animation:beam-sweep_7s_ease-in-out_infinite]"
      />

      <div className="container-prose relative grid gap-10 px-5 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6 lg:pt-28 lg:pb-32">
        {/* LEFT — copy */}
        <div className="relative z-10 flex flex-col text-left">
          <span className="brand-gradient-text font-mono text-[11px] font-semibold uppercase tracking-[0.28em]">
            La plus haute qualité
          </span>

          <h1 className="mt-6 text-[54px] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[76px] lg:text-[104px] lg:leading-[0.94]">
            Le leader
            <br />
            européen
            <br />
            <span className="brand-gradient-text">des peptides</span>
          </h1>

          <p className="mt-7 max-w-md text-[16px] leading-[1.6] text-muted-foreground lg:text-[17px]">
            Découvrez notre gamme de peptides rigoureusement testés, fabriqués
            selon des protocoles de laboratoire stricts et préparés pour des
            résultats de recherche optimaux.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/produits"
              className="group inline-flex items-center gap-3 rounded-full px-7 py-4 font-sans text-[14px] font-medium text-white shadow-[0_18px_44px_-18px_color-mix(in_oklab,var(--brand-violet)_70%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_color-mix(in_oklab,var(--brand-violet)_85%,transparent)]"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, oklch(0.70 0.18 210) 0%, oklch(0.58 0.28 290) 55%, oklch(0.68 0.27 345) 100%)",
              }}
            >
              Catalogue
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0.5"
              >
                <ArrowRight className="size-3.5" strokeWidth={2.2} />
              </span>
            </Link>

            <Link
              to="/etudes-scientifiques"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/25 bg-transparent px-7 py-4 font-sans text-[14px] font-medium text-foreground transition-all hover:border-foreground/60 hover:bg-foreground/[0.03]"
            >
              Découvrir la science
            </Link>
          </div>

          <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Réservé à la recherche
          </div>
        </div>

        {/* RIGHT — trio (vial + pen + pill) */}
        <div className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-center justify-center lg:h-[620px]">
          {/* Soft aurora halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-8 -z-10 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, color-mix(in oklab, var(--brand-cyan) 30%, transparent) 0%, color-mix(in oklab, var(--brand-blue) 22%, transparent) 25%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 55%, color-mix(in oklab, var(--brand-magenta) 24%, transparent) 78%, color-mix(in oklab, var(--brand-cyan) 30%, transparent) 100%)",
              filter: "blur(70px)",
              animation: "vial-glow 6s ease-in-out infinite",
            }}
          />

          {/* Pen — behind, top-right, tilted */}
          <img
            src={penAsset.url}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute right-2 top-4 h-[78%] w-auto rotate-[24deg] object-contain drop-shadow-[0_24px_32px_color-mix(in_oklab,var(--brand-blue)_18%,transparent)] [animation:float_9s_ease-in-out_infinite] lg:right-6 lg:top-2"
          />

          {/* Vial — main, centered */}
          <img
            src={vialAsset.url}
            alt="Flacon Peptinium — peptide de recherche pureté ≥ 99 %"
            draggable={false}
            className="relative z-10 h-full w-auto object-contain drop-shadow-[0_36px_50px_color-mix(in_oklab,var(--brand-violet)_28%,transparent)] [animation:float_6s_ease-in-out_infinite]"
          />

          {/* Pill — foreground, bottom-right */}
          <img
            src={pillAsset.url}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute -bottom-2 right-8 z-20 h-[32%] w-auto object-contain drop-shadow-[0_16px_24px_color-mix(in_oklab,var(--brand-magenta)_25%,transparent)] [animation:float_5s_ease-in-out_infinite_0.8s] lg:right-14 lg:h-[36%]"
          />
        </div>
      </div>

      {/* Lab tests strip */}
      <LabTestsStrip />
    </section>
  );
}

function LabTestsStrip() {
  const tests = [
    { k: "HPLC", v: "Analyse pureté", Icon: IconHplc },
    { k: "Endotoxine", v: "Dosage LAL", Icon: IconEndotoxin },
    { k: "TYMC", v: "Test levures", Icon: IconTymc },
    { k: "TAMC", v: "Test bactéries", Icon: IconTamc },
    { k: "Métaux lourds", v: "Dépistage ICP", Icon: IconHeavyMetal },
  ];
  return (
    <div className="relative border-t border-border/60 bg-surface/40 backdrop-blur-sm">
      <div className="container-prose flex flex-wrap items-center gap-x-12 gap-y-7 px-5 py-8">
        <div className="flex items-center gap-4">
          <img
            src={avatarsAsset.url}
            alt="Scientifiques et médecins experts"
            className="h-11 w-auto shrink-0 select-none"
            draggable={false}
          />
          <span className="font-sans text-[15px] font-medium text-foreground">
            Tests de laboratoire avancés
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-5">
          {tests.map(({ k, v, Icon }) => (
            <div key={k} className="flex items-center gap-3">
              <Icon className="h-10 w-auto shrink-0 text-foreground/25" />
              <div className="leading-tight">
                <div className="font-sans text-[15px] font-semibold text-foreground">
                  {k}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {v}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Lab icons (fournis par la marque) ─────────────────────── */
type IconProps = { className?: string };

function IconHplc({ className }: IconProps) {
  return (
    <svg viewBox="0 0 41 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M1.03003 0.0858859C2.78609 0.0648876 4.8328 0.0391586 6.73169 0.0253489C11.2882 -0.00756737 13.0011 -0.505659 12.0727 5.00138C11.9828 5.53561 10.6969 5.94592 10.1738 6.15685C9.93569 7.49129 10.041 12.8773 10.0434 14.6076L10.0356 32.5491L28.9641 32.5387C30.7829 32.5354 39.4078 32.2644 40.5856 32.976C42.952 36.178 34.4729 35.2734 33.0691 35.2648L12.1726 35.2756C12.1475 38.8569 11.381 38.4356 8.07208 38.3715C8.0832 39.4681 8.1852 41.8827 6.39924 41.9945C4.27525 42.1275 4.34887 39.8192 4.36479 38.3327C3.70466 38.3465 1.32875 38.4761 0.881249 38.0966C-0.354066 37.0486 -0.180744 34.1368 0.723263 32.9257C1.25474 32.4836 1.6428 32.5216 2.32632 32.4736L2.34204 15.4659C2.34664 12.6158 2.37655 9.70102 2.31309 6.85074C2.2826 5.48434 1.68057 6.40411 0.465386 5.33849C-0.221774 3.98382 -0.109611 1.19482 1.03003 0.0858859Z" />
      <path d="M19.9361 7.69012C23.293 8.48324 23.4687 13.2525 23.9006 16.0815C24.4792 19.8688 24.555 23.6398 25.7677 27.3264C27.1387 24.0955 27.0041 20.6555 28.7037 17.7635C29.0174 17.2297 29.7865 16.666 30.417 16.6078C34.7311 16.2086 33.8003 24.138 35.7594 26.6685C36.8978 28.1387 37.0053 27.6877 38.2961 28.6543C39.5769 30.7784 36.7923 31.277 35.2369 30.2358C32.1113 28.1434 31.7778 23.1446 30.721 19.6868C30.1882 21.4488 29.6439 24.3498 29.2381 26.246C29.0304 26.9865 28.7617 27.7087 28.4346 28.4053C28.0663 29.1838 27.3372 30.1944 26.4928 30.3985C23.052 31.2113 22.2182 25.5936 21.8961 23.2525C21.3464 19.257 21.0457 15.2573 20.1663 11.3065C18.7966 16.656 19.0785 22.2432 17.4819 27.5475C16.8748 29.5637 14.7427 31.8452 12.699 30.1736C12.637 29.9881 12.5636 29.7677 12.4785 29.5127C13.311 28.2403 14.4785 27.2748 15.0251 25.8172C16.6587 21.4621 15.2606 9.98241 19.9361 7.69012Z" />
    </svg>
  );
}

function IconEndotoxin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 46 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M11.3463 0C14.5323 0.0391462 14.3278 2.639 14.6752 5.09531C17.1671 5.59093 18.0441 6.15022 19.9435 7.64205C21.4192 6.5932 23.7383 4.74839 25.4666 6.46767C26.6577 8.77685 23.6533 10.3683 22.0814 11.2977C22.454 12.9295 22.802 14.1509 23.3097 15.7489C25.4623 13.7369 35.5468 2.902 37.3301 2.79153C37.8931 2.75666 38.3912 2.93304 38.8017 3.31821C39.2173 3.70787 39.5415 4.25141 39.531 4.82983C39.525 5.1655 39.4149 5.46809 39.2166 5.73919C37.3784 8.25107 34.5602 10.547 32.3233 12.7365L19.0638 25.7953C17.1442 27.7135 6.42381 39.1248 4.84663 39.1523C4.2909 39.1622 3.7022 38.9115 3.30172 38.5399C2.95483 38.2123 2.76593 37.7554 2.78196 37.2829C2.84149 35.1506 9.7703 29.1158 11.7532 27.1929C9.55484 25.6873 8.72411 24.6171 7.51557 22.3698C5.66201 23.1658 1.8514 24.0135 2.983 20.174C3.26395 19.2212 4.96547 18.807 5.92626 18.5445C5.1917 16.5978 5.00141 15.5912 4.89265 13.5853C3.1435 12.9837 -0.340368 12.0078 0.0269094 9.54852C1.22812 7.49694 4.38318 8.81353 6.02357 9.44076C7.28591 7.41821 8.2325 6.65913 10.3469 5.59048C9.91089 3.12 9.13557 1.69296 11.3463 0Z" />
      <path d="M26.9463 20.644C28.1936 21.5012 28.5143 22.0946 29.0589 23.451C31.302 23.3699 32.296 23.4452 34.4822 23.7724C35.1139 21.8408 36.7015 19.7615 38.7399 22.1665C39.4592 23.0154 38.9234 24.5351 38.6515 25.5676C41.6193 28.1869 42.1154 29.8881 41.7512 33.6485C43.5852 34.518 46.7155 35.7591 45.8527 38.278C44.1181 40.0851 41.0441 38.1416 39.384 37.2466C38.8197 37.5573 34.1181 39.4063 34.2698 39.2018C33.3108 40.4955 33.9903 40.885 32.0658 42C29.0059 41.6904 29.3035 40.1438 29.4115 37.7382C29.0328 37.4507 27.9574 36.6358 27.5948 36.4893C26.4062 36.0093 24.2068 36.2821 23.4348 35.1853C22.3404 33.6304 23.8716 32.6135 24.0622 31.1598L23.8024 30.8808C22.7714 30.5804 21.4612 30.9554 20.2849 31.1191C20.7361 32.7302 21.5815 35.6189 19.4846 36.5478C16.8095 36.6519 16.2641 33.3603 15.8125 31.4891L26.9463 20.644Z" />
    </svg>
  );
}

function IconTymc({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M12.8945 19.7672C14.6135 19.7345 16.051 20.1153 17.4531 21.1029C18.9626 22.1602 19.9675 23.7769 20.235 25.5795C20.8894 30.1889 16.9871 32.56 14.1507 35.4666C12.0812 37.5874 10.5718 39.1233 7.51353 39.53C5.7202 39.5296 4.47839 39.3111 2.98575 38.2771C1.4463 37.2009 0.403458 35.5688 0.0855588 33.7384C-0.342967 31.236 0.88222 28.4286 2.77644 26.8033C5.87277 24.1464 8.66599 20.4057 12.8945 19.7672Z" />
      <path d="M17.2869 0.0202308C23.365 -0.379372 27.4151 5.20815 23.9632 10.8138C22.2738 13.5556 17.9227 14.4194 15.2886 15.8847C14.3225 16.4219 12.7548 17.0522 11.6481 17.2735C5.85419 17.6647 1.73697 12.4356 4.65522 6.88542C5.87024 4.57461 8.79403 3.52415 11.0449 2.58434C13.0041 1.76618 15.2272 0.535986 17.2869 0.0202308Z" />
      <path d="M27.7227 22.8743C30.3573 22.6903 32.8739 23.6859 34.4852 25.8368C37.2541 29.5363 41.9516 33.9658 39.1278 38.8926C38.1147 40.6598 36.4708 41.4895 34.5503 41.9789C28.9271 42.4271 24.8338 35.5835 22.6244 31.0535C20.9764 27.6767 23.8938 23.9367 27.7227 22.8743Z" />
    </svg>
  );
}

function IconTamc({ className }: IconProps) {
  return (
    <svg viewBox="0 0 45 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M8.76861 0C10.3794 0.0393995 10.8265 0.37419 11.5892 1.77472C12.7376 3.87814 13.8663 3.57535 15.9812 3.48501C16.8556 1.8348 17.397 0.316725 19.5381 0.176105C21.8678 1.02091 20.886 3.33002 20.3491 5.06469C20.8553 5.80457 21.6048 6.60933 22.2097 7.29676C23.803 6.83289 27.7041 5.47371 27.7764 8.53077C27.3994 9.96831 25.3612 10.4842 24.1449 11.7021C23.8293 12.4637 24.0222 13.56 24.1011 14.4135C25.6988 15.3258 27.2592 15.9782 27.5025 18.0206C26.7113 20.3025 23.9674 19.2692 22.282 18.7677C21.4185 19.5154 20.5901 20.4016 19.7902 21.2224C20.1167 23.6502 21.2279 24.6728 18.8544 26.3705C14.8196 26.3193 17.6972 22.5718 13.222 22.8221C10.1449 22.9941 11.5191 26.5126 8.14181 26.389C6.28771 25.2734 7.23011 22.7875 7.84376 21.2427L5.44396 18.619C4.37227 18.9988 1.11773 20.2544 0.230129 18.6995C-0.896355 16.7248 3.85505 14.7574 3.93833 12.9929C2.96745 11.3092 0.0986221 10.2741 0 8.0079C1.09799 5.89556 3.72136 7.05752 5.36287 7.69945L8.04539 5.199C7.4427 2.75274 6.57919 1.77189 8.76861 0Z" />
      <path d="M33.0714 18.7351C35.6006 18.7887 35.5107 20.138 35.7978 22.1333L37.939 23.342C41.7195 20.6422 44.2903 22.7358 40.7311 26.3821C41.0182 27.1368 41.4346 28.016 41.7677 28.7676C43.315 29.0497 46.1948 29.7613 44.4634 32.1499C43.8213 33.0365 42.1732 32.9599 41.0927 32.9954C40.7618 33.4547 40.2599 34.3687 39.9531 34.8926C40.9831 36.3591 42.331 37.9575 40.4199 39.4612C38.7762 39.8076 38.4365 38.6471 36.7161 37.9388C33.238 37.8326 34.6143 40.5786 32.3658 42C29.5254 41.7547 30.3824 40.6121 29.5364 38.4715C29.1989 37.6147 28.1425 37.3415 27.3032 37.0108C26.2709 37.71 24.1823 39.0851 23.0909 38.0709C22.6088 36.4921 23.8821 34.6773 24.2963 33.2772C24.7456 31.7574 21.4603 31.8882 20.1235 29.8155C19.9876 27.6161 22.7797 27.8529 24.2459 27.9285L25.2189 25.42C22.6657 21.2865 24.8836 19.8895 28.5261 22.687C29.4159 22.5532 30.5117 22.2944 31.408 22.1082C31.7981 20.4456 31.7828 19.793 33.0714 18.7351Z" />
    </svg>
  );
}

function IconHeavyMetal({ className }: IconProps) {
  return (
    <svg viewBox="0 0 49 42" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M9.48844 0.295572C11.9742 0.0331519 27.2606 -0.348138 28.6242 0.649819C29.1285 1.01687 29.4221 1.59106 29.4884 2.20583C29.5617 2.91147 29.3842 3.76469 28.8728 4.28478C28.1058 5.06303 26.8274 5.01581 25.8189 5.06944L25.8259 16.0771C28.262 20.509 37.7648 32.7991 37.7199 36.8878C37.7057 38.1605 37.2203 39.419 36.2876 40.2983C34.3202 42.1537 31.6072 41.9513 29.1119 41.9136L13.2526 41.9402C10.5727 41.9442 4.44821 42.3549 2.31991 40.9669C1.16461 40.1996 0.357324 39.0054 0.0756021 37.6447C-0.561232 34.6036 2.98752 30.0793 4.63287 27.4886L11.8866 16.1267C11.8298 12.5207 11.87 8.80881 11.8629 5.19377C8.63615 4.85258 6.69726 3.12667 9.48844 0.295572Z" />
      <path d="M43.4319 20.3092C46.0857 19.9315 48.5479 21.7722 48.9456 24.4311C49.341 27.0897 47.5204 29.5703 44.8713 29.9853C42.1937 30.4048 39.689 28.5593 39.2889 25.8739C38.8912 23.1885 40.7496 20.691 43.4319 20.3092Z" />
      <path d="M34.5332 12.2847C35.7453 11.8866 37.0782 12.1772 38.0157 13.0445C38.9532 13.9117 39.3485 15.2193 39.0502 16.4621C38.7496 17.7049 37.8026 18.6879 36.5739 19.0313C34.7321 19.5461 32.8168 18.4919 32.2628 16.6578C31.7089 14.8238 32.7174 12.8815 34.5332 12.2847Z" />
      <path d="M43.3548 7.01985C44.2804 6.77095 45.2677 7.0424 45.9376 7.73001C46.6076 8.41738 46.8562 9.41366 46.5839 10.3355C46.314 11.2572 45.5683 11.961 44.6332 12.1757C43.2246 12.4994 41.8183 11.6326 41.468 10.227C41.1199 8.82168 41.958 7.39497 43.3548 7.01985Z" />
    </svg>
  );
}
