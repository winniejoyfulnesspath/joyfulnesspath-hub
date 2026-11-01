# Wealth10 R3 | Image-led staging + native Stitch co-design brief
Status: DRAFT / PRIVATE LOCAL ONLY / 2026-10-30. Not a design ACCEPT, native Stitch edit or production deployment.
Original workline: Wealth10 互動新頁; original Issue: soulnewenergy/sne-brain#365. R2 original and Stitch V1/V2/V3 must remain immutable.
Goal: combine the existing R2 experience, visual image-generation/compositing, original Winnie Page lessons and Stitch's visual/layout iteration. Stitch neither replaces nor is excluded from our design workflow.

## Verified basis
- Actual R2 screenshots inspected: R2_desktop_HERO.png, R2_mobile_HERO.png, R2_desktop_TREE.png, R2_desktop_MATRIX.png.
- Actual editable source: index.html, style.css, visual-r2.css, experience.js.
- R2 self-QC 1440/768/390/reduced 4/4 PASS per VISUAL_R2_QC_RECEIPT.md. Independent visual and exact-head QC pending.
- R2 Hero: genuine user-provided white-suit image in .portrait-arch; current gateway is chiefly CSS rings/shadows/gradients. Never generate or alter her face to substitute photo.
- R2 Threshold: cream editorial section, .threshold-scenography and .threshold-door layers currently CSS. Current mobile position right:-37% could crop a generated scene.
- R2 Tree: ten interactive nodes controlled by HTML/SVG/JS; current plate/floor largely CSS. Keep ten labels/order/position semantics and keyboard controls unchanged.
- R2 Matrix: three functional tabs with actual changing content; prism/ring/beam mostly CSS. Keep buttons, tab panels and JS untouched.
- Proven Winnie Hub precedent: 2026-10-18 Theater V3 used one 239,768-byte scene WebP, with text-safe negative space and real DOM stage/text/CTA; Paul accepted local visual. Receipt scratch/WinnieHubTheater_20261018/THEATER_V3_IMAGE_REPLACEMENT_QC.md.

## Shared art direction
World: dark amethyst and warm champagne illumination, quiet luxurious material depth, credible architectural perspective, not neon/cosmic clip-art. Preserve alternating cream editorial relief sections and dark scene sections.
Rule: generate scenery without text, logos, buttons, fake UI, fake portraits, falsely drawn tree nodes or claims. Import the user's authorized original portrait separately as source, do not synthesize the person.
Image delivery per pilot section: (1) scene/background WebP including natural text-safe negative space, (2) only if necessary a transparent foreground architectural PNG/WebP mask, (3) reference layout at desktop/mobile. Separate mobile composition; do not merely crop desktop.

## Section-level visual/keying map
HERO #entrance:
- Scene plate: deep violet architectural portal, warm light far behind the doorway, architectural depth and a subtle floor. Left 48% is intentionally quiet/low-detail, suitable for existing h1 and CTA; right scene gives photo plausible spatial position. No figure in generated scene.
- Photo: use exact ../V3_AUTHORIZED_IMAGES/winnie_white_suit_hero.png. Mask/background separation may be previewed only with subject fidelity; preserve source pixels on person. The portrait is between rear portal light and front architectural rim. Use edge-aware halo/shadow matching light direction.
- Layers bottom->top: scenic backplate < architectural far arch < authentic photo with clipping mask < transparent near arch/rim < DOM typography, CTA, nav. R2 .hero-copy, .hero-stage remain interactive/layout anchors.
- Mobile 390: portrait/photo dominates top 55%, text starts in protected gradient-safe area below; no overlap, no face cropping. Keep nav and CTA readable.

THRESHOLD #threshold:
- Scenic plate: wide *walk-through* architectural space, foreground pillars and open central corridor, warm cream/pale purple treatment. Keep editorial section legible; scenery should not become an all-dark duplicate of Hero.
- Replace three pseudo-depth .threshold-door gradients with a single meaningful scene and optional transparent foreground trim, under existing DOM .threshold-content. Desktop perspective axis points towards subsequent Tree scene.
- Mobile: source a vertical aspect composition; doorway remains wide even at 390; avoid pushing visual 37% offscreen.

TREE #constellation:
- Generate clean physical gallery backplate with glass/stone arch and lit floor, EMPTY of text/numbered spheres/edges. Do not put ten generated nodes in the picture.
- Align as background inside .sculpture-frame preserving its 720x780 SVG coordinate system. Keep #tree-lines and #tree-nodes (HTML/SVG/JS) exactly over the backplate; scene perspective/lighting helps these real controls appear installed in physical space.
- Keep .tree-insight and current button, keyboard, aria-pressed behavior. For mobile, anchor frame to single responsive aspect-ratio container to prevent background/coordinates drift.

MATRIX #alignment:
- Scene plate: monumental amethyst light chamber with an empty central installation stage and subtle ground reflection, cropped within .matrix-visual.
- Keep .m-core and other interactive visual overlays DOM/CSS; preserve .matrix-tabs and #matrix-panel. Different selected axes adjust REAL DOM beam/glow vectors, never fake interactive buttons burned into the plate.
- Desktop visual left / functional right; mobile image above real tabs with minimum text contrast.

## Stitch role: complementary, not source authority
Input to EXISTING private Stitch project (no new tabs/projects): R2 screenshots at 1440 and 390, authorized photo reference, this scene/keying map and existing text/navigation. Ask for 2 alternatives per difficult section (Hero and Threshold), focusing on scene crop, art-to-content negative space, foreground-overlap, mobile reading order, and accessible tab/node state. Preserve existing copy, URLs, section order, three tab labels, ten node identities, rights and date-unknown status.
Stitch output is a VISUAL / LAYOUT CANDIDATE, not proof of editable export, accepted change or live update. Compare against real R2 browser screenshots, then extract only verified improvements into a copied local R3 HTML/CSS/assets branch. Keep R2 untouched and preserve source SHA.
No unsupported Comet 9222 bypass; if native Stitch session unavailable, status=STITCH_NOT_EXECUTED and no substitute claim.

## QA before calling R3 better
- Side-by-side same viewport and same content: 1440x900, 768x1024, 390x844, reduced-motion.
- Visual: believable portal depth, person/photo fidelity, negative space, mobile face/title/CTA safe, cream threshold legibility, Tree SVG-to-backplate registration, Matrix core precision, no fake controls.
- Functional: ten tree node and keyboard/aria states, three matrix tabs/panel and scroll/nav, 0 horizontal overflow, 0 JS errors, 0 broken images, LCP/weight checks.
- Gates: actual R3 source and hashes -> author self-QC -> independent non-author exact-version QC -> Paul visual decision -> separate release authorization. No direct deployment.

## Current boundaries
This brief is new, local, non-authorized proposal only. No asset generation, native Stitch edit, R3 build, independent QC, or release is claimed as complete.
