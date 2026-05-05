import { PrismaClient, type Prisma } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

type I18n = { es: string; en: string; ar: string };

function i18n(es: string, en: string, ar: string): I18n {
  return { es, en, ar };
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@solperfumesarabes.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe!Now-2026";

const olfactiveNotes = [
  { slug: "oud", name: i18n("Oud", "Oud", "العود"), icon: "/icons/notes/oud.svg", color: "oklch(0.45 0.06 60)" },
  { slug: "rosa-taif", name: i18n("Rosa de Taif", "Taif Rose", "وردة الطائف"), icon: "/icons/notes/rose.svg", color: "oklch(0.65 0.16 15)" },
  { slug: "sandalo", name: i18n("Sándalo", "Sandalwood", "خشب الصندل"), icon: "/icons/notes/sandalwood.svg", color: "oklch(0.55 0.05 70)" },
  { slug: "ambar", name: i18n("Ámbar", "Amber", "العنبر"), icon: "/icons/notes/amber.svg", color: "oklch(0.70 0.13 70)" },
  { slug: "azafran", name: i18n("Azafrán", "Saffron", "الزعفران"), icon: "/icons/notes/saffron.svg", color: "oklch(0.72 0.15 50)" },
  { slug: "almizcle", name: i18n("Almizcle", "Musk", "المسك"), icon: "/icons/notes/musk.svg", color: "oklch(0.78 0.02 80)" },
  { slug: "jazmin", name: i18n("Jazmín", "Jasmine", "الياسمين"), icon: "/icons/notes/jasmine.svg", color: "oklch(0.92 0.04 90)" },
  { slug: "cardamomo", name: i18n("Cardamomo", "Cardamom", "الهيل"), icon: "/icons/notes/cardamom.svg", color: "oklch(0.68 0.10 130)" },
  { slug: "cuero", name: i18n("Cuero", "Leather", "الجلد"), icon: "/icons/notes/leather.svg", color: "oklch(0.40 0.06 50)" },
  { slug: "vainilla", name: i18n("Vainilla", "Vanilla", "الفانيليا"), icon: "/icons/notes/vanilla.svg", color: "oklch(0.78 0.06 80)" },
  { slug: "bergamota", name: i18n("Bergamota", "Bergamot", "البرغموت"), icon: "/icons/notes/bergamot.svg", color: "oklch(0.78 0.13 130)" },
  { slug: "incienso", name: i18n("Incienso", "Frankincense", "اللبان"), icon: "/icons/notes/frankincense.svg", color: "oklch(0.62 0.04 60)" },
  { slug: "mirra", name: i18n("Mirra", "Myrrh", "المر"), icon: "/icons/notes/myrrh.svg", color: "oklch(0.45 0.05 50)" },
  { slug: "patchouli", name: i18n("Pachulí", "Patchouli", "الباتشولي"), icon: "/icons/notes/patchouli.svg", color: "oklch(0.40 0.05 110)" },
  { slug: "vetiver", name: i18n("Vetiver", "Vetiver", "نبات الفيتيفر"), icon: "/icons/notes/vetiver.svg", color: "oklch(0.50 0.05 130)" },
  { slug: "limon", name: i18n("Limón", "Lemon", "الليمون"), icon: "/icons/notes/lemon.svg", color: "oklch(0.85 0.16 110)" },
  { slug: "mandarina", name: i18n("Mandarina", "Mandarin", "اليوسفي"), icon: "/icons/notes/mandarin.svg", color: "oklch(0.78 0.15 60)" },
  { slug: "cedro", name: i18n("Cedro", "Cedar", "الأرز"), icon: "/icons/notes/cedar.svg", color: "oklch(0.50 0.05 70)" },
  { slug: "labdano", name: i18n("Labdano", "Labdanum", "اللادن"), icon: "/icons/notes/labdanum.svg", color: "oklch(0.55 0.10 60)" },
  { slug: "cafe", name: i18n("Café", "Coffee", "القهوة"), icon: "/icons/notes/coffee.svg", color: "oklch(0.32 0.05 50)" },
  { slug: "tabaco", name: i18n("Tabaco", "Tobacco", "التبغ"), icon: "/icons/notes/tobacco.svg", color: "oklch(0.42 0.06 60)" },
  { slug: "haba-tonka", name: i18n("Haba Tonka", "Tonka Bean", "حبة التونكا"), icon: "/icons/notes/tonka.svg", color: "oklch(0.52 0.06 70)" },
  { slug: "violeta", name: i18n("Violeta", "Violet", "البنفسج"), icon: "/icons/notes/violet.svg", color: "oklch(0.65 0.10 310)" },
  { slug: "iris", name: i18n("Iris", "Iris", "السوسن"), icon: "/icons/notes/iris.svg", color: "oklch(0.78 0.04 290)" },
  { slug: "neroli", name: i18n("Neroli", "Neroli", "النيرولي"), icon: "/icons/notes/neroli.svg", color: "oklch(0.86 0.10 95)" },
  { slug: "ylang", name: i18n("Ylang Ylang", "Ylang Ylang", "الإيلنغ"), icon: "/icons/notes/ylang.svg", color: "oklch(0.85 0.13 95)" },
  { slug: "dattil", name: i18n("Dátil", "Date", "التمر"), icon: "/icons/notes/date.svg", color: "oklch(0.42 0.07 60)" },
  { slug: "miel", name: i18n("Miel", "Honey", "العسل"), icon: "/icons/notes/honey.svg", color: "oklch(0.78 0.13 80)" },
  { slug: "pimienta-rosa", name: i18n("Pimienta Rosa", "Pink Pepper", "الفلفل الوردي"), icon: "/icons/notes/pink-pepper.svg", color: "oklch(0.72 0.13 20)" },
  { slug: "bakhoor", name: i18n("Bakhoor", "Bakhoor", "البخور"), icon: "/icons/notes/bakhoor.svg", color: "oklch(0.42 0.06 60)" },
];

const collections = [
  { slug: "royal-oud", name: i18n("Royal Oud", "Royal Oud", "العود الملكي"), description: "Selección de ouds de Hindi, Camboya y Borneo destilados a la antigua usanza." },
  { slug: "noches-arabes", name: i18n("Noches Árabes", "Arabian Nights", "ليالي عربية"), description: "Mukhallats nocturnos para velar el alma." },
  { slug: "rosa-de-oriente", name: i18n("Rosa de Oriente", "Rose of the Orient", "وردة الشرق"), description: "Variaciones sobre la rosa de Taif y Damasco." },
  { slug: "ambar-y-resinas", name: i18n("Ámbar y Resinas", "Amber & Resins", "العنبر والراتنج"), description: "Cálidos, terrosos, eternos." },
  { slug: "amaneceres", name: i18n("Amaneceres", "Sunrises", "شروق الشمس"), description: "Cítricos solares y aldehídos para empezar el día." },
  { slug: "decants", name: i18n("Decants", "Decants", "عينات"), description: "Muestras de 5 ml para descubrir sin compromiso." },
] as const;

const products = [
  {
    slug: "sultan-al-layl",
    name: i18n("Sultán al-Layl", "Sultan al-Layl", "سلطان الليل"),
    short: i18n("El soberano de la noche: oud Hindi envuelto en rosa de Taif y ámbar.", "The sovereign of night: Hindi oud wrapped in Taif rose and amber.", "صاحب الليل: عود هندي محاط بوردة الطائف والعنبر."),
    family: "oriental_oud",
    gender: "UNISEX",
    perfumer: "Yasmine al-Hashimi",
    origin: "Dubái, EAU",
    year: 2024,
    collection: "royal-oud",
    flags: { isFeatured: true, isNew: true, isLimited: true },
    notes: { SALIDA: ["azafran", "pimienta-rosa"], CORAZON: ["rosa-taif", "oud"], FONDO: ["ambar", "almizcle", "sandalo"] },
    sizes: [{ ml: 5, price: 4900 }, { ml: 30, price: 18900 }, { ml: 50, price: 28900 }, { ml: 100, price: 49900 }],
  },
  {
    slug: "rose-d-arabie",
    name: i18n("Rose d'Arabie", "Rose d'Arabie", "وردة العرب"),
    short: i18n("Mil pétalos de rosa de Damasco sobre un lecho de oud y miel.", "A thousand Damascus rose petals on a bed of oud and honey.", "ألف بتلة من ورد دمشق على فراش من العود والعسل."),
    family: "floral_oriental",
    gender: "FEMENINO",
    perfumer: "Layla Boudiaf",
    origin: "Grasse, Francia",
    year: 2023,
    collection: "rosa-de-oriente",
    flags: { isFeatured: true, isNew: false, isLimited: false },
    notes: { SALIDA: ["bergamota", "mandarina"], CORAZON: ["rosa-taif", "jazmin"], FONDO: ["oud", "miel", "almizcle"] },
    sizes: [{ ml: 5, price: 3900 }, { ml: 50, price: 22900 }, { ml: 100, price: 39900 }],
  },
  {
    slug: "oud-royal-mukhallat",
    name: i18n("Oud Royal Mukhallat", "Oud Royal Mukhallat", "مخلط العود الملكي"),
    short: i18n("Mezcla artesanal de tres ouds y rosa, según receta de los emiratos.", "Artisan blend of three ouds and rose, after an Emirati recipe.", "مزيج حرفي من ثلاثة أنواع عود وورد وفق وصفة إماراتية."),
    family: "mukhallat",
    gender: "UNISEX",
    perfumer: "Khalifa al-Mansoori",
    origin: "Abu Dabi, EAU",
    year: 2022,
    collection: "royal-oud",
    flags: { isFeatured: true, isNew: false, isLimited: true },
    notes: { SALIDA: ["azafran"], CORAZON: ["oud", "rosa-taif"], FONDO: ["sandalo", "ambar", "labdano"] },
    sizes: [{ ml: 3, price: 5900 }, { ml: 12, price: 19900 }, { ml: 30, price: 44900 }],
  },
  {
    slug: "ambar-de-medina",
    name: i18n("Ámbar de Medina", "Amber of Medina", "عنبر المدينة"),
    short: i18n("Ámbar resinoso, vainilla y haba tonka sobre piel cálida.", "Resinous amber, vanilla and tonka on warm skin.", "عنبر راتنجي وفانيليا وحبة تونكا على بشرة دافئة."),
    family: "amber",
    gender: "UNISEX",
    perfumer: "Yasmine al-Hashimi",
    origin: "Riad, Arabia Saudí",
    year: 2024,
    collection: "ambar-y-resinas",
    flags: { isFeatured: false, isNew: true, isLimited: false },
    notes: { SALIDA: ["bergamota"], CORAZON: ["labdano", "incienso"], FONDO: ["ambar", "vainilla", "haba-tonka"] },
    sizes: [{ ml: 5, price: 3500 }, { ml: 50, price: 19900 }, { ml: 100, price: 32900 }],
  },
  {
    slug: "azahar-de-cordoba",
    name: i18n("Azahar de Córdoba", "Cordoba Orange Blossom", "زهر برتقال قرطبة"),
    short: i18n("Neroli andaluz, jazmín y un susurro de oud blanco.", "Andalusian neroli, jasmine and a whisper of white oud.", "نيرولي أندلسي وياسمين وهمسة من العود الأبيض."),
    family: "floral",
    gender: "FEMENINO",
    perfumer: "Carmen Ruiz",
    origin: "Córdoba, España",
    year: 2025,
    collection: "amaneceres",
    flags: { isFeatured: true, isNew: true, isLimited: false },
    notes: { SALIDA: ["neroli", "limon"], CORAZON: ["jazmin", "ylang"], FONDO: ["oud", "almizcle"] },
    sizes: [{ ml: 5, price: 2900 }, { ml: 50, price: 16900 }, { ml: 100, price: 29900 }],
  },
  {
    slug: "noche-de-shiraz",
    name: i18n("Noche de Shiraz", "Shiraz Night", "ليلة شيراز"),
    short: i18n("Vino especiado, rosa persa y oud ahumado.", "Spiced wine, Persian rose and smoky oud.", "نبيذ متبل وورد فارسي وعود مدخن."),
    family: "oriental_spicy",
    gender: "UNISEX",
    perfumer: "Darius Farahani",
    origin: "Shiraz, Irán",
    year: 2023,
    collection: "noches-arabes",
    flags: { isFeatured: false, isNew: false, isLimited: true },
    notes: { SALIDA: ["cardamomo", "azafran"], CORAZON: ["rosa-taif", "tabaco"], FONDO: ["oud", "cuero", "ambar"] },
    sizes: [{ ml: 5, price: 4500 }, { ml: 50, price: 24900 }, { ml: 100, price: 42900 }],
  },
  {
    slug: "almizcle-blanco",
    name: i18n("Almizcle Blanco", "White Musk", "المسك الأبيض"),
    short: i18n("Almizcle limpio, iris en polvo y madera de cedro.", "Clean musk, powdered iris and cedarwood.", "مسك نقي وإيريس بودرة وخشب الأرز."),
    family: "musk",
    gender: "UNISEX",
    perfumer: "Layla Boudiaf",
    origin: "Marruecos",
    year: 2022,
    collection: "decants",
    flags: { isFeatured: false, isNew: false, isLimited: false },
    notes: { SALIDA: ["bergamota"], CORAZON: ["iris", "violeta"], FONDO: ["almizcle", "cedro", "sandalo"] },
    sizes: [{ ml: 5, price: 1900 }, { ml: 50, price: 12900 }, { ml: 100, price: 21900 }],
  },
  {
    slug: "tabaco-de-tanger",
    name: i18n("Tabaco de Tánger", "Tangier Tobacco", "تبغ طنجة"),
    short: i18n("Tabaco rubio, miel ahumada y cuero suave.", "Blond tobacco, smoked honey and soft leather.", "تبغ شقراء وعسل مدخن وجلد ناعم."),
    family: "leather_tobacco",
    gender: "MASCULINO",
    perfumer: "Hicham el-Fassi",
    origin: "Tánger, Marruecos",
    year: 2023,
    collection: "noches-arabes",
    flags: { isFeatured: true, isNew: false, isLimited: false },
    notes: { SALIDA: ["pimienta-rosa", "bergamota"], CORAZON: ["tabaco", "miel"], FONDO: ["cuero", "vainilla", "haba-tonka"] },
    sizes: [{ ml: 5, price: 3500 }, { ml: 50, price: 19900 }, { ml: 100, price: 33900 }],
  },
  {
    slug: "incienso-sagrado",
    name: i18n("Incienso Sagrado", "Sacred Frankincense", "البخور المقدس"),
    short: i18n("Olíbano de Omán, mirra y madera ahumada.", "Omani olibanum, myrrh and smoked wood.", "لبان عماني ومُر وخشب مدخن."),
    family: "incense",
    gender: "UNISEX",
    perfumer: "Khalifa al-Mansoori",
    origin: "Salalah, Omán",
    year: 2024,
    collection: "ambar-y-resinas",
    flags: { isFeatured: false, isNew: true, isLimited: true },
    notes: { SALIDA: ["limon", "cardamomo"], CORAZON: ["incienso", "mirra"], FONDO: ["sandalo", "labdano"] },
    sizes: [{ ml: 5, price: 3900 }, { ml: 50, price: 22900 }, { ml: 100, price: 39900 }],
  },
  {
    slug: "dattiles-y-cafe",
    name: i18n("Dátiles y Café", "Dates & Coffee", "تمر وقهوة"),
    short: i18n("Café arábigo, dátiles caramelizados y vainilla bourbon.", "Arabic coffee, caramelized dates and bourbon vanilla.", "قهوة عربية وتمر مكرمل وفانيليا بوربون."),
    family: "gourmand",
    gender: "UNISEX",
    perfumer: "Yasmine al-Hashimi",
    origin: "Dubái, EAU",
    year: 2025,
    collection: "noches-arabes",
    flags: { isFeatured: true, isNew: true, isLimited: false },
    notes: { SALIDA: ["cardamomo"], CORAZON: ["cafe", "dattil"], FONDO: ["vainilla", "haba-tonka", "ambar"] },
    sizes: [{ ml: 5, price: 3200 }, { ml: 50, price: 18900 }, { ml: 100, price: 32900 }],
  },
  {
    slug: "rosa-imperial",
    name: i18n("Rosa Imperial", "Imperial Rose", "الوردة الإمبراطورية"),
    short: i18n("Rosa centifolia, pachulí violado y almizcle blanco.", "Centifolia rose, violet patchouli and white musk.", "وردة سنتيفوليا وباتشولي بنفسجي ومسك أبيض."),
    family: "floral_chypre",
    gender: "FEMENINO",
    perfumer: "Layla Boudiaf",
    origin: "Grasse, Francia",
    year: 2023,
    collection: "rosa-de-oriente",
    flags: { isFeatured: false, isNew: false, isLimited: false },
    notes: { SALIDA: ["bergamota", "pimienta-rosa"], CORAZON: ["rosa-taif", "violeta"], FONDO: ["patchouli", "almizcle"] },
    sizes: [{ ml: 5, price: 2900 }, { ml: 50, price: 16900 }, { ml: 100, price: 28900 }],
  },
  {
    slug: "vetiver-de-marrakech",
    name: i18n("Vetiver de Marrakech", "Marrakech Vetiver", "فيتيفر مراكش"),
    short: i18n("Vetiver verde, menta especiada y un fondo de cuero suave.", "Green vetiver, spiced mint and soft leather drydown.", "فيتيفر أخضر ونعناع متبل وجلد ناعم في القاعدة."),
    family: "woody_aromatic",
    gender: "MASCULINO",
    perfumer: "Hicham el-Fassi",
    origin: "Marrakech, Marruecos",
    year: 2024,
    collection: "amaneceres",
    flags: { isFeatured: false, isNew: true, isLimited: false },
    notes: { SALIDA: ["bergamota", "limon"], CORAZON: ["vetiver", "cardamomo"], FONDO: ["cedro", "cuero"] },
    sizes: [{ ml: 5, price: 2900 }, { ml: 50, price: 17900 }, { ml: 100, price: 29900 }],
  },
  {
    slug: "musk-de-la-meca",
    name: i18n("Musk de La Meca", "Mecca Musk", "مسك مكة"),
    short: i18n("Almizcle puro, agua de rosas y un velo de azahar.", "Pure musk, rosewater and a veil of orange blossom.", "مسك صافٍ وماء ورد وحجاب من زهر البرتقال."),
    family: "musk",
    gender: "FEMENINO",
    perfumer: "Yasmine al-Hashimi",
    origin: "Yeda, Arabia Saudí",
    year: 2022,
    collection: "decants",
    flags: { isFeatured: false, isNew: false, isLimited: false },
    notes: { SALIDA: ["mandarina"], CORAZON: ["rosa-taif", "neroli"], FONDO: ["almizcle", "ambar"] },
    sizes: [{ ml: 5, price: 1900 }, { ml: 30, price: 9900 }, { ml: 50, price: 14900 }],
  },
  {
    slug: "oud-y-azafran",
    name: i18n("Oud y Azafrán", "Oud & Saffron", "العود والزعفران"),
    short: i18n("Oud Camboya y azafrán Mongra sobre cuero pulido.", "Cambodian oud and Mongra saffron on polished leather.", "عود كمبودي وزعفران مونغرا على جلد مصقول."),
    family: "oriental_oud",
    gender: "MASCULINO",
    perfumer: "Khalifa al-Mansoori",
    origin: "Phnom Penh, Camboya",
    year: 2023,
    collection: "royal-oud",
    flags: { isFeatured: true, isNew: false, isLimited: true },
    notes: { SALIDA: ["azafran", "pimienta-rosa"], CORAZON: ["oud", "cuero"], FONDO: ["sandalo", "ambar"] },
    sizes: [{ ml: 3, price: 5900 }, { ml: 12, price: 21900 }, { ml: 30, price: 47900 }],
  },
  {
    slug: "jazmin-de-damasco",
    name: i18n("Jazmín de Damasco", "Damascus Jasmine", "ياسمين دمشق"),
    short: i18n("Jazmín sambac nocturno, miel y ámbar.", "Night-blooming sambac, honey and amber.", "ياسمين سامباك ليلي وعسل وعنبر."),
    family: "floral",
    gender: "FEMENINO",
    perfumer: "Layla Boudiaf",
    origin: "Damasco, Siria",
    year: 2024,
    collection: "rosa-de-oriente",
    flags: { isFeatured: false, isNew: true, isLimited: false },
    notes: { SALIDA: ["bergamota", "pimienta-rosa"], CORAZON: ["jazmin", "ylang"], FONDO: ["miel", "ambar", "almizcle"] },
    sizes: [{ ml: 5, price: 2900 }, { ml: 50, price: 17900 }, { ml: 100, price: 29900 }],
  },
  {
    slug: "cuero-de-fez",
    name: i18n("Cuero de Fez", "Fez Leather", "جلد فاس"),
    short: i18n("Cuero curtido, azafrán y rosa marroquí.", "Tanned leather, saffron and Moroccan rose.", "جلد مدبوغ وزعفران وورد مغربي."),
    family: "leather",
    gender: "UNISEX",
    perfumer: "Hicham el-Fassi",
    origin: "Fez, Marruecos",
    year: 2022,
    collection: "noches-arabes",
    flags: { isFeatured: false, isNew: false, isLimited: false },
    notes: { SALIDA: ["azafran"], CORAZON: ["cuero", "rosa-taif"], FONDO: ["oud", "labdano"] },
    sizes: [{ ml: 5, price: 3500 }, { ml: 50, price: 18900 }, { ml: 100, price: 32900 }],
  },
  {
    slug: "amanecer-de-zanzibar",
    name: i18n("Amanecer de Zanzíbar", "Zanzibar Sunrise", "شروق زنجبار"),
    short: i18n("Clavo, ylang ylang y ámbar bajo brisa marina.", "Clove, ylang ylang and amber under sea breeze.", "قرنفل وإيلنغ وعنبر تحت نسيم البحر."),
    family: "spicy_oriental",
    gender: "UNISEX",
    perfumer: "Yasmine al-Hashimi",
    origin: "Zanzíbar, Tanzania",
    year: 2025,
    collection: "amaneceres",
    flags: { isFeatured: true, isNew: true, isLimited: false },
    notes: { SALIDA: ["mandarina", "cardamomo"], CORAZON: ["ylang", "jazmin"], FONDO: ["ambar", "sandalo"] },
    sizes: [{ ml: 5, price: 2900 }, { ml: 50, price: 17900 }, { ml: 100, price: 29900 }],
  },
  {
    slug: "vainilla-de-bagdad",
    name: i18n("Vainilla de Bagdad", "Baghdad Vanilla", "فانيليا بغداد"),
    short: i18n("Vainilla Madagascar, dátiles y oud cremoso.", "Madagascar vanilla, dates and creamy oud.", "فانيليا مدغشقر وتمر وعود كريمي."),
    family: "gourmand",
    gender: "FEMENINO",
    perfumer: "Layla Boudiaf",
    origin: "Madagascar",
    year: 2023,
    collection: "noches-arabes",
    flags: { isFeatured: false, isNew: false, isLimited: false },
    notes: { SALIDA: ["pimienta-rosa"], CORAZON: ["vainilla", "dattil"], FONDO: ["oud", "haba-tonka", "ambar"] },
    sizes: [{ ml: 5, price: 2900 }, { ml: 50, price: 17900 }, { ml: 100, price: 29900 }],
  },
  {
    slug: "bakhoor-real",
    name: i18n("Bakhoor Real", "Royal Bakhoor", "البخور الملكي"),
    short: i18n("Bakhoor de palacio: oud, ámbar gris y rosa.", "Palace bakhoor: oud, ambergris and rose.", "بخور القصر: عود وعنبر أشهب وورد."),
    family: "incense",
    gender: "UNISEX",
    perfumer: "Khalifa al-Mansoori",
    origin: "Riad, Arabia Saudí",
    year: 2024,
    collection: "ambar-y-resinas",
    flags: { isFeatured: true, isNew: false, isLimited: true },
    notes: { SALIDA: ["azafran"], CORAZON: ["bakhoor", "rosa-taif"], FONDO: ["oud", "ambar", "almizcle"] },
    sizes: [{ ml: 5, price: 4500 }, { ml: 30, price: 22900 }, { ml: 50, price: 34900 }],
  },
  {
    slug: "patchouli-noir",
    name: i18n("Patchouli Noir", "Patchouli Noir", "باتشولي نوار"),
    short: i18n("Pachulí terroso, café y cuero ahumado.", "Earthy patchouli, coffee and smoked leather.", "باتشولي ترابي وقهوة وجلد مدخن."),
    family: "chypre",
    gender: "MASCULINO",
    perfumer: "Hicham el-Fassi",
    origin: "Indonesia",
    year: 2024,
    collection: "decants",
    flags: { isFeatured: false, isNew: true, isLimited: false },
    notes: { SALIDA: ["pimienta-rosa", "bergamota"], CORAZON: ["patchouli", "cafe"], FONDO: ["cuero", "ambar"] },
    sizes: [{ ml: 5, price: 2200 }, { ml: 50, price: 14900 }, { ml: 100, price: 24900 }],
  },
  {
    slug: "iris-y-suede",
    name: i18n("Iris y Suede", "Iris & Suede", "السوسن والسويد"),
    short: i18n("Iris empolvado, gamuza dorada y violeta nocturna.", "Powdered iris, golden suede and night violet.", "سوسن بودرة وسويد ذهبي وبنفسج ليلي."),
    family: "powdery",
    gender: "FEMENINO",
    perfumer: "Carmen Ruiz",
    origin: "Florencia, Italia",
    year: 2025,
    collection: "amaneceres",
    flags: { isFeatured: false, isNew: true, isLimited: false },
    notes: { SALIDA: ["bergamota"], CORAZON: ["iris", "violeta"], FONDO: ["cuero", "almizcle", "sandalo"] },
    sizes: [{ ml: 5, price: 3200 }, { ml: 50, price: 19900 }, { ml: 100, price: 32900 }],
  },
  {
    slug: "mukhallat-al-fajr",
    name: i18n("Mukhallat al-Fajr", "Mukhallat al-Fajr", "مخلط الفجر"),
    short: i18n("Almizcle dorado, rosa y oud blanco. El alba.", "Golden musk, rose and white oud. The dawn.", "مسك ذهبي وورد وعود أبيض. الفجر."),
    family: "mukhallat",
    gender: "UNISEX",
    perfumer: "Khalifa al-Mansoori",
    origin: "Dubái, EAU",
    year: 2023,
    collection: "amaneceres",
    flags: { isFeatured: true, isNew: false, isLimited: false },
    notes: { SALIDA: ["azahar".replace("azahar","neroli"), "mandarina"], CORAZON: ["rosa-taif", "oud"], FONDO: ["almizcle", "sandalo", "ambar"] },
    sizes: [{ ml: 3, price: 4900 }, { ml: 12, price: 17900 }, { ml: 30, price: 38900 }],
  },
  {
    slug: "cardamomo-y-cuero",
    name: i18n("Cardamomo y Cuero", "Cardamom & Leather", "هيل وجلد"),
    short: i18n("Cardamomo verde, cuero pulido y vetiver.", "Green cardamom, polished leather and vetiver.", "هيل أخضر وجلد مصقول وفيتيفر."),
    family: "leather_spicy",
    gender: "MASCULINO",
    perfumer: "Yasmine al-Hashimi",
    origin: "Mascate, Omán",
    year: 2024,
    collection: "noches-arabes",
    flags: { isFeatured: false, isNew: true, isLimited: false },
    notes: { SALIDA: ["cardamomo", "pimienta-rosa"], CORAZON: ["cuero"], FONDO: ["vetiver", "ambar", "labdano"] },
    sizes: [{ ml: 5, price: 3200 }, { ml: 50, price: 18900 }, { ml: 100, price: 31900 }],
  },
  {
    slug: "miel-de-yemen",
    name: i18n("Miel de Yemen", "Yemen Honey", "عسل اليمن"),
    short: i18n("Miel de Sidr, dátiles y oud dorado.", "Sidr honey, dates and golden oud.", "عسل السدر وتمر وعود ذهبي."),
    family: "gourmand_oriental",
    gender: "UNISEX",
    perfumer: "Layla Boudiaf",
    origin: "Hadramut, Yemen",
    year: 2023,
    collection: "noches-arabes",
    flags: { isFeatured: false, isNew: false, isLimited: true },
    notes: { SALIDA: ["azafran"], CORAZON: ["miel", "dattil"], FONDO: ["oud", "ambar", "vainilla"] },
    sizes: [{ ml: 5, price: 3900 }, { ml: 50, price: 21900 }, { ml: 100, price: 36900 }],
  },
];

const fairs = [
  { slug: "esxence-2026", title: i18n("Esxence Milán 2026", "Esxence Milan 2026", "إكسنس ميلانو 2026"), description: i18n("La feria más importante de perfumería de nicho en Europa.", "Europe's most important niche perfumery fair.", "أهم معرض للعطور النيشية في أوروبا."), startDate: "2026-03-19T10:00:00", endDate: "2026-03-22T19:00:00", city: "Milán", country: "IT", venue: "MiCo — Milano Convention Centre", address: "Via Gattamelata 5, Milán", lat: 45.4795, lng: 9.1377, websiteUrl: "https://esxence.com", isFeatured: true, tags: ["B2B", "Internacional", "Niche"] },
  { slug: "pitti-fragranze-2026", title: i18n("Pitti Fragranze 2026", "Pitti Fragranze 2026", "بيتي فراغرانسي 2026"), description: i18n("Fragancias de autor en la Florencia renacentista.", "Auteur fragrances in Renaissance Florence.", "عطور المؤلفين في فلورنسا."), startDate: "2026-09-11T10:00:00", endDate: "2026-09-13T19:00:00", city: "Florencia", country: "IT", venue: "Stazione Leopolda", address: "Viale Fratelli Rosselli 5, Florencia", lat: 43.7766, lng: 11.2406, websiteUrl: "https://pittimmagine.com", isFeatured: true, tags: ["B2B", "Niche"] },
  { slug: "tax-free-cannes-2026", title: i18n("TFWA Cannes 2026", "TFWA Cannes 2026", "تي إف دبليو إيه كان 2026"), description: i18n("Salón mundial del travel-retail.", "Global travel-retail trade show.", "معرض الإعفاءات الضريبية العالمي."), startDate: "2026-10-04T09:00:00", endDate: "2026-10-08T18:00:00", city: "Cannes", country: "FR", venue: "Palais des Festivals", address: "1 Boulevard de la Croisette, Cannes", lat: 43.5513, lng: 7.0184, websiteUrl: "https://tfwa.com", isFeatured: false, tags: ["B2B", "Travel Retail"] },
  { slug: "world-perfumery-congress-2026", title: i18n("World Perfumery Congress 2026", "World Perfumery Congress 2026", "المؤتمر العالمي للعطور 2026"), description: i18n("Congreso técnico-comercial de la industria.", "Technical-commercial industry congress.", "المؤتمر التقني للصناعة."), startDate: "2026-06-22T09:00:00", endDate: "2026-06-25T18:00:00", city: "Miami", country: "US", venue: "Miami Beach Convention Center", address: "1901 Convention Center Dr, Miami Beach", lat: 25.7949, lng: -80.1340, websiteUrl: "https://worldperfumerycongress.com", isFeatured: false, tags: ["Congreso", "Internacional"] },
  { slug: "dubai-perfume-show-2026", title: i18n("Dubai Perfume Show 2026", "Dubai Perfume Show 2026", "معرض دبي للعطور 2026"), description: i18n("La mayor exposición de oud y mukhallat del mundo.", "The world's largest oud & mukhallat showcase.", "أكبر معرض للعود والمخلطات في العالم."), startDate: "2026-11-15T10:00:00", endDate: "2026-11-19T22:00:00", city: "Dubái", country: "AE", venue: "Dubai World Trade Centre", address: "Sheikh Zayed Rd, Dubái", lat: 25.2229, lng: 55.2820, websiteUrl: "https://dubaiperfumeshow.com", isFeatured: true, tags: ["Niche", "Oud", "Internacional"] },
  { slug: "perfumeria-de-autor-madrid-2026", title: i18n("Perfumería de Autor Madrid 2026", "Madrid Auteur Perfumery 2026", "عطور مدريد 2026"), description: i18n("Encuentro anual de la perfumería independiente española.", "Annual meeting of Spanish indie perfumery.", "اللقاء السنوي للعطور الإسبانية المستقلة."), startDate: "2026-05-30T11:00:00", endDate: "2026-06-01T20:00:00", city: "Madrid", country: "ES", venue: "Palacio de Cibeles", address: "Plaza de Cibeles 1, Madrid", lat: 40.4191, lng: -3.6929, websiteUrl: "https://perfumeriadeautor.es", isFeatured: true, tags: ["España", "Niche", "Público general"] },
  { slug: "salon-international-parfum-paris-2026", title: i18n("Salon International du Parfum París 2026", "Paris International Perfume Salon 2026", "صالون باريس الدولي للعطور 2026"), description: i18n("La cita francesa por excelencia.", "The French perfume gathering par excellence.", "اللقاء الفرنسي الأبرز."), startDate: "2026-04-10T10:00:00", endDate: "2026-04-13T19:00:00", city: "París", country: "FR", venue: "Carrousel du Louvre", address: "99 Rue de Rivoli, París", lat: 48.8617, lng: 2.3360, websiteUrl: "https://salonparfumparis.fr", isFeatured: false, tags: ["Niche", "Internacional"] },
  { slug: "barcelona-fragrance-week-2026", title: i18n("Barcelona Fragrance Week 2026", "Barcelona Fragrance Week 2026", "أسبوع برشلونة للعطور 2026"), description: i18n("Una semana de talleres, catas y conferencias en Barcelona.", "A week of workshops, tastings and talks in Barcelona.", "أسبوع من ورش العمل والمحاضرات في برشلونة."), startDate: "2026-07-06T10:00:00", endDate: "2026-07-12T20:00:00", city: "Barcelona", country: "ES", venue: "Disseny Hub Barcelona", address: "Pl. de les Glòries Catalanes 37, Barcelona", lat: 41.4036, lng: 2.1894, websiteUrl: "https://bcnfragranceweek.com", isFeatured: false, tags: ["España", "Público general"] },
];

const blogPosts = [
  { slug: "guia-oud-principiantes", title: i18n("Guía del oud para principiantes", "Beginner's guide to oud", "دليل المبتدئين للعود"), excerpt: i18n("Qué es el oud, de dónde viene y cómo elegir el tuyo.", "What oud is, where it comes from and how to choose yours.", "ما هو العود ومن أين يأتي وكيف تختار."), tags: ["oud", "guía"], minutes: 8 },
  { slug: "rosa-de-taif-historia", title: i18n("La rosa de Taif: historia de mil pétalos", "The Taif rose: a thousand-petal history", "وردة الطائف: تاريخ من ألف بتلة"), excerpt: i18n("Por qué la rosa de Taif es la más codiciada del mundo árabe.", "Why the Taif rose is the most coveted in the Arab world.", "لماذا وردة الطائف هي الأكثر طلباً."), tags: ["rosa", "historia"], minutes: 7 },
  { slug: "como-aplicar-attar", title: i18n("Cómo aplicar un attar correctamente", "How to apply an attar correctly", "كيف تضع العطر بشكل صحيح"), excerpt: i18n("Tres gotas, los puntos de pulso y por qué nunca se frota.", "Three drops, the pulse points, and why you never rub.", "ثلاث قطرات ونقاط النبض ولماذا لا تفركها أبدًا."), tags: ["attar", "tips"], minutes: 4 },
  { slug: "diferencia-attar-mukhallat", title: i18n("¿Attar o mukhallat? Diferencias clave", "Attar or mukhallat? Key differences", "عطر أم مخلط؟ الفروقات الرئيسية"), excerpt: i18n("Pureza vs. armonía: dos filosofías de la perfumería oriental.", "Purity vs. harmony: two philosophies of Eastern perfumery.", "النقاء مقابل الانسجام: فلسفتان."), tags: ["mukhallat", "attar"], minutes: 6 },
  { slug: "ferias-de-perfume-2026", title: i18n("Ferias de perfume imprescindibles en 2026", "Must-attend perfume fairs in 2026", "معارض العطور التي لا غنى عنها في 2026"), excerpt: i18n("Nuestro mapa anual de eventos.", "Our annual event map.", "خريطتنا السنوية للفعاليات."), tags: ["ferias", "eventos"], minutes: 5 },
  { slug: "bakhoor-ritual", title: i18n("El ritual del bakhoor en el hogar árabe", "The bakhoor ritual in the Arab home", "طقوس البخور في البيت العربي"), excerpt: i18n("Cómo se sahúma una casa, y por qué se hace cada viernes.", "How a home is fumigated, and why it's done every Friday.", "كيف يتم تبخير المنزل."), tags: ["bakhoor", "cultura"], minutes: 6 },
];

async function main() {
  console.log("🌱  Sembrando base de datos…");

  // ---- Admin ----
  const passwordHash = await argon2.hash(ADMIN_PASSWORD, { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      name: "Sol Perfumes — Admin",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      newsletterOptIn: false,
      locale: "es",
    },
  });
  console.log(`✓  Admin: ${admin.email}`);

  // ---- Notas ----
  for (const note of olfactiveNotes) {
    await prisma.olfactiveNote.upsert({
      where: { slug: note.slug },
      update: { name: note.name as Prisma.InputJsonValue, icon: note.icon, color: note.color },
      create: {
        slug: note.slug,
        name: note.name as Prisma.InputJsonValue,
        icon: note.icon,
        color: note.color,
      },
    });
  }
  console.log(`✓  ${olfactiveNotes.length} notas olfativas`);

  // ---- Colecciones ----
  for (const [i, c] of collections.entries()) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name as Prisma.InputJsonValue,
        position: i,
        isFeatured: i < 3,
      },
      create: {
        slug: c.slug,
        name: c.name as Prisma.InputJsonValue,
        description: { es: c.description, en: c.description, ar: c.description } as Prisma.InputJsonValue,
        position: i,
        isFeatured: i < 3,
      },
    });
  }
  console.log(`✓  ${collections.length} colecciones`);

  // ---- Productos ----
  for (const [i, p] of products.entries()) {
    const collection = await prisma.collection.findUnique({ where: { slug: p.collection } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name as Prisma.InputJsonValue,
        shortDescription: p.short as Prisma.InputJsonValue,
        gender: p.gender as "MASCULINO" | "FEMENINO" | "UNISEX",
        family: p.family,
        perfumer: p.perfumer,
        origin: p.origin,
        releaseYear: p.year,
        isFeatured: p.flags.isFeatured,
        isNew: p.flags.isNew,
        isLimited: p.flags.isLimited,
        isPublished: true,
        collectionId: collection?.id,
      },
    });

    // imágenes (placeholder estables — el admin puede sobrescribir)
    const baseUrl = `https://images.unsplash.com/photo-${1610000000 + i * 1000}`;
    for (let j = 0; j < 3; j++) {
      const url = `https://images.unsplash.com/photo-${1606220588913 + i * 17 + j}?auto=format&fit=crop&w=1200&q=85`;
      await prisma.productImage.upsert({
        where: { id: `${product.id}-img-${j}` },
        update: {},
        create: {
          id: `${product.id}-img-${j}`,
          productId: product.id,
          url,
          alt: { es: `${(p.name as I18n).es} — vista ${j + 1}`, en: `${(p.name as I18n).en} — view ${j + 1}`, ar: `${(p.name as I18n).ar}` } as Prisma.InputJsonValue,
          position: j,
          isCover: j === 0,
          width: 1200,
          height: 1500,
        },
      });
    }
    void baseUrl;

    // variantes
    for (const [k, v] of p.sizes.entries()) {
      const sku = `SOL-${p.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)}-${v.ml}`;
      await prisma.productVariant.upsert({
        where: { sku },
        update: { priceCents: v.price, stock: 12 + k * 4 },
        create: {
          productId: product.id,
          sizeMl: v.ml,
          sku,
          priceCents: v.price,
          stock: 12 + k * 4,
          weightGrams: 60 + v.ml * 2,
          isDefault: k === Math.floor(p.sizes.length / 2),
        },
      });
    }

    // notas
    for (const [type, slugs] of Object.entries(p.notes) as Array<["SALIDA" | "CORAZON" | "FONDO", string[]]>) {
      for (const [pos, slug] of slugs.entries()) {
        const note = await prisma.olfactiveNote.findUnique({ where: { slug } });
        if (!note) continue;
        await prisma.productNote.upsert({
          where: { productId_noteId_type: { productId: product.id, noteId: note.id, type } },
          update: { position: pos },
          create: { productId: product.id, noteId: note.id, type, position: pos },
        });
      }
    }
  }
  console.log(`✓  ${products.length} productos con variantes, imágenes y notas`);

  // ---- Ferias ----
  for (const f of fairs) {
    await prisma.perfumeFair.upsert({
      where: { slug: f.slug },
      update: {},
      create: {
        slug: f.slug,
        title: f.title as Prisma.InputJsonValue,
        description: { es: f.description.es, en: f.description.en, ar: f.description.ar } as Prisma.InputJsonValue,
        startDate: new Date(f.startDate),
        endDate: new Date(f.endDate),
        city: f.city,
        country: f.country,
        venue: f.venue,
        address: f.address,
        lat: f.lat,
        lng: f.lng,
        websiteUrl: f.websiteUrl,
        isFeatured: f.isFeatured,
        tags: f.tags,
        status: "UPCOMING",
        createdById: admin.id,
        coverImage: `https://images.unsplash.com/photo-${1605000000 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=1600&q=85`,
      },
    });
  }
  console.log(`✓  ${fairs.length} ferias`);

  // ---- Blog ----
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title as Prisma.InputJsonValue,
        excerpt: post.excerpt as Prisma.InputJsonValue,
        content: {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: (post.excerpt as I18n).es }] },
          ],
        } as Prisma.InputJsonValue,
        status: "PUBLISHED",
        publishedAt: new Date(),
        readingMinutes: post.minutes,
        tags: post.tags,
        authorId: admin.id,
      },
    });
  }
  console.log(`✓  ${blogPosts.length} posts de blog`);

  // ---- Reseñas ----
  const sampleReviews = [
    { rating: 5, title: "Hipnótico", body: "Una proyección espectacular. El oud está perfectamente equilibrado con la rosa." },
    { rating: 5, title: "Mi nuevo favorito", body: "Llevo años buscando un mukhallat así. Persistencia de más de 12 horas en piel." },
    { rating: 4, title: "Muy buen frasco", body: "Acabado dorado precioso, el atomizador funciona genial. Volveré a comprar." },
    { rating: 5, title: "Como en Dubái", body: "Me transporta a los zocos. Calidad de exportación europea, sin duda." },
    { rating: 5, title: "Regalo perfecto", body: "Lo regalé a mi madre y se enamoró. La caja es preciosa, el detalle del lazo dorado…" },
    { rating: 4, title: "Algo intenso al principio", body: "Las primeras dos horas son potentes. Después se vuelve celestial." },
    { rating: 5, title: "Calidad real", body: "Se nota que es oud de verdad y no una imitación sintética." },
    { rating: 5, title: "Atención al cliente impecable", body: "Pedido entregado en 24h en Madrid. Vendrán más compras seguro." },
    { rating: 4, title: "Bonita presentación", body: "El envoltorio merece la pena. El perfume, redondo y muy oriental." },
    { rating: 5, title: "Adictivo", body: "No puedo dejar de olerme la muñeca." },
  ];
  const allProducts = await prisma.product.findMany({ select: { id: true } });
  const customer = await prisma.user.upsert({
    where: { email: "cliente.demo@solperfumesarabes.com" },
    update: {},
    create: {
      email: "cliente.demo@solperfumesarabes.com",
      name: "Cliente Demo",
      role: "CUSTOMER",
      emailVerified: new Date(),
      passwordHash: await argon2.hash("Demo!2026", { type: argon2.argon2id }),
    },
  });
  for (const [i, r] of sampleReviews.entries()) {
    const product = allProducts[i % allProducts.length];
    if (!product) continue;
    await prisma.review.upsert({
      where: { productId_userId: { productId: product.id, userId: customer.id } },
      update: {},
      create: {
        productId: product.id,
        userId: customer.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        status: "APPROVED",
        verified: true,
      },
    }).catch(() => {
      // composite unique => si chocamos, ignoramos
    });
  }
  console.log(`✓  reseñas demo`);

  // ---- Settings iniciales ----
  const settings: Array<[string, Prisma.InputJsonValue]> = [
    ["store.name", "Sol Perfumes Árabes"],
    ["store.tagline", { es: "Perfumería árabe de nicho", en: "Arabian niche perfumery", ar: "عطور عربية نيشية" }],
    ["store.currency", "EUR"],
    ["store.country", "ES"],
    ["topbar.enabled", true],
    ["topbar.message", { es: "Envío gratis a partir de 80 € · Muestra de regalo en pedidos > 120 €", en: "Free shipping over €80 · Free sample over €120", ar: "شحن مجاني فوق 80€" }],
    ["shipping.freeThresholdCents", 8000],
    ["shipping.standardCents", 590],
    ["tax.vat.es", 0.21],
  ];
  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`✓  ajustes`);

  console.log("✓  Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
