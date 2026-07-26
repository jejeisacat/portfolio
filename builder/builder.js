// Local, browser-only portfolio page builder.
// State lives in localStorage — nothing is written to disk automatically.
// "Export Page & Images" downloads a finished HTML page (same template as
// sugo.html / linden-bed.html) plus any newly-added photos.
// "Copy PROJECTS Array" serializes the current groups/projects/order into the
// exact shape js/projects.js expects, so the sidebar Index on every real page
// can be updated with one paste.

const STORAGE_KEY = "portfolioBuilder.projects";
const GROUPS_KEY = "portfolioBuilder.groups";
const ROOT_ORDER_KEY = "portfolioBuilder.rootOrder";
const CURRENT_KEY = "portfolioBuilder.currentId";
const SEEDED_KEY = "portfolioBuilder.seededVersion";
const SEED_VERSION = "3"; // bump if DEFAULT_PROJECTS changes shape again

// Pages that already exist on the site because they were hand-built, not made
// through this tool. Their photos live on disk already (`src`, not `dataUrl`),
// so the builder just references those paths instead of re-storing the images.
// Backfilled into localStorage once (see ensureDefaultsSeeded) so they show up
// on the left, grouped exactly like the real sidebar, and can be edited/
// re-exported like anything else. Add future hand-built pages here too, or
// they simply won't appear in the builder.
const DEFAULT_PROJECTS = [
  {
    group: null,
    data: {
      slug: "sugo",
      name: "SUGO",
      tagline: "Tableware brand identity & product design",
      client: "SUGO",
      role: "Product Design, Branding",
      year: "2023",
      type: "Ceramic Tableware",
      overview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et placerat est, eu imperdiet neque. Proin sit amet purus metus. In nec efficitur justo, sed maximus est. Ut ornare arcu eros, at condimentum enim imperdiet vitae.\n\nMorbi lorem augue, commodo vel ipsum ac, sollicitudin urna. Praesent sit amet mauris tortor. Duis ac risus sem. Fusce at elementum justo, ac mollis turpis. Pellentesque accumsan purus ut tristique bibendum.",
      photos: [
        { name: "sugo-01.jpg", alt: "SUGO ceramic cup", width: 1080, height: 1080, src: "assets/images/sugo/sugo-01.jpg" },
        { name: "sugo-02.jpg", alt: "SUGO ceramic cup, rim detail", width: 1080, height: 1080, src: "assets/images/sugo/sugo-02.jpg" },
        { name: "sugo-03.jpg", alt: "SUGO ceramic cup, full shot", width: 1080, height: 1080, src: "assets/images/sugo/sugo-03.jpg" },
        { name: "sugo-04.jpg", alt: "SUGO ceramic bowl, base detail", width: 1080, height: 1080, src: "assets/images/sugo/sugo-04.jpg" },
        { name: "sugo-05.jpg", alt: "SUGO ceramic bowl, full shot", width: 1080, height: 1080, src: "assets/images/sugo/sugo-05.jpg" },
        { name: "sugo-06.jpg", alt: "SUGO ceramic bowl, side detail", width: 1080, height: 1080, src: "assets/images/sugo/sugo-06.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "linden-bed",
      name: "Linden Bed",
      tagline: "A raised daybed for small dogs, in solid ash",
      client: "BADMARLON",
      role: "Product Design",
      year: "2023",
      type: "Pet Furniture, Solid Wood",
      overview:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et placerat est, eu imperdiet neque. Proin sit amet purus metus. In nec efficitur justo, sed maximus est. Ut ornare arcu eros, at condimentum enim imperdiet vitae.\n\nMorbi lorem augue, commodo vel ipsum ac, sollicitudin urna. Praesent sit amet mauris tortor. Duis ac risus sem. Fusce at elementum justo, ac mollis turpis. Pellentesque accumsan purus ut tristique bibendum.",
      photos: [
        { name: "linden-bed-01.jpg", alt: "Linden Bed by a curtained window", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-01.jpg" },
        { name: "linden-bed-02.jpg", alt: "Linden Bed in an arched nook", width: 2048, height: 2048, src: "assets/images/linden-bed/linden-bed-02.jpg" },
        { name: "linden-bed-03.jpg", alt: "A poodle resting on the Linden Bed", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-03.jpg" },
        { name: "linden-bed-04.jpg", alt: "Linden Bed beside a potted plant", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-04.jpg" },
        { name: "linden-bed-05.jpg", alt: "Linden Bed with feeding bowls and a dog walking by", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-05.jpg" },
        { name: "linden-bed-06.jpg", alt: "Linden Bed in a sunlit room with a dog and its owner", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-06.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "dan",
      name: "Dan",
      tagline: "A fluted, elevated feeding stand for cats and small dogs.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview:
        "Dan raises a ceramic bowl off the floor on a turned, fluted wood base — a small piece meant to read as furniture rather than pet gear. The fluted column is both a grip detail and a visual echo of classical stoneware, scaled down to sit quietly on a kitchen floor.\n\nDeveloped for BADMARLON alongside the brand's ceramic tableware line, Dan shares the same rounded, soft-matte language as the rest of the collection — designed so a home with one pet bowl and twelve human ones still looks like a single, considered space.",
      photos: [
        { name: "dan-01.jpg", alt: "Dan feeding stand, lifestyle shot with a dog", width: 1800, height: 1200, src: "assets/images/dan/dan-01.jpg" },
        { name: "dan-02.jpg", alt: "Dan feeding stand, top-down product shot", width: 1800, height: 1200, src: "assets/images/dan/dan-02.jpg" },
        { name: "dan-03.jpg", alt: "Dan feeding stand, two-up on branded mat", width: 1800, height: 1200, src: "assets/images/dan/dan-03.jpg" },
        { name: "dan-04.jpg", alt: "Dan feeding stand, lifestyle shot with a cat", width: 1800, height: 1012, src: "assets/images/dan/dan-04.jpg" },
        { name: "dan-05.jpg", alt: "Dan feeding stand, studio shot of two combos", width: 1800, height: 1200, src: "assets/images/dan/dan-05.jpg" },
        { name: "dan-06.jpg", alt: "Dan feeding stand, detail of bowl and branded mat", width: 1800, height: 1200, src: "assets/images/dan/dan-06.jpg" },
        { name: "dan-07.jpg", alt: "Dan feeding stand, two sizes side by side", width: 1800, height: 1160, src: "assets/images/dan/dan-07.jpg" },
        { name: "dan-08.jpg", alt: "Dan feeding stand, styled scene", width: 1800, height: 1200, src: "assets/images/dan/dan-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "peekaboo",
      name: "Peek A Boo",
      tagline: "A felt cat partition designed to double as a place to hide.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview:
        "Peek A Boo is a modular felt partition for cats — part privacy screen, part hiding spot, built from the same soft, structured felt used across BADMARLON's pet furniture line. Its cutout is sized for a cat to slip through or curl up inside, turning a flat panel into a piece of furniture with a use.\n\nDesign and production followed BADMARLON's usual process: pattern development, felt sourcing in two colorways, and construction detailing to keep every seam durable under daily scratching and pushing.",
      photos: [
        { name: "peekaboo-01.jpg", alt: "Peek A Boo felt cat partition, photo 1", width: 1800, height: 1188, src: "assets/images/peekaboo/peekaboo-01.jpg" },
        { name: "peekaboo-02.jpg", alt: "Peek A Boo felt cat partition, photo 2", width: 1800, height: 1200, src: "assets/images/peekaboo/peekaboo-02.jpg" },
        { name: "peekaboo-03.jpg", alt: "Peek A Boo felt cat partition, photo 3", width: 1800, height: 1200, src: "assets/images/peekaboo/peekaboo-03.jpg" },
        { name: "peekaboo-04.jpg", alt: "Peek A Boo felt cat partition, photo 4", width: 1800, height: 1200, src: "assets/images/peekaboo/peekaboo-04.jpg" },
        { name: "peekaboo-05.jpg", alt: "Peek A Boo felt cat partition, photo 5", width: 1800, height: 1200, src: "assets/images/peekaboo/peekaboo-05.jpg" },
        { name: "peekaboo-06.jpg", alt: "Peek A Boo felt cat partition, photo 6", width: 1800, height: 1200, src: "assets/images/peekaboo/peekaboo-06.jpg" },
        { name: "peekaboo-07.jpg", alt: "Peek A Boo felt cat partition, photo 7", width: 1800, height: 955, src: "assets/images/peekaboo/peekaboo-07.jpg" },
        { name: "peekaboo-08.jpg", alt: "Peek A Boo felt cat partition, photo 8", width: 1800, height: 1200, src: "assets/images/peekaboo/peekaboo-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "maison-paris",
      name: "Maison Paris",
      tagline: "BADMARLON at Maison & Objet Paris, 2023.",
      client: "BADMARLON",
      role: "Product Design, Exhibition",
      year: "2023",
      type: "",
      overview: "Booth and product presentation for BADMARLON's showing at Maison & Objet Paris, 2023.",
      photos: [
        { name: "maison-paris-01.jpg", alt: "Maison Paris, photo 1", width: 1800, height: 1200, src: "assets/images/maison-paris/maison-paris-01.jpg" },
        { name: "maison-paris-02.jpg", alt: "Maison Paris, photo 2", width: 1800, height: 1219, src: "assets/images/maison-paris/maison-paris-02.jpg" },
        { name: "maison-paris-03.jpg", alt: "Maison Paris, photo 3", width: 1800, height: 1200, src: "assets/images/maison-paris/maison-paris-03.jpg" },
        { name: "maison-paris-04.jpg", alt: "Maison Paris, photo 4", width: 1800, height: 1185, src: "assets/images/maison-paris/maison-paris-04.jpg" },
        { name: "maison-paris-05.jpg", alt: "Maison Paris, photo 5", width: 1800, height: 1200, src: "assets/images/maison-paris/maison-paris-05.jpg" },
        { name: "maison-paris-06.jpg", alt: "Maison Paris, photo 6", width: 1458, height: 1800, src: "assets/images/maison-paris/maison-paris-06.jpg" },
        { name: "maison-paris-07.jpg", alt: "Maison Paris, photo 7", width: 1800, height: 981, src: "assets/images/maison-paris/maison-paris-07.jpg" },
        { name: "maison-paris-08.jpg", alt: "Maison Paris, photo 8", width: 1800, height: 981, src: "assets/images/maison-paris/maison-paris-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "sono",
      name: "BADMARLON x SONO",
      tagline: "A collaboration between BADMARLON and SONO.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product collaboration between BADMARLON and SONO.",
      photos: [
        { name: "sono-01.jpg", alt: "BADMARLON x SONO, photo 1", width: 1800, height: 1200, src: "assets/images/sono/sono-01.jpg" },
        { name: "sono-02.jpg", alt: "BADMARLON x SONO, photo 2", width: 1800, height: 1101, src: "assets/images/sono/sono-02.jpg" },
        { name: "sono-03.jpg", alt: "BADMARLON x SONO, photo 3", width: 1800, height: 1162, src: "assets/images/sono/sono-03.jpg" },
        { name: "sono-04.jpg", alt: "BADMARLON x SONO, photo 4", width: 1800, height: 1048, src: "assets/images/sono/sono-04.jpg" },
        { name: "sono-05.jpg", alt: "BADMARLON x SONO, photo 5", width: 1800, height: 1200, src: "assets/images/sono/sono-05.jpg" },
        { name: "sono-06.jpg", alt: "BADMARLON x SONO, photo 6", width: 1800, height: 1200, src: "assets/images/sono/sono-06.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "como",
      name: "Como",
      tagline: "Ceramic tableware, part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Ceramic tableware piece from the BADMARLON collection.",
      photos: [
        { name: "como-01.jpg", alt: "Como, photo 1", width: 1325, height: 1800, src: "assets/images/como/como-01.jpg" },
        { name: "como-02.jpg", alt: "Como, photo 2", width: 1325, height: 1800, src: "assets/images/como/como-02.jpg" },
        { name: "como-03.jpg", alt: "Como, photo 3", width: 1325, height: 1800, src: "assets/images/como/como-03.jpg" },
        { name: "como-04.jpg", alt: "Como, photo 4", width: 1325, height: 1800, src: "assets/images/como/como-04.jpg" },
        { name: "como-05.jpg", alt: "Como, photo 5", width: 1325, height: 1800, src: "assets/images/como/como-05.jpg" },
        { name: "como-06.jpg", alt: "Como, photo 6", width: 1325, height: 1800, src: "assets/images/como/como-06.jpg" },
        { name: "como-07.jpg", alt: "Como, photo 7", width: 1800, height: 1344, src: "assets/images/como/como-07.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "deauvile",
      name: "Deauvile",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "deauvile-01.jpg", alt: "Deauvile, photo 1", width: 1800, height: 1200, src: "assets/images/deauvile/deauvile-01.jpg" },
        { name: "deauvile-02.jpg", alt: "Deauvile, photo 2", width: 1800, height: 1200, src: "assets/images/deauvile/deauvile-02.jpg" },
        { name: "deauvile-03.jpg", alt: "Deauvile, photo 3", width: 1389, height: 1800, src: "assets/images/deauvile/deauvile-03.jpg" },
        { name: "deauvile-04.jpg", alt: "Deauvile, photo 4", width: 1800, height: 1174, src: "assets/images/deauvile/deauvile-04.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "haro",
      name: "Haro",
      tagline: "A round pet bed, part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Round pet bed from the BADMARLON collection.",
      photos: [
        { name: "haro-01.jpg", alt: "Haro round pet bed, photo 1", width: 1200, height: 1800, src: "assets/images/haro/haro-01.jpg" },
        { name: "haro-02.jpg", alt: "Haro round pet bed, photo 2", width: 1800, height: 1800, src: "assets/images/haro/haro-02.jpg" },
        { name: "haro-03.jpg", alt: "Haro round pet bed, photo 3", width: 1800, height: 1237, src: "assets/images/haro/haro-03.jpg" },
        { name: "haro-04.jpg", alt: "Haro round pet bed, photo 4", width: 1800, height: 1800, src: "assets/images/haro/haro-04.jpg" },
        { name: "haro-05.jpg", alt: "Haro round pet bed, photo 5", width: 1800, height: 1800, src: "assets/images/haro/haro-05.jpg" },
        { name: "haro-06.jpg", alt: "Haro round pet bed, photo 6", width: 1800, height: 1200, src: "assets/images/haro/haro-06.jpg" },
        { name: "haro-07.jpg", alt: "Haro round pet bed, photo 7", width: 1148, height: 1800, src: "assets/images/haro/haro-07.jpg" },
        { name: "haro-08.jpg", alt: "Haro round pet bed, photo 8", width: 1800, height: 1454, src: "assets/images/haro/haro-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "lapoo",
      name: "Lapoo",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "lapoo-01.jpg", alt: "Lapoo, photo 1", width: 1800, height: 1197, src: "assets/images/lapoo/lapoo-01.jpg" },
        { name: "lapoo-02.jpg", alt: "Lapoo, photo 2", width: 1800, height: 1200, src: "assets/images/lapoo/lapoo-02.jpg" },
        { name: "lapoo-03.jpg", alt: "Lapoo, photo 3", width: 1800, height: 1200, src: "assets/images/lapoo/lapoo-03.jpg" },
        { name: "lapoo-04.jpg", alt: "Lapoo, photo 4", width: 1800, height: 1200, src: "assets/images/lapoo/lapoo-04.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "marron",
      name: "Marron",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "marron-01.jpg", alt: "Marron, photo 1", width: 1800, height: 1200, src: "assets/images/marron/marron-01.jpg" },
        { name: "marron-02.jpg", alt: "Marron, photo 2", width: 1800, height: 1200, src: "assets/images/marron/marron-02.jpg" },
        { name: "marron-03.jpg", alt: "Marron, photo 3", width: 1800, height: 1800, src: "assets/images/marron/marron-03.jpg" },
        { name: "marron-04.jpg", alt: "Marron, photo 4", width: 1800, height: 1140, src: "assets/images/marron/marron-04.jpg" },
        { name: "marron-05.jpg", alt: "Marron, photo 5", width: 1800, height: 1800, src: "assets/images/marron/marron-05.jpg" },
        { name: "marron-06.jpg", alt: "Marron, photo 6", width: 1800, height: 1800, src: "assets/images/marron/marron-06.jpg" },
        { name: "marron-07.jpg", alt: "Marron, photo 7", width: 1800, height: 1800, src: "assets/images/marron/marron-07.jpg" },
        { name: "marron-08.jpg", alt: "Marron, photo 8", width: 1800, height: 1800, src: "assets/images/marron/marron-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "moo",
      name: "moo",
      tagline: "Part of the BADMARLON collection, in multiple colorways.",
      client: "BADMARLON",
      role: "Product Design, Branding",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection, shown here in its available colorways.",
      photos: [
        { name: "moo-01.jpg", alt: "moo, photo 1", width: 1200, height: 1800, src: "assets/images/moo/moo-01.jpg" },
        { name: "moo-02.jpg", alt: "moo, photo 2", width: 1200, height: 1800, src: "assets/images/moo/moo-02.jpg" },
        { name: "moo-03.jpg", alt: "moo, photo 3", width: 1800, height: 1200, src: "assets/images/moo/moo-03.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "muret",
      name: "Muret",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection, shown here in its available sizes.",
      photos: [
        { name: "muret-01.jpg", alt: "Muret, photo 1", width: 1800, height: 1200, src: "assets/images/muret/muret-01.jpg" },
        { name: "muret-02.jpg", alt: "Muret, photo 2", width: 1800, height: 1200, src: "assets/images/muret/muret-02.jpg" },
        { name: "muret-03.jpg", alt: "Muret, photo 3", width: 1200, height: 1800, src: "assets/images/muret/muret-03.jpg" },
        { name: "muret-04.jpg", alt: "Muret, photo 4", width: 1200, height: 1800, src: "assets/images/muret/muret-04.jpg" },
        { name: "muret-05.jpg", alt: "Muret, photo 5", width: 1800, height: 1140, src: "assets/images/muret/muret-05.jpg" },
        { name: "muret-06.jpg", alt: "Muret, photo 6", width: 1800, height: 1200, src: "assets/images/muret/muret-06.jpg" },
        { name: "muret-07.jpg", alt: "Muret, photo 7", width: 1800, height: 1200, src: "assets/images/muret/muret-07.jpg" },
        { name: "muret-08.jpg", alt: "Muret, photo 8", width: 1800, height: 1200, src: "assets/images/muret/muret-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "nuts",
      name: "Nuts",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "nuts-01.jpg", alt: "Nuts, photo 1", width: 1661, height: 1800, src: "assets/images/nuts/nuts-01.jpg" },
        { name: "nuts-02.jpg", alt: "Nuts, photo 2", width: 1800, height: 1200, src: "assets/images/nuts/nuts-02.jpg" },
        { name: "nuts-03.jpg", alt: "Nuts, photo 3", width: 1800, height: 1200, src: "assets/images/nuts/nuts-03.jpg" },
        { name: "nuts-04.jpg", alt: "Nuts, photo 4", width: 1800, height: 1220, src: "assets/images/nuts/nuts-04.jpg" },
        { name: "nuts-05.jpg", alt: "Nuts, photo 5", width: 1349, height: 1800, src: "assets/images/nuts/nuts-05.jpg" },
        { name: "nuts-06.jpg", alt: "Nuts, photo 6", width: 1200, height: 1800, src: "assets/images/nuts/nuts-06.jpg" },
        { name: "nuts-07.jpg", alt: "Nuts, photo 7", width: 1349, height: 1800, src: "assets/images/nuts/nuts-07.jpg" },
        { name: "nuts-08.jpg", alt: "Nuts, photo 8", width: 1800, height: 1200, src: "assets/images/nuts/nuts-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "provoo",
      name: "provoo",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "provoo-01.jpg", alt: "provoo, photo 1", width: 1200, height: 1800, src: "assets/images/provoo/provoo-01.jpg" },
        { name: "provoo-02.jpg", alt: "provoo, photo 2", width: 1800, height: 1200, src: "assets/images/provoo/provoo-02.jpg" },
        { name: "provoo-03.jpg", alt: "provoo, photo 3", width: 1206, height: 1800, src: "assets/images/provoo/provoo-03.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "provoo-wood",
      name: "provoo wood ver.",
      tagline: "A solid wood version of provoo.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "A solid wood variant of provoo, part of the BADMARLON collection.",
      photos: [
        { name: "provoo-wood-01.jpg", alt: "provoo wood ver., photo 1", width: 1800, height: 1200, src: "assets/images/provoo-wood/provoo-wood-01.jpg" },
        { name: "provoo-wood-02.jpg", alt: "provoo wood ver., photo 2", width: 1800, height: 1200, src: "assets/images/provoo-wood/provoo-wood-02.jpg" },
        { name: "provoo-wood-03.jpg", alt: "provoo wood ver., photo 3", width: 1800, height: 1199, src: "assets/images/provoo-wood/provoo-wood-03.jpg" },
        { name: "provoo-wood-04.jpg", alt: "provoo wood ver., photo 4", width: 1800, height: 1191, src: "assets/images/provoo-wood/provoo-wood-04.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "volvo-x-badmarlon",
      name: "Volvo X Bad Marlon",
      tagline: "A collaboration between Volvo and BADMARLON.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product collaboration between Volvo and BADMARLON, centered on a dog bed designed for the back of a car.",
      photos: [
        { name: "volvo-x-badmarlon-01.jpg", alt: "Volvo X Bad Marlon, photo 1", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-01.jpg" },
        { name: "volvo-x-badmarlon-02.jpg", alt: "Volvo X Bad Marlon, photo 2", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-02.jpg" },
        { name: "volvo-x-badmarlon-03.jpg", alt: "Volvo X Bad Marlon, photo 3", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-03.jpg" },
        { name: "volvo-x-badmarlon-04.jpg", alt: "Volvo X Bad Marlon, photo 4", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-04.jpg" },
        { name: "volvo-x-badmarlon-05.jpg", alt: "Volvo X Bad Marlon, photo 5", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-05.jpg" },
        { name: "volvo-x-badmarlon-06.jpg", alt: "Volvo X Bad Marlon, photo 6", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-06.jpg" },
        { name: "volvo-x-badmarlon-07.jpg", alt: "Volvo X Bad Marlon, photo 7", width: 1800, height: 1200, src: "assets/images/volvo-x-badmarlon/volvo-x-badmarlon-07.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "rupel",
      name: "Rupel",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "rupel-01.jpg", alt: "Rupel, photo 1", width: 1800, height: 1567, src: "assets/images/rupel/rupel-01.jpg" },
        { name: "rupel-02.jpg", alt: "Rupel, photo 2", width: 1192, height: 1800, src: "assets/images/rupel/rupel-02.jpg" },
        { name: "rupel-03.jpg", alt: "Rupel, photo 3", width: 1200, height: 1800, src: "assets/images/rupel/rupel-03.jpg" },
        { name: "rupel-04.jpg", alt: "Rupel, photo 4", width: 1200, height: 1800, src: "assets/images/rupel/rupel-04.jpg" },
        { name: "rupel-05.jpg", alt: "Rupel, photo 5", width: 1800, height: 1200, src: "assets/images/rupel/rupel-05.jpg" },
        { name: "rupel-06.jpg", alt: "Rupel, photo 6", width: 1800, height: 1200, src: "assets/images/rupel/rupel-06.jpg" },
        { name: "rupel-07.jpg", alt: "Rupel, photo 7", width: 1800, height: 1200, src: "assets/images/rupel/rupel-07.jpg" },
        { name: "rupel-08.jpg", alt: "Rupel, photo 8", width: 1133, height: 1800, src: "assets/images/rupel/rupel-08.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "brdy",
      name: "Brdy",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "brdy-01.jpg", alt: "Brdy, photo 1", width: 1800, height: 1200, src: "assets/images/brdy/brdy-01.jpg" },
        { name: "brdy-02.jpg", alt: "Brdy, photo 2", width: 1800, height: 917, src: "assets/images/brdy/brdy-02.jpg" },
        { name: "brdy-03.jpg", alt: "Brdy, photo 3", width: 1800, height: 1192, src: "assets/images/brdy/brdy-03.jpg" },
        { name: "brdy-04.jpg", alt: "Brdy, photo 4", width: 1800, height: 1192, src: "assets/images/brdy/brdy-04.jpg" },
        { name: "brdy-05.jpg", alt: "Brdy, photo 5", width: 1800, height: 1192, src: "assets/images/brdy/brdy-05.jpg" },
      ],
    },
  },
  {
    group: "BADMARLON",
    data: {
      slug: "villaine",
      name: "Villaine",
      tagline: "Part of the BADMARLON collection.",
      client: "BADMARLON",
      role: "Product Design",
      year: "",
      type: "",
      overview: "Product design work from the BADMARLON collection.",
      photos: [
        { name: "villaine-01.jpg", alt: "Villaine, photo 1", width: 1800, height: 1192, src: "assets/images/villaine/villaine-01.jpg" },
        { name: "villaine-02.jpg", alt: "Villaine, photo 2", width: 1800, height: 1192, src: "assets/images/villaine/villaine-02.jpg" },
        { name: "villaine-03.jpg", alt: "Villaine, photo 3", width: 1192, height: 1800, src: "assets/images/villaine/villaine-03.jpg" },
        { name: "villaine-04.jpg", alt: "Villaine, photo 4", width: 1800, height: 1192, src: "assets/images/villaine/villaine-04.jpg" },
        { name: "villaine-05.jpg", alt: "Villaine, photo 5", width: 1800, height: 1192, src: "assets/images/villaine/villaine-05.jpg" },
        { name: "villaine-06.jpg", alt: "Villaine, photo 6", width: 1200, height: 1800, src: "assets/images/villaine/villaine-06.jpg" },
        { name: "villaine-07.jpg", alt: "Villaine, photo 7", width: 1800, height: 1200, src: "assets/images/villaine/villaine-07.jpg" },
      ],
    },
  },
  {
    group: null,
    data: {
      slug: "graphic",
      name: "Graphic Works",
      tagline: "",
      client: "",
      role: "",
      year: "",
      type: "",
      overview: "",
      photos: [],
    },
  },
];

// Pre-written by Claude (this conversation), not fetched from any API at
// runtime — the Generate dialog just picks from this text based on the
// language/voice/length/structure you choose, and drops it (plus, where
// photos already exist on disk, those photos) straight into the form fields.
// Projects not listed here (anything new you create) fall back to a simple
// local template built from whatever fields you've already filled in.
const AI_CONTENT = {
  sugo: {
    en: {
      tagline: "A quiet ceramic tableware line built around weight, warmth, and restraint.",
      paragraphs: [
        "SUGO began as a question about how tableware should feel in the hand before it looks good on a table. Every cup and bowl in the line carries a soft-matte glaze and a rounded, slightly heavy base — details meant to be felt more than seen, built for everyday use rather than display.",
        "I led the product design and visual identity together, from the shape studies and glaze tests through to packaging and the brand's photographic language — a single warm, neutral palette that carries across the tableware, the wordmark, and every touchpoint after it.",
      ],
      thirdPersonOverrides: {
        1: "Yujiyeon led the product design and visual identity together, from the shape studies and glaze tests through to packaging and the brand's photographic language — a single warm, neutral palette that carries across the tableware, the wordmark, and every touchpoint after it.",
      },
    },
    ko: {
      tagline: "무게감과 온기, 절제를 중심에 둔 조용한 도자기 식기 브랜드",
      paragraphs: [
        "SUGO는 식기가 눈에 보이기 전에 손에 어떻게 느껴져야 하는가라는 질문에서 시작했습니다. 라인의 모든 컵과 그릇은 부드러운 무광 유약과 둥글고 묵직한 바닥을 가지고 있는데, 이는 보여주기 위한 디테일이 아니라 매일 쓰면서 느끼도록 만든 디테일입니다.",
        "제품 디자인과 비주얼 아이덴티티를 함께 이끌었습니다. 형태 스터디와 유약 테스트부터 패키지, 그리고 식기·워드마크·이후의 모든 접점을 관통하는 하나의 따뜻하고 뉴트럴한 톤의 브랜드 사진 언어까지 담당했습니다.",
      ],
      thirdPersonOverrides: {
        1: "유지연이 제품 디자인과 비주얼 아이덴티티를 함께 이끌었습니다. 형태 스터디와 유약 테스트부터 패키지, 그리고 식기·워드마크·이후의 모든 접점을 관통하는 하나의 따뜻하고 뉴트럴한 톤의 브랜드 사진 언어까지 담당했습니다.",
      },
    },
  },
  "linden-bed": {
    en: {
      tagline: "A raised daybed for small dogs, built from solid ash to sit like furniture, not equipment.",
      paragraphs: [
        "Linden Bed was designed to disappear into a room the way pet furniture rarely does. Solid ash joinery, a low raised frame, and two densities of cushioning give it the proportions of a small daybed rather than a plastic crate — something that belongs next to a sofa, not under one.",
        "The brief from BADMARLON was simple: make something an owner would want to keep out, in a home they already cared about. That shaped every decision — the wood species, the two upholstery colorways, and the low, open profile that keeps the piece from ever reading as \"a dog product\" first.",
      ],
    },
    ko: {
      tagline: "가구처럼 자리잡도록 만든, 원목 애쉬로 짠 소형견용 리프트 베드",
      paragraphs: [
        "Linden Bed는 여느 반려동물 가구와 달리 공간 속에 자연스럽게 스며들도록 설계했습니다. 원목 애쉬 조인트와 낮은 프레임, 두 가지 밀도의 쿠션은 플라스틱 케이지가 아니라 작은 데이베드의 비례를 만들어, 소파 아래가 아니라 소파 옆에 어울리는 가구가 되도록 했습니다.",
        "BADMARLON의 브리프는 단순했습니다 — 이미 신경 써서 꾸민 집에서도 굳이 치우고 싶지 않은 것을 만들 것. 그 기준이 수종 선택, 두 가지 업홀스터리 컬러, 그리고 '반려동물 제품'처럼 보이지 않게 만든 낮고 열린 실루엣까지 모든 결정을 이끌었습니다.",
      ],
    },
    photos: [
      { name: "linden-bed-01.jpg", alt: "Linden Bed by a curtained window", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-01.jpg" },
      { name: "linden-bed-02.jpg", alt: "Linden Bed in an arched nook", width: 2048, height: 2048, src: "assets/images/linden-bed/linden-bed-02.jpg" },
      { name: "linden-bed-03.jpg", alt: "A poodle resting on the Linden Bed", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-03.jpg" },
      { name: "linden-bed-04.jpg", alt: "Linden Bed beside a potted plant", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-04.jpg" },
      { name: "linden-bed-05.jpg", alt: "Linden Bed with feeding bowls and a dog walking by", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-05.jpg" },
      { name: "linden-bed-06.jpg", alt: "Linden Bed in a sunlit room with a dog and its owner", width: 2048, height: 1365, src: "assets/images/linden-bed/linden-bed-06.jpg" },
    ],
  },
  dan: {
    en: {
      tagline: "A fluted, elevated feeding stand for cats and small dogs.",
      paragraphs: [
        "Dan raises a ceramic bowl off the floor on a turned, fluted wood base — a small piece meant to read as furniture rather than pet gear. The fluted column is both a grip detail and a visual echo of classical stoneware, scaled down to sit quietly on a kitchen floor.",
        "Developed for BADMARLON alongside the brand's ceramic tableware line, Dan shares the same rounded, soft-matte language as the rest of the collection — designed so a home with one pet bowl and twelve human ones still looks like a single, considered space.",
      ],
    },
    ko: {
      tagline: "고양이와 소형견을 위한, 세로 홈이 있는 도자기 식기 스탠드",
      paragraphs: [
        "Dan은 물레로 깎아 세로 홈을 낸 원목 받침 위에 도자기 그릇을 올려, 바닥에서 살짝 띄운 급식대입니다. 반려동물 용품이 아니라 작은 가구처럼 보이도록 설계했고, 세로 홈은 손잡이이자 클래식한 스톤웨어를 축소해놓은 듯한 디테일이기도 합니다.",
        "BADMARLON의 세라믹 식기 라인과 함께 개발된 Dan은 컬렉션 전체가 공유하는 둥글고 무광인 조형 언어를 그대로 이어받았습니다. 사람 그릇 열두 개와 반려동물 그릇 하나가 있는 집도 하나의 통일된 공간으로 보이게 하기 위한 디자인입니다.",
      ],
    },
    photos: [
      { name: "dan-01.jpg", alt: "Dan feeding stand, two-up render", width: 2227, height: 1253, src: "assets/images/dan/dan-01.jpg" },
      { name: "dan-02.jpg", alt: "Dan feeding stand, cutaway render", width: 2227, height: 1253, src: "assets/images/dan/dan-02.jpg" },
      { name: "dan-03.jpg", alt: "Dan feeding stand, close render", width: 2227, height: 1253, src: "assets/images/dan/dan-03.jpg" },
    ],
  },
  peekaboo: {
    en: {
      tagline: "A felt cat partition designed to double as a place to hide.",
      paragraphs: [
        "Peek A Boo is a modular felt partition for cats — part privacy screen, part hiding spot, built from the same soft, structured felt used across BADMARLON's pet furniture line. Its cutout is sized for a cat to slip through or curl up inside, turning a flat panel into a piece of furniture with a use.",
        "Design and production followed BADMARLON's usual process: pattern development, felt sourcing in two colorways, and construction detailing to keep every seam durable under daily scratching and pushing.",
      ],
    },
    ko: {
      tagline: "숨숨집을 겸하도록 설계한, 펠트 소재 고양이 파티션",
      paragraphs: [
        "Peek A Boo는 BADMARLON의 반려동물 가구 라인에 쓰이는 부드럽고 탄탄한 펠트로 만든 모듈형 고양이 파티션입니다. 절반은 가림막, 절반은 숨숨집 역할을 하며, 컷아웃 크기는 고양이가 통과하거나 안에서 몸을 웅크릴 수 있도록 설계해 평평한 패널을 쓸모 있는 가구로 바꿔놓았습니다.",
        "디자인과 제작은 BADMARLON의 일반적인 프로세스를 따랐습니다 — 패턴 개발, 두 가지 컬러웨이의 펠트 소싱, 그리고 매일의 긁힘과 밀림에도 견디도록 마감한 봉제 디테일까지 담당했습니다.",
      ],
    },
    note: "이 프로젝트는 폴더에서 쓸 수 있는 사진을 찾지 못했어요 — 사진은 직접 추가해 주세요.",
  },
  graphic: {
    en: {
      tagline: "Illustration, editorial, and identity work outside of product design.",
      paragraphs: [
        "A running collection of graphic and illustration projects — event posters, character work, and small identity commissions — made alongside the product design and branding work that makes up most of this portfolio.",
        "Each piece here was made for a specific brief rather than as a personal series, spanning print, digital illustration, and short-run identity projects for friends' studios and small local businesses.",
      ],
    },
    ko: {
      tagline: "제품 디자인 바깥에서 진행한 일러스트레이션·에디토리얼·아이덴티티 작업",
      paragraphs: [
        "이벤트 포스터, 캐릭터 작업, 소규모 아이덴티티 커미션 등, 포트폴리오 대부분을 차지하는 제품 디자인·브랜딩 작업과 병행해온 그래픽·일러스트레이션 작업들을 모아둔 아카이브입니다.",
        "여기 실린 작업들은 개인 시리즈가 아니라 각각 구체적인 브리프에 맞춰 진행한 것으로, 인쇄물부터 디지털 일러스트레이션, 지인 스튜디오와 소규모 로컬 비즈니스를 위한 소량 아이덴티티 프로젝트까지 다양합니다.",
      ],
    },
    note: "이 프로젝트는 아직 사진을 연결하지 않았어요 — 사진은 직접 추가해 주세요.",
  },
};

let projects = [];       // flat list of project records, id-keyed
let groups = [];         // [{ id, name, children: [projectId, ...] }]
let rootOrder = [];      // top-level display order: [{type:"project"|"group", id}]
let currentId = null;

// ---------- storage ----------

function loadState() {
  try { projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { projects = []; }
  try { groups = JSON.parse(localStorage.getItem(GROUPS_KEY) || "[]"); } catch { groups = []; }
  try { rootOrder = JSON.parse(localStorage.getItem(ROOT_ORDER_KEY) || "null"); } catch { rootOrder = null; }
  currentId = localStorage.getItem(CURRENT_KEY) || null;

  if (!rootOrder) {
    // First run, or migrating from the pre-groups version of this tool: every
    // project that existed so far becomes a standalone top-level entry.
    rootOrder = projects.map((p) => ({ type: "project", id: p.id }));
  }

  // Repair photos saved by an earlier bug where seeded photos had no id (so
  // every photo in a project compared equal and the cover star lit up on all
  // of them). Runs every load — cheap, and harmless once already fixed.
  let repaired = false;
  projects.forEach((p) => {
    p.photos.forEach((ph) => {
      if (!ph.id) {
        ph.id = uid();
        repaired = true;
      }
    });

    // Migrate single-language tagline/overview into the EN/KO pair so Generate
    // can hold both at once. Guess which language the existing text is in by
    // checking for Hangul, and leave the other language blank (Generate fills
    // it in later) rather than guessing content that was never written.
    if (p.activeLang === undefined) {
      const isKorean = /[가-힣]/.test(p.overview || p.tagline || "");
      p.activeLang = isKorean ? "ko" : "en";
      p.taglineEn = p.taglineEn ?? (isKorean ? "" : (p.tagline || ""));
      p.overviewEn = p.overviewEn ?? (isKorean ? "" : (p.overview || ""));
      p.taglineKo = p.taglineKo ?? (isKorean ? (p.tagline || "") : "");
      p.overviewKo = p.overviewKo ?? (isKorean ? (p.overview || "") : "");
      repaired = true;
    }
  });

  if (localStorage.getItem(SEEDED_KEY) !== SEED_VERSION) {
    ensureDefaultsSeeded();
    localStorage.setItem(SEEDED_KEY, SEED_VERSION);
    saveState();
  } else if (repaired) {
    saveState();
  }

  if (!currentId || !projects.find((p) => p.id === currentId)) {
    currentId = projects[0]?.id || null;
  }
}

function ensureDefaultsSeeded() {
  DEFAULT_PROJECTS.forEach((dp) => {
    let proj = projects.find((p) => p.slug === dp.data.slug);
    if (!proj) {
      proj = { id: uid(), slugLocked: true, ...JSON.parse(JSON.stringify(dp.data)) };
      // DEFAULT_PROJECTS photo entries don't carry an id (they're hand-written
      // literals) — without one, every photo compares equal to `undefined ===
      // undefined` and the cover-photo star lights up on all of them at once.
      proj.photos = proj.photos.map((ph) => ({ id: uid(), ...ph }));
      // DEFAULT_PROJECTS only carries English copy; seed it into the EN slot so
      // Generate can add a Korean draft alongside it without losing this text.
      proj.activeLang = "en";
      proj.taglineEn = proj.tagline || "";
      proj.overviewEn = proj.overview || "";
      proj.taglineKo = "";
      proj.overviewKo = "";
      projects.push(proj);
    }

    if (dp.group) {
      let group = groups.find((g) => g.name === dp.group);
      if (!group) {
        group = { id: uid(), name: dp.group, children: [] };
        groups.push(group);
        rootOrder.push({ type: "group", id: group.id });
      }
      // In case this project was previously standalone (e.g. seeded by an
      // earlier version of the tool), move it into the group instead of
      // leaving a duplicate top-level entry.
      rootOrder = rootOrder.filter((e) => !(e.type === "project" && e.id === proj.id));
      if (!group.children.includes(proj.id)) group.children.push(proj.id);
    } else {
      const alreadyPlaced =
        rootOrder.some((e) => e.type === "project" && e.id === proj.id) ||
        groups.some((g) => g.children.includes(proj.id));
      if (!alreadyPlaced) rootOrder.push({ type: "project", id: proj.id });
    }
  });
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    localStorage.setItem(ROOT_ORDER_KEY, JSON.stringify(rootOrder));
    if (currentId) localStorage.setItem(CURRENT_KEY, currentId);
  } catch (err) {
    alert(
      "저장 공간이 부족해요. 브라우저 로컬 저장소(localStorage) 용량 한도를 넘었을 수 있어요.\n" +
      "사진 개수를 줄이거나, 다 만든 프로젝트는 Export 후 삭제해 주세요."
    );
    console.error(err);
  }
}

function currentProject() {
  return projects.find((p) => p.id === currentId) || null;
}

function findGroup(id) {
  return groups.find((g) => g.id === id) || null;
}

function getGroupOfProject(projectId) {
  return groups.find((g) => g.children.includes(projectId)) || null;
}

// ---------- helpers ----------

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function slugify(s) {
  return (
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "project"
  );
}

function resizeImage(file, maxDim = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width >= height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > width && height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      URL.revokeObjectURL(url);
      resolve({ dataUrl, width, height });
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Photos are either a freshly-added `dataUrl` (embedded, not on disk yet) or an
// `src` pointing at an image that already exists under assets/images/ (seeded
// from DEFAULT_PROJECTS). `forExport` controls the path base: the exported page
// sits at the portfolio root, but the builder's own UI and iframe preview live
// one level down in /builder/, so existing-asset paths need a "../" prefix there.
function photoSrc(photo, { forExport = false } = {}) {
  if (photo.dataUrl) return photo.dataUrl;
  if (photo.src) return forExport ? photo.src : `../${photo.src}`;
  return "";
}

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(",");
  const mime = meta.match(/:(.*?);/)[1];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Generic drag-to-reorder for a <ul> whose direct <li> children carry
// data-index. Used for the root project/group list, each group's nested
// children list, and the photo list.
function enableSortable(ulEl, onReorder) {
  let dragIndex = null;
  ulEl.querySelectorAll(":scope > li[data-index]").forEach((li) => {
    li.addEventListener("dragstart", (e) => {
      e.stopPropagation();
      dragIndex = Number(li.dataset.index);
      li.classList.add("dragging");
    });
    li.addEventListener("dragend", (e) => {
      e.stopPropagation();
      li.classList.remove("dragging");
      dragIndex = null;
    });
    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    li.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetIndex = Number(li.dataset.index);
      if (dragIndex === null || dragIndex === targetIndex) return;
      onReorder(dragIndex, targetIndex);
    });
  });
}

// ---------- project / group structure ----------

function removeProjectFromEverywhere(projectId) {
  rootOrder = rootOrder.filter((e) => !(e.type === "project" && e.id === projectId));
  groups.forEach((g) => { g.children = g.children.filter((id) => id !== projectId); });
}

function setProjectCategory(projectId, groupId) {
  removeProjectFromEverywhere(projectId);
  const g = groupId ? findGroup(groupId) : null;
  if (g) {
    g.children.push(projectId);
  } else {
    rootOrder.push({ type: "project", id: projectId });
  }
  saveState();
  renderProjectList();
  renderPreview();
}

function createGroup(name) {
  const g = { id: uid(), name: (name || "").trim() || "Untitled Group", children: [] };
  groups.push(g);
  rootOrder.push({ type: "group", id: g.id });
  return g;
}

function renameGroup(groupId) {
  const g = findGroup(groupId);
  if (!g) return;
  const name = prompt("대분류 이름", g.name);
  if (name === null) return;
  g.name = name.trim() || g.name;
  saveState();
  renderProjectList();
  renderEditor();
  renderPreview();
}

function deleteGroup(groupId) {
  const g = findGroup(groupId);
  if (!g) return;
  if (!confirm(`"${g.name}" 대분류를 삭제할까요? 안에 있던 프로젝트들은 최상위로 이동해요.`)) return;
  g.children.forEach((pid) => rootOrder.push({ type: "project", id: pid }));
  groups = groups.filter((x) => x.id !== groupId);
  rootOrder = rootOrder.filter((e) => !(e.type === "group" && e.id === groupId));
  saveState();
  renderProjectList();
  renderEditor();
  renderPreview();
}

// ---------- project list (left) ----------

function renderProjectList() {
  const list = document.getElementById("project-list");
  if (!rootOrder.length) {
    list.innerHTML = `<li class="empty-list">아직 프로젝트가 없어요.<br>위에서 새로 만들어보세요.</li>`;
    return;
  }

  list.innerHTML = rootOrder
    .map((entry, i) => {
      if (entry.type === "group") {
        const g = findGroup(entry.id);
        if (!g) return "";
        const children = g.children.map((pid) => projects.find((p) => p.id === pid)).filter(Boolean);
        return `
          <li draggable="true" data-index="${i}" class="group-row">
            <div class="row-main group-header">
              <span class="drag-handle">&#8942;&#8942;</span>
              <span class="group-name">${escapeHtml(g.name)}</span>
              <button class="rename-group" data-id="${g.id}" title="Rename">&#9998;</button>
              <button class="delete-group" data-id="${g.id}" title="Delete group">&times;</button>
            </div>
            <ul class="group-children" data-group-id="${g.id}">
              ${children.map((p, j) => projectRowHTML(p, j)).join("")}
            </ul>
          </li>`;
      }
      const p = projects.find((x) => x.id === entry.id);
      if (!p) return "";
      return `<li draggable="true" data-index="${i}" class="${p.id === currentId ? "active" : ""}">${projectRowHTML(p, null, true)}</li>`;
    })
    .join("");

  bindProjectListEvents();
}

function projectRowHTML(p, childIndex, isTopLevel) {
  const draftTag = p.photos.length ? "" : `<span class="draft-tag">draft</span>`;
  const rowAttrs = isTopLevel ? "" : `draggable="true" data-index="${childIndex}"`;
  const cls = isTopLevel ? "row-main" : (p.id === currentId ? "active" : "");
  const wrapTag = isTopLevel ? "div" : "li";
  return `
    <${wrapTag} class="${cls}" ${rowAttrs}>
      ${isTopLevel ? "" : `<span class="drag-handle">&#8942;&#8942;</span>`}
      <button class="select" data-id="${p.id}">${escapeHtml(p.name || "Untitled")} ${draftTag}</button>
      <button class="delete" data-id="${p.id}" title="Delete project">&times;</button>
    </${wrapTag}>`;
}

function bindProjectListEvents() {
  const listEl = document.getElementById("project-list");

  listEl.querySelectorAll("button.select").forEach((btn) => {
    btn.addEventListener("click", () => selectProject(btn.dataset.id));
  });
  listEl.querySelectorAll("button.delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteProject(btn.dataset.id);
    });
  });
  listEl.querySelectorAll("button.rename-group").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      renameGroup(btn.dataset.id);
    });
  });
  listEl.querySelectorAll("button.delete-group").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteGroup(btn.dataset.id);
    });
  });

  enableSortable(listEl, (from, to) => {
    const [moved] = rootOrder.splice(from, 1);
    rootOrder.splice(to, 0, moved);
    saveState();
    renderProjectList();
    renderPreview();
  });

  listEl.querySelectorAll(".group-children").forEach((ul) => {
    const groupId = ul.dataset.groupId;
    enableSortable(ul, (from, to) => {
      const g = findGroup(groupId);
      if (!g) return;
      const [moved] = g.children.splice(from, 1);
      g.children.splice(to, 0, moved);
      saveState();
      renderProjectList();
      renderPreview();
    });
  });
}

function selectProject(id) {
  currentId = id;
  saveState();
  renderProjectList();
  renderEditor();
  renderPreview();
}

function newProject() {
  const p = {
    id: uid(),
    slug: "",
    slugLocked: false,
    name: "Untitled Project",
    tagline: "",
    client: "",
    role: "",
    year: "",
    type: "",
    overview: "",
    activeLang: "en",
    taglineEn: "",
    overviewEn: "",
    taglineKo: "",
    overviewKo: "",
    photos: [],
    coverPhotoId: null,
  };
  p.slug = slugify(p.name);
  projects.push(p);
  rootOrder.push({ type: "project", id: p.id });
  currentId = p.id;
  saveState();
  renderProjectList();
  renderEditor();
  renderPreview();
}

function deleteProject(id) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;
  if (!confirm(`"${p.name || "Untitled"}" 프로젝트를 삭제할까요? 되돌릴 수 없어요.`)) return;
  removeProjectFromEverywhere(id);
  projects = projects.filter((x) => x.id !== id);
  if (currentId === id) currentId = projects[0]?.id || null;
  saveState();
  renderProjectList();
  renderEditor();
  renderPreview();
}

// ---------- editor (center) ----------

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function renderEditor() {
  const panel = document.getElementById("editor-panel");
  const p = currentProject();
  if (!p) {
    panel.innerHTML = `<div class="editor-empty">왼쪽에서 프로젝트를 선택하거나 새로 만들어 주세요.</div>`;
    return;
  }

  const currentGroup = getGroupOfProject(p.id);
  const categoryOptions = [
    `<option value="">없음 (최상위 프로젝트)</option>`,
    ...groups.map((g) => `<option value="${g.id}" ${currentGroup?.id === g.id ? "selected" : ""}>${escapeHtml(g.name)}</option>`),
    `<option value="__new__">+ 새 대분류 만들기...</option>`,
  ].join("");

  panel.innerHTML = `
    <div class="field-group generate-row">
      <button id="generate-btn" class="btn btn-dark btn-small" type="button">&#10022; Generate</button>
      <div class="lang-toggle" id="overview-lang-toggle" role="group" aria-label="Draft language">
        <button type="button" class="lang-pill ${p.activeLang !== "ko" ? "active" : ""}" data-lang="en">EN</button>
        <button type="button" class="lang-pill ${p.activeLang === "ko" ? "active" : ""}" data-lang="ko">KO</button>
      </div>
      <span class="hint">Generate를 누르면 영문·한글 태그라인·개요를 한 번에 만들어요. EN/KO 버튼으로 보여지는 언어를 바꿀 수 있어요. API 키 필요 없음.</span>
    </div>
    <div class="field-group">
      <label for="f-name">Project Name (소분류)</label>
      <input id="f-name" type="text" value="${escapeHtml(p.name)}">
    </div>
    <div class="field-group">
      <label for="f-category">Category (대분류)</label>
      <select id="f-category">${categoryOptions}</select>
    </div>
    <div class="field-group">
      <label for="f-slug">Slug (file name)</label>
      <input id="f-slug" type="text" value="${escapeHtml(p.slug)}">
    </div>
    <div class="field-group">
      <label for="f-tagline">Tagline</label>
      <input id="f-tagline" type="text" value="${escapeHtml(p.tagline)}" placeholder="One line describing the project">
    </div>
    <div class="field-row">
      <div class="field-group"><label for="f-client">Client</label><input id="f-client" type="text" value="${escapeHtml(p.client)}"></div>
      <div class="field-group"><label for="f-role">Role</label><input id="f-role" type="text" value="${escapeHtml(p.role)}"></div>
      <div class="field-group"><label for="f-year">Year</label><input id="f-year" type="text" value="${escapeHtml(p.year)}"></div>
      <div class="field-group"><label for="f-type">Type</label><input id="f-type" type="text" value="${escapeHtml(p.type)}"></div>
    </div>
    <div class="field-group">
      <label for="f-overview">Overview</label>
      <textarea id="f-overview" rows="7" placeholder="빈 줄로 문단을 구분하세요.">${escapeHtml(p.overview)}</textarea>
    </div>

    <div class="section-title">Photos</div>
    <div class="photos-header">
      <label class="field-label">${p.photos.length} photo${p.photos.length === 1 ? "" : "s"}</label>
      <label class="btn btn-ghost btn-small" for="photo-input">+ Add Photos</label>
      <input type="file" id="photo-input" accept="image/*" multiple hidden>
    </div>
    <ul id="photo-list" class="photo-list"></ul>
    <p class="hint">드래그해서 순서를 바꿀 수 있어요. 이 순서 그대로 상세 페이지에 실립니다. &#9733; 를 누르면 그 사진이 인트로 페이지 카드 이미지로 쓰여요 (기본값은 첫 번째 사진). &#10530; 를 누르면 최대 픽셀을 지정해서 그 사진만 다시 리사이즈할 수 있어요.</p>
    ${p.photos.some((ph) => ph.src) ? `<p class="hint">이미 <code>assets/images/</code>에 있는 사진은 Export 때 다시 다운로드하지 않아요. 슬러그를 바꿨다면 그 폴더도 같이 이름을 바꿔주세요.</p>` : ""}

    <div class="export-section">
      <div class="export-row">
        <button id="publish-btn" class="btn btn-dark" type="button">&#8593; Publish</button>
        <button id="export-btn" class="btn btn-ghost" type="button">Export Page &amp; Images</button>
      </div>
      <p class="hint">
        <strong>Publish</strong>는 이 페이지·새 사진·목차 전체를 깃허브(<code id="gh-repo-hint">${escapeHtml(getGithubConfig().repo || "설정 필요")}</code>)에 바로 올려요 — Vercel이 연결돼 있으면 자동 배포까지 이어져요.
        <button id="gh-settings-btn" class="link-btn" type="button">깃허브 설정</button>
      </p>
      <p class="hint">Export는 예전처럼 파일만 다운로드해요 — 수동으로 옮기고 싶을 때 쓰세요.</p>
    </div>
  `;

  renderPhotoList();
  bindEditorEvents();
}

// Builds tagline/overview text for a single language — pure, no mutation.
// Known projects pick from pre-written copy in AI_CONTENT (by language, then
// trimmed/reshaped by length & structure); anything new falls back to a plain
// local template built from whatever fields are already filled in.
function buildGeneratedContent(p, settings, lang) {
  const preset = AI_CONTENT[p.slug];
  let tagline, paragraphs, photosPreset, note;

  if (preset?.[lang]) {
    tagline = preset[lang].tagline;
    paragraphs = [...preset[lang].paragraphs];
    if (settings.voice === "third" && preset[lang].thirdPersonOverrides) {
      Object.entries(preset[lang].thirdPersonOverrides).forEach(([idx, text]) => {
        paragraphs[Number(idx)] = text;
      });
    }
    photosPreset = preset.photos;
    note = preset.note;
  } else if (lang === "ko") {
    tagline = [p.type, p.client && `${p.client} 프로젝트`].filter(Boolean).join(" · ") || `${p.name} 프로젝트`;
    paragraphs = [
      `${p.name}${/[가-힣]$/.test(p.name) ? "은" : "는"} ${[p.client, p.year].filter(Boolean).join(", ") || "이 포트폴리오"}에서 진행한 프로젝트입니다.`,
      "여기에 더 긴 설명을 추가하세요 — 브리프가 무엇이었는지, 무엇을 디자인했는지, 무엇이 좋았는지.",
    ];
  } else {
    tagline = [p.type, p.client && `for ${p.client}`].filter(Boolean).join(" ") || `A ${p.name} project.`;
    paragraphs = [
      `${p.name} is a project${p.client ? ` for ${p.client}` : ""}${p.year ? `, ${p.year}` : ""}.`,
      "Add a longer description here — what the brief was, what you designed, and what made it work.",
    ];
  }

  const emphasis = (settings.emphasis || "").trim();

  if (settings.length === "short") {
    paragraphs = paragraphs.slice(0, 1);
  } else if (settings.length === "long" && emphasis) {
    paragraphs = [...paragraphs, emphasis];
  }
  if (settings.structure === "three-acts" && paragraphs.length < 3 && emphasis && settings.length !== "long") {
    paragraphs = [...paragraphs, emphasis];
  }

  const overview = settings.structure === "single" ? paragraphs.join(" ") : paragraphs.join("\n\n");
  return { tagline, overview, photosPreset, note };
}

// Generates BOTH English and Korean drafts at once and stores them side by
// side on the project, so the two lang-toggle buttons in the editor can
// switch between them without regenerating. The Language pill only decides
// which of the two becomes the one shown/edited right after this call.
function applyGeneratedContent(p, settings) {
  const en = buildGeneratedContent(p, settings, "en");
  const ko = buildGeneratedContent(p, settings, "ko");

  p.taglineEn = en.tagline;
  p.overviewEn = en.overview;
  p.taglineKo = ko.tagline;
  p.overviewKo = ko.overview;
  p.generateSettings = settings;

  const activeLang = settings.language === "ko" ? "ko" : "en";
  p.activeLang = activeLang;
  p.tagline = activeLang === "ko" ? ko.tagline : en.tagline;
  p.overview = activeLang === "ko" ? ko.overview : en.overview;

  const photosPreset = en.photosPreset || ko.photosPreset;
  if (photosPreset?.length && (!p.photos.length || settings.photoFlow === "detail-wide" || settings.photoFlow === "wide-detail")) {
    let photos = p.photos.length ? p.photos : photosPreset.map((ph) => ({ id: uid(), ...ph }));
    if (settings.photoFlow === "detail-wide" || settings.photoFlow === "wide-detail") {
      const dir = settings.photoFlow === "detail-wide" ? 1 : -1;
      photos = [...photos].sort((a, b) => dir * ((a.width || 1) / (a.height || 1) - (b.width || 1) / (b.height || 1)));
    }
    p.photos = photos;
  }

  saveState();
  renderPhotoList();
  renderEditor_updatePhotoCount();
  renderProjectList();
  renderPreview();

  const note = en.note || ko.note;
  if (note) setTimeout(() => alert(note), 50);
}

// Switches which language's draft is showing/editable in the Tagline/Overview
// fields, without touching the other language's stored text.
function setActiveLang(p, lang) {
  p.activeLang = lang === "ko" ? "ko" : "en";
  p.tagline = p.activeLang === "ko" ? (p.taglineKo || "") : (p.taglineEn || "");
  p.overview = p.activeLang === "ko" ? (p.overviewKo || "") : (p.overviewEn || "");
  saveState();
  renderEditor();
  renderPreview();
}

let generateTargetProjectId = null;

function openGenerateDialog(p) {
  generateTargetProjectId = p.id;
  document.getElementById("generate-subtitle").textContent = (p.name || "Untitled").toUpperCase();

  const settings = {
    language: "en",
    tone: "portfolio",
    voice: "auto",
    length: "medium",
    structure: "vignettes",
    photoFlow: "match",
    emphasis: "",
    toneNotes: "",
    ...(p.generateSettings || {}),
  };

  document.querySelectorAll("#generate-dialog .pill-row").forEach((row) => {
    const group = row.dataset.group;
    row.querySelectorAll(".pill").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.value === settings[group]);
    });
  });
  document.getElementById("generate-emphasis").value = settings.emphasis;
  document.getElementById("generate-tone-notes").value = settings.toneNotes;

  document.getElementById("generate-dialog").showModal();
}

function initGenerateDialog() {
  const dialog = document.getElementById("generate-dialog");
  if (!dialog) return;

  dialog.querySelectorAll(".pill-row").forEach((row) => {
    row.querySelectorAll(".pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        row.querySelectorAll(".pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });

  document.getElementById("close-generate").addEventListener("click", () => dialog.close());
  document.getElementById("generate-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  document.getElementById("generate-confirm").addEventListener("click", () => {
    const p = projects.find((x) => x.id === generateTargetProjectId);
    if (!p) {
      dialog.close();
      return;
    }
    // Only ask before overwriting if the current text was hand-typed and
    // doesn't already match a stored EN/KO draft — regenerating a project
    // that's already showing generated text is not destructive, so don't
    // block on a confirm() the user has to notice and click through.
    const current = (p.overview || "").trim();
    const isCustom = current && current !== (p.overviewEn || "").trim() && current !== (p.overviewKo || "").trim();
    if (isCustom && !confirm("Overview에 직접 입력한 내용이 있어요. 새로 생성하면 덮어써요 — 계속할까요?")) return;

    const settings = {
      language: "en",
      tone: "portfolio",
      voice: "auto",
      length: "medium",
      structure: "vignettes",
      photoFlow: "match",
    };
    dialog.querySelectorAll(".pill-row").forEach((row) => {
      const active = row.querySelector(".pill.active");
      if (active) settings[row.dataset.group] = active.dataset.value;
    });
    settings.emphasis = document.getElementById("generate-emphasis").value;
    settings.toneNotes = document.getElementById("generate-tone-notes").value;

    applyGeneratedContent(p, settings);
    dialog.close();
    renderEditor();
  });
}

function bindEditorEvents() {
  const p = currentProject();
  if (!p) return;

  const nameInput = document.getElementById("f-name");
  const slugInput = document.getElementById("f-slug");
  const categorySelect = document.getElementById("f-category");

  document.getElementById("generate-btn").addEventListener("click", () => openGenerateDialog(p));

  document.querySelectorAll("#overview-lang-toggle .lang-pill").forEach((btn) => {
    btn.addEventListener("click", () => setActiveLang(p, btn.dataset.lang));
  });

  nameInput.addEventListener("input", () => {
    p.name = nameInput.value;
    if (!p.slugLocked) {
      p.slug = slugify(p.name);
      slugInput.value = p.slug;
    }
    saveState();
    renderProjectList();
    renderPreview();
  });

  slugInput.addEventListener("input", () => {
    p.slugLocked = true;
    p.slug = slugify(slugInput.value);
    saveState();
  });

  categorySelect.addEventListener("change", () => {
    const val = categorySelect.value;
    if (val === "__new__") {
      const name = prompt("새 대분류 이름 (예: BADMARLON)");
      if (!name || !name.trim()) {
        renderEditor();
        return;
      }
      const g = createGroup(name);
      setProjectCategory(p.id, g.id);
    } else {
      setProjectCategory(p.id, val || null);
    }
    renderEditor();
  });

  const bind = (id, field) => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      p[field] = el.value;
      saveState();
      renderPreview();
    });
  };
  bind("f-client", "client");
  bind("f-role", "role");
  bind("f-year", "year");
  bind("f-type", "type");

  // Tagline/Overview mirror into the EN/KO store that matches whichever
  // language is currently active, so manual edits survive toggling away and back.
  const bindLangField = (id, field, fieldEn, fieldKo) => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      p[field] = el.value;
      if (p.activeLang === "ko") p[fieldKo] = el.value;
      else p[fieldEn] = el.value;
      saveState();
      renderPreview();
    });
  };
  bindLangField("f-tagline", "tagline", "taglineEn", "taglineKo");
  bindLangField("f-overview", "overview", "overviewEn", "overviewKo");

  document.getElementById("photo-input").addEventListener("change", async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    for (const file of files) {
      try {
        const { dataUrl, width, height } = await resizeImage(file);
        p.photos.push({ id: uid(), name: file.name, alt: "", dataUrl, width, height });
        saveState();
        renderPhotoList();
        renderEditor_updatePhotoCount();
        renderProjectList();
        renderPreview();
      } catch (err) {
        console.error("Failed to load image", file.name, err);
      }
    }
  });

  document.getElementById("export-btn").addEventListener("click", exportProject);
  document.getElementById("publish-btn").addEventListener("click", () => publishProject(p));
  document.getElementById("gh-settings-btn").addEventListener("click", async () => {
    await configureGithub();
    renderEditor();
  });
}

function renderEditor_updatePhotoCount() {
  const p = currentProject();
  const label = document.querySelector(".photos-header .field-label");
  if (p && label) label.textContent = `${p.photos.length} photo${p.photos.length === 1 ? "" : "s"}`;
}

function renderPhotoList() {
  const p = currentProject();
  const list = document.getElementById("photo-list");
  if (!p || !list) return;

  const cover = coverPhoto(p);

  list.innerHTML = p.photos
    .map((ph, i) => {
      const isCover = cover && ph.id === cover.id;
      return `
      <li draggable="true" data-index="${i}" class="photo-card ${isCover ? "is-cover" : ""}">
        <div class="photo-card-image">
          <img src="${photoSrc(ph)}" alt="">
          <button class="set-cover" data-id="${ph.id}" title="${isCover ? "Card image" : "Use as card image"}">${isCover ? "&#9733;" : "&#9734;"}</button>
          <span class="photo-dims">${ph.width}&times;${ph.height}</span>
        </div>
        <div class="photo-card-tools">
          <span class="drag-handle" title="Drag to reorder">&#8942;&#8942;</span>
          <button class="crop-photo" data-id="${ph.id}" title="Crop">&#9986;</button>
          <button class="resize-photo" data-id="${ph.id}" title="Resize">&#10530;</button>
          <button class="remove-photo" data-index="${i}" title="Remove">&times;</button>
        </div>
        <input class="alt-input" data-index="${i}" type="text" placeholder="Alt text" value="${escapeHtml(ph.alt)}">
      </li>`;
    })
    .join("");

  list.querySelectorAll("button.remove-photo").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      const removed = p.photos[i];
      p.photos.splice(i, 1);
      if (removed && p.coverPhotoId === removed.id) p.coverPhotoId = null;
      saveState();
      renderPhotoList();
      renderEditor_updatePhotoCount();
      renderProjectList();
      renderPreview();
    });
  });

  list.querySelectorAll("button.set-cover").forEach((btn) => {
    btn.addEventListener("click", () => {
      p.coverPhotoId = btn.dataset.id;
      saveState();
      renderPhotoList();
      renderProjectList();
    });
  });

  list.querySelectorAll("button.resize-photo").forEach((btn) => {
    btn.addEventListener("click", () => handleResizePhoto(p, btn.dataset.id));
  });

  list.querySelectorAll("button.crop-photo").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ph = p.photos.find((x) => x.id === btn.dataset.id);
      if (ph) openCropDialog(p, ph);
    });
  });

  list.querySelectorAll("input.alt-input").forEach((input) => {
    input.addEventListener("input", () => {
      const i = Number(input.dataset.index);
      p.photos[i].alt = input.value;
      saveState();
      renderPreview();
    });
  });

  enableSortable(list, (from, to) => {
    const [moved] = p.photos.splice(from, 1);
    p.photos.splice(to, 0, moved);
    saveState();
    renderPhotoList();
    renderPreview();
  });
}

// Re-encodes a photo at a smaller max dimension via canvas. Works for
// newly-added photos (dataUrl) and, best-effort, for photos that only exist
// on disk (src) — those load through an <img> tag first; if the browser
// treats that as cross-origin and taints the canvas, we tell the user rather
// than fail silently.
function resizeImageAt(source, maxDim, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { naturalWidth: width, naturalHeight: height } = img;
      if (width >= height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > width && height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      } else if (width <= maxDim && height <= maxDim) {
        resolve({ dataUrl: null, width: img.naturalWidth, height: img.naturalHeight, unchanged: true });
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      try {
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", quality), width, height });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = source;
  });
}

async function handleResizePhoto(p, photoId) {
  const ph = p.photos.find((x) => x.id === photoId);
  if (!ph) return;

  const longest = Math.max(ph.width, ph.height);
  const input = prompt(`가장 긴 변의 최대 픽셀을 입력하세요 (현재 ${ph.width}×${ph.height})`, String(Math.min(longest, 1600)));
  if (!input) return;
  const maxDim = parseInt(input, 10);
  if (!Number.isFinite(maxDim) || maxDim < 50) {
    alert("50 이상의 숫자를 입력해 주세요.");
    return;
  }

  try {
    const result = await resizeImageAt(photoSrc(ph), maxDim);
    if (result.unchanged) {
      alert(`이미 ${result.width}×${result.height}로, 지정한 크기보다 작거나 같아요.`);
      return;
    }
    ph.dataUrl = result.dataUrl;
    delete ph.src;
    ph.width = result.width;
    ph.height = result.height;
    saveState();
    renderPhotoList();
    renderPreview();
  } catch (err) {
    alert("이 사진은 이 브라우저에서 리사이즈할 수 없어요 (보안 정책 때문일 수 있어요). 원본 파일 크기를 직접 줄여서 다시 추가해 주세요.");
    console.error(err);
  }
}

// ---------- crop dialog ----------

const CROP_RATIOS = { free: null, "1:1": 1, "4:5": 4 / 5, "4:3": 4 / 3, "16:9": 16 / 9 };

// All state for the crop box lives here while the dialog is open — sized in
// on-screen (displayed) pixels; converted to natural image pixels only at
// Apply time. Cleared when the dialog closes.
let cropState = null;

function clampCropBox(box, stageW, stageH, ratio) {
  const MIN = 24;
  let { x, y, w, h } = box;
  w = Math.max(MIN, Math.min(w, stageW));
  h = Math.max(MIN, Math.min(h, stageH));
  if (ratio) {
    // Re-derive height from width to keep the ratio exact, then re-clamp.
    h = w / ratio;
    if (h > stageH) { h = stageH; w = h * ratio; }
  }
  x = Math.max(0, Math.min(x, stageW - w));
  y = Math.max(0, Math.min(y, stageH - h));
  return { x, y, w, h };
}

function renderCropBox() {
  if (!cropState) return;
  const el = document.getElementById("crop-box");
  const { x, y, w, h } = cropState.box;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

  const scale = cropState.naturalW / cropState.displayW;
  const nw = Math.round(w * scale);
  const nh = Math.round(h * scale);
  document.getElementById("crop-dims-hint").textContent = `${nw} × ${nh}px 로 잘려요.`;
}

function openCropDialog(project, photo) {
  const dialog = document.getElementById("crop-dialog");
  const img = document.getElementById("crop-image");
  const stage = document.getElementById("crop-stage");

  document.getElementById("crop-subtitle").textContent = photo.name || "";
  dialog.querySelectorAll('[data-group="crop-ratio"] .pill').forEach((b) => {
    b.classList.toggle("active", b.dataset.ratio === "free");
  });

  img.src = photoSrc(photo);
  img.onload = () => {
    requestAnimationFrame(() => {
      const rect = img.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const displayW = rect.width;
      const displayH = rect.height;
      const offsetX = rect.left - stageRect.left;
      const offsetY = rect.top - stageRect.top;

      cropState = {
        project,
        photo,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
        displayW,
        displayH,
        offsetX,
        offsetY,
        ratio: null,
        box: { x: displayW * 0.1, y: displayH * 0.1, w: displayW * 0.8, h: displayH * 0.8 },
      };
      // Position the box relative to the stage, not the image, since the
      // image is centered within a taller/wider stage box.
      document.getElementById("crop-box").style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      renderCropBox();
    });
  };

  dialog.showModal();
}

function closeCropDialog() {
  document.getElementById("crop-dialog").close();
  cropState = null;
}

function initCropDialog() {
  const dialog = document.getElementById("crop-dialog");
  const stage = document.getElementById("crop-stage");
  const box = document.getElementById("crop-box");
  if (!dialog || !stage || !box) return;

  document.getElementById("close-crop").addEventListener("click", closeCropDialog);
  document.getElementById("cancel-crop").addEventListener("click", closeCropDialog);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeCropDialog(); });

  dialog.querySelectorAll('[data-group="crop-ratio"] .pill').forEach((btn) => {
    btn.addEventListener("click", () => {
      dialog.querySelectorAll('[data-group="crop-ratio"] .pill').forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (!cropState) return;
      cropState.ratio = CROP_RATIOS[btn.dataset.ratio];
      cropState.box = clampCropBox(cropState.box, cropState.displayW, cropState.displayH, cropState.ratio);
      renderCropBox();
    });
  });

  // Move the whole box by dragging its body.
  box.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("crop-handle") || !cropState) return;
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const start = { ...cropState.box };
    box.setPointerCapture(e.pointerId);

    const onMove = (ev) => {
      cropState.box = clampCropBox(
        { ...start, x: start.x + (ev.clientX - startX), y: start.y + (ev.clientY - startY) },
        cropState.displayW, cropState.displayH, cropState.ratio
      );
      renderCropBox();
    };
    const onUp = () => {
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
  });

  // Resize from whichever corner handle is grabbed, anchored at the opposite corner.
  box.querySelectorAll(".crop-handle").forEach((handle) => {
    handle.addEventListener("pointerdown", (e) => {
      if (!cropState) return;
      e.preventDefault();
      e.stopPropagation();
      const corner = handle.dataset.handle;
      const startX = e.clientX, startY = e.clientY;
      const start = { ...cropState.box };
      handle.setPointerCapture(e.pointerId);

      const anchorX = corner.includes("w") ? start.x + start.w : start.x;
      const anchorY = corner.includes("n") ? start.y + start.h : start.y;

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let x1 = corner.includes("w") ? start.x + dx : start.x;
        let y1 = corner.includes("n") ? start.y + dy : start.y;
        let w = Math.abs(anchorX - x1);
        let h = Math.abs(anchorY - y1);
        let x = Math.min(anchorX, x1);
        let y = Math.min(anchorY, y1);
        if (cropState.ratio) h = w / cropState.ratio;
        // Keep the box anchored at the fixed corner even after the ratio re-derives h.
        y = corner.includes("n") ? anchorY - h : anchorY;
        x = corner.includes("w") ? anchorX - w : anchorX;
        cropState.box = clampCropBox({ x, y, w, h }, cropState.displayW, cropState.displayH, null);
        renderCropBox();
      };
      const onUp = () => {
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
    });
  });

  document.getElementById("apply-crop").addEventListener("click", () => {
    if (!cropState) return;
    const { project, photo, naturalW, displayW, box } = cropState;
    const scale = naturalW / displayW;
    const sx = Math.round(box.x * scale);
    const sy = Math.round(box.y * scale);
    const sw = Math.round(box.w * scale);
    const sh = Math.round(box.h * scale);

    const img = document.getElementById("crop-image");
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    canvas.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    let dataUrl;
    try {
      dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    } catch (err) {
      alert("이 사진은 이 브라우저에서 자를 수 없어요 (보안 정책 때문일 수 있어요).");
      console.error(err);
      return;
    }

    photo.dataUrl = dataUrl;
    delete photo.src;
    photo.width = sw;
    photo.height = sh;
    saveState();
    renderPhotoList();
    renderPreview();
    closeCropDialog();
  });
}

// ---------- shared page markup (used by both preview + export) ----------

function overviewParagraphsHTML(overview) {
  const paras = (overview || "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!paras.length) return "<p>&nbsp;</p>";
  return paras.map((s) => `<p>${escapeHtml(s)}</p>`).join("\n          ");
}

function galleryHTML(project, srcFn) {
  if (!project.photos.length) {
    return `<p class="hint">아직 사진이 없어요. 왼쪽 편집기에서 추가해 보세요.</p>`;
  }
  return project.photos
    .map(
      (ph, i) =>
        `<img src="${srcFn(ph, i)}" alt="${escapeHtml(ph.alt || project.name)}" width="${ph.width}" height="${ph.height}" loading="lazy">`
    )
    .join("\n        ");
}

function detailsGridHTML(project) {
  return `
      <div class="details-grid">
        <div>
          <h2>Details</h2>
          <div class="details-list">
            <div class="row"><span>Client</span><span>${escapeHtml(project.client) || "&mdash;"}</span></div>
            <div class="row"><span>Role</span><span>${escapeHtml(project.role) || "&mdash;"}</span></div>
            <div class="row"><span>Year</span><span>${escapeHtml(project.year) || "&mdash;"}</span></div>
            <div class="row"><span>Type</span><span>${escapeHtml(project.type) || "&mdash;"}</span></div>
          </div>
        </div>
        <div class="description">
          <h2>Overview</h2>
          ${overviewParagraphsHTML(project.overview)}
        </div>
      </div>`;
}

function pageBodyHTML(project, { srcFn, indexList, groupName }) {
  const idxLabel = groupName
    ? [groupName, project.type || project.client].filter(Boolean).join(" &mdash; ")
    : [project.client, project.type].filter(Boolean).join(" &mdash; ") || "&nbsp;";
  return `
<header class="site-header">
  <div class="site-title">YUJIYEON</div>
  <nav class="site-nav">
    <button id="open-info" type="button">Information</button>
    <a href="https://www.instagram.com/jiy.y" target="_blank" rel="noopener">Instagram</a>
    <button id="open-contact" type="button">Email</button>
  </nav>
</header>

<div class="layout">
  <aside class="sidebar">
    <div class="section-label">Index</div>
    <ul class="project-index" id="project-index">${indexList}</ul>

    <footer>All Rights Reserved &copy; 2026</footer>
  </aside>

  <main class="main">
    <div class="main-inner">
      <a class="back-link" href="index.html">&larr; All Projects</a>

      <div class="project-head">
        <div class="idx-label">${idxLabel}</div>
        <h1>${escapeHtml(project.name) || "Untitled Project"}</h1>
        <p class="tagline">${escapeHtml(project.tagline)}</p>
      </div>

      <div class="gallery">
        ${galleryHTML(project, srcFn)}
      </div>
      ${detailsGridHTML(project)}
    </div>
  </main>
</div>

<dialog id="info-dialog">
  <div class="info-panel">
    <h2>Information</h2>
    <p>Yujiyeon is a product designer working across branding and physical product design.</p>
    <p>hello@yujiyeon.com</p>
    <button class="close-btn" id="close-info" type="button">Close</button>
  </div>
</dialog>

<dialog id="contact-dialog">
  <div class="contact-panel">
    <div class="contact-header">
      <h2>Contact</h2>
      <button id="close-contact" class="icon-close" type="button" aria-label="Close">&times;</button>
    </div>
    <form id="contact-form" class="contact-form">
      <input type="email" id="contact-from" placeholder="From: (enter your email address)..." required>
      <textarea id="contact-message" placeholder="Write your message..." required></textarea>
      <div class="contact-actions">
        <button type="button" id="cancel-contact" class="btn btn-ghost">Cancel</button>
        <button type="submit" class="btn btn-dark">Send</button>
      </div>
    </form>
  </div>
</dialog>`;
}

// ---------- PROJECTS array (drives the preview's sidebar + the copy-out) ----------

// The card image used in the intro page's deck. Defaults to the first photo,
// but can be pinned to any photo via the star button in the photo list.
function coverPhoto(p) {
  return p.photos.find((ph) => ph.id === p.coverPhotoId) || p.photos[0] || null;
}

function leafFromProject(p, { forExport = true } = {}) {
  const meta = [p.client, p.type].filter(Boolean).join(" — ");
  const leaf = { slug: p.slug, name: p.name, href: p.photos.length ? `${p.slug}.html` : null };
  const cover = coverPhoto(p);
  if (cover) leaf.thumb = photoSrc(cover, { forExport });
  if (meta) leaf.meta = meta;
  return leaf;
}

function buildProjectsArrayFromState({ forExport = true } = {}) {
  return rootOrder
    .map((entry) => {
      if (entry.type === "group") {
        const g = findGroup(entry.id);
        if (!g) return null;
        const children = g.children
          .map((id) => projects.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => leafFromProject(p, { forExport }));
        return { slug: slugify(g.name), name: g.name, href: null, children };
      }
      const p = projects.find((x) => x.id === entry.id);
      return p ? leafFromProject(p, { forExport }) : null;
    })
    .filter(Boolean);
}

function indexListHTML(list, currentSlug) {
  const itemRow = (name, href, num) => {
    const inner =
      num != null
        ? `<span class="idx">${num}</span><span class="name">${escapeHtml(name)}</span>`
        : `<span class="name">${escapeHtml(name)}</span>`;
    return href
      ? `<a href="${href}">${inner}</a>`
      : `<span class="disabled">${inner}</span>`;
  };

  return list
    .map((p, i) => {
      const num = String(i + 1).padStart(2, "0");
      const children = p.children || [];
      const active = p.slug === currentSlug;
      const row = itemRow(p.name, p.href, num);
      let sub = "";
      if (children.length) {
        sub = `<ul class="project-subindex">${children
          .map((c) => {
            const childActive = c.slug === currentSlug;
            return `<li class="${childActive ? "active" : ""}">${itemRow(c.name, c.href, null)}</li>`;
          })
          .join("")}</ul>`;
      }
      return `<li class="${active ? "active" : ""}">${row}${sub}</li>`;
    })
    .join("");
}

function projectsArrayJS() {
  const arr = buildProjectsArrayFromState({ forExport: true });
  const json = JSON.stringify(arr, null, 2);
  const unquoted = json.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, "$1:");
  return `const PROJECTS = ${unquoted};\n`;
}

function copyProjectsArray() {
  const code = projectsArrayJS();
  const out = document.getElementById("projects-array-output");
  const codeEl = document.getElementById("projects-array-code");
  out.hidden = false;
  codeEl.value = code;
  codeEl.select();
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(code).catch(() => {});
  }
}

// ---------- preview (right) ----------

function renderPreview() {
  const frame = document.getElementById("preview-frame");
  const p = currentProject();
  if (!p) {
    frame.srcdoc = `<body style="font-family:-apple-system,sans-serif;color:#9a9a9a;display:flex;align-items:center;justify-content:center;height:100vh;font-size:13px;">No project selected</body>`;
    return;
  }
  const arr = buildProjectsArrayFromState({ forExport: false });
  const groupName = getGroupOfProject(p.id)?.name || null;
  const body = pageBodyHTML(p, {
    srcFn: (ph) => photoSrc(ph, { forExport: false }),
    indexList: indexListHTML(arr, p.slug),
    groupName,
  });
  frame.srcdoc = `<!doctype html>
<html><head><meta charset="UTF-8">
<link rel="stylesheet" href="../css/style.css">
<style>body{pointer-events:none;}</style>
</head><body data-project="${p.slug}">${body}</body></html>`;
}

// ---------- export ----------

// Shared by Export and Publish: validates the project and builds the final
// page HTML exactly as it'll live at the portfolio root.
function buildExportableHTML(p) {
  if (!p.photos.length) throw new Error("사진을 먼저 추가해 주세요.");
  if (!p.slug) throw new Error("슬러그(파일명)를 입력해 주세요.");

  const groupName = getGroupOfProject(p.id)?.name || null;
  const srcFn = (ph, i) => `assets/images/${p.slug}/${p.slug}-${String(i + 1).padStart(2, "0")}.jpg`;
  const body = pageBodyHTML(p, { srcFn, indexList: "", groupName });

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(p.name)} — Yujiyeon</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body data-project="${p.slug}">${body}
<script src="js/projects.js"></script>
</body>
</html>
`;
}

function exportProject() {
  const p = currentProject();
  if (!p) return;

  let html;
  try {
    html = buildExportableHTML(p);
  } catch (err) {
    alert(err.message);
    return;
  }

  downloadBlob(new Blob([html], { type: "text/html" }), `${p.slug}.html`);

  // Photos that already live under assets/images/ (seeded from an existing page)
  // don't need to be re-downloaded — only newly-added ones (dataUrl) do.
  let downloadDelay = 200;
  p.photos.forEach((ph, i) => {
    if (!ph.dataUrl) return;
    const filename = `${p.slug}-${String(i + 1).padStart(2, "0")}.jpg`;
    setTimeout(() => downloadBlob(dataUrlToBlob(ph.dataUrl), filename), downloadDelay);
    downloadDelay += 200;
  });

  alert(
    `"${p.slug}.html"과 사진을 다운로드했어요.\n` +
    `사진은 assets/images/${p.slug}/ 폴더에, html은 포트폴리오 루트 폴더에 넣어주세요.\n` +
    `왼쪽의 "Copy PROJECTS Array" 버튼으로 사이트 목차 전체를 갱신할 수 있어요.`
  );
}

// ---------- publish (GitHub Contents API — no git/gh CLI needed) ----------

const GITHUB_KEY = "portfolioBuilder.github";

function getGithubConfig() {
  try {
    return JSON.parse(localStorage.getItem(GITHUB_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveGithubConfig(config) {
  localStorage.setItem(GITHUB_KEY, JSON.stringify(config));
}

// A real dialog instead of two back-to-back prompt()s — those were easy to
// fumble (miss the second popup, hit Cancel by reflex) and left the token
// unset with no clear signal why Publish then failed.
function openGithubSettingsDialog() {
  return new Promise((resolve) => {
    const dialog = document.getElementById("github-settings-dialog");
    const repoInput = document.getElementById("gh-repo-input");
    const tokenInput = document.getElementById("gh-token-input");
    const saveBtn = document.getElementById("save-github-settings");
    const cancelBtn = document.getElementById("cancel-github-settings");
    const closeBtn = document.getElementById("close-github-settings");

    const current = getGithubConfig();
    repoInput.value = current.repo || "jejeisacat/portfolio";
    tokenInput.value = current.token || "";

    const cleanup = () => {
      saveBtn.removeEventListener("click", onSave);
      cancelBtn.removeEventListener("click", onCancel);
      closeBtn.removeEventListener("click", onCancel);
    };
    const onSave = () => {
      const repo = repoInput.value.trim();
      const token = tokenInput.value.trim();
      if (!repo || !token) {
        alert("저장소(owner/repo)와 토큰을 둘 다 입력해 주세요.");
        return;
      }
      const config = { repo, token };
      saveGithubConfig(config);
      cleanup();
      dialog.close();
      resolve(config);
    };
    const onCancel = () => {
      cleanup();
      dialog.close();
      resolve(null);
    };

    saveBtn.addEventListener("click", onSave);
    cancelBtn.addEventListener("click", onCancel);
    closeBtn.addEventListener("click", onCancel);
    dialog.showModal();
  });
}

// Used by the explicit "깃허브 설정" link — always opens the dialog so an
// existing token can be reviewed or replaced.
function configureGithub() {
  return openGithubSettingsDialog();
}

async function ensureGithubConfig() {
  const current = getGithubConfig();
  if (current.repo && current.token) return current;
  const configured = await openGithubSettingsDialog();
  if (!configured) return null;
  return configured;
}

function githubPathEncode(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

// btoa() only handles Latin-1 — this survives Korean/emoji/etc in text content.
function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

async function githubRequest(config, path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${config.repo}/contents/${githubPathEncode(path)}`, {
    ...options,
    headers: {
      Authorization: `token ${config.token}`,
      Accept: "application/vnd.github+json",
      ...(options.headers || {}),
    },
  });
  return res;
}

async function githubGetSha(config, path) {
  const res = await githubRequest(config, path);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} failed (${res.status})`);
  const data = await res.json();
  return data.sha || null;
}

// content: either a UTF-8 string or a raw base64 string (isBase64: true).
async function githubPutFile(config, path, content, { isBase64 = false, message } = {}) {
  const sha = await githubGetSha(config, path);
  const body = {
    message: message || `Update ${path}`,
    content: isBase64 ? content : utf8ToBase64(content),
  };
  if (sha) body.sha = sha;

  const res = await githubRequest(config, path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`GitHub PUT ${path} failed (${res.status}): ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function publishProject(p) {
  const config = await ensureGithubConfig();
  if (!config) return;

  let html;
  try {
    html = buildExportableHTML(p);
  } catch (err) {
    alert(err.message);
    return;
  }

  const btn = document.getElementById("publish-btn");
  const originalLabel = btn.textContent;
  btn.disabled = true;

  try {
    btn.textContent = "Publishing… page";
    await githubPutFile(config, `${p.slug}.html`, html, { message: `Publish ${p.name}` });

    const newPhotos = p.photos
      .map((ph, i) => ({ ph, i }))
      .filter(({ ph }) => ph.dataUrl);

    for (let n = 0; n < newPhotos.length; n++) {
      const { ph, i } = newPhotos[n];
      btn.textContent = `Publishing… photo ${n + 1}/${newPhotos.length}`;
      const base64 = ph.dataUrl.split(",")[1];
      const filename = `${p.slug}-${String(i + 1).padStart(2, "0")}.jpg`;
      await githubPutFile(config, `assets/images/${p.slug}/${filename}`, base64, {
        isBase64: true,
        message: `Add photo for ${p.name}`,
      });
    }

    btn.textContent = "Publishing… index";
    await githubPutFile(
      config,
      "js/projects.js",
      await buildUpdatedProjectsJS(config),
      { message: `Update PROJECTS index (${p.name})` }
    );

    alert(`"${p.name}" 퍼블리시 완료! 잠시 후 Vercel에 자동 배포돼요.`);
  } catch (err) {
    console.error(err);
    alert(`퍼블리시 실패: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
}

// Fetches the live js/projects.js from GitHub and swaps in a freshly
// generated PROJECTS array, leaving the rest of the file (render functions,
// dialogs) untouched.
async function buildUpdatedProjectsJS(config) {
  const res = await githubRequest(config, "js/projects.js");
  if (!res.ok) throw new Error(`js/projects.js를 가져오지 못했어요 (${res.status})`);
  const data = await res.json();
  const current = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));

  const newBlock = projectsArrayJS().trim();
  const updated = current.replace(/const PROJECTS = \[[\s\S]*?\n\];/, newBlock);
  if (updated === current && !current.includes(newBlock)) {
    throw new Error("PROJECTS 배열 패턴을 찾지 못했어요 — js/projects.js 형식이 바뀐 것 같아요.");
  }
  return updated;
}

// ---------- preview size toggle (PC / Mobile) ----------

const DESKTOP_PREVIEW_WIDTH = 1440;

function initPreviewToggle() {
  const toggle = document.getElementById("preview-toggle");
  const wrap = document.getElementById("preview-frame-wrap");
  const box = document.getElementById("scale-box");
  const frame = document.getElementById("preview-frame");
  if (!toggle || !wrap || !box || !frame) return;

  function updateScale() {
    if (wrap.classList.contains("mobile")) {
      frame.style.transform = "none";
      return;
    }
    frame.style.transform = `scale(${box.clientWidth / DESKTOP_PREVIEW_WIDTH})`;
  }

  toggle.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggle.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      wrap.classList.toggle("mobile", btn.dataset.size === "mobile");
      updateScale();
    });
  });

  new ResizeObserver(updateScale).observe(box);
  updateScale();
}

// ---------- init ----------

document.getElementById("new-project-btn").addEventListener("click", newProject);
document.getElementById("copy-projects-btn").addEventListener("click", copyProjectsArray);
initPreviewToggle();
initGenerateDialog();
initCropDialog();

loadState();
renderProjectList();
renderEditor();
renderPreview();
