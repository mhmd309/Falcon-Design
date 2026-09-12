import type {
  Certificate,
  ContactEmail,
  ContactSettings,
  CoreValue,
  GalleryCategory,
  GalleryItem,
  Service,
  SitePage,
  SiteSection,
  SiteSettings,
  Statistic,
  TeamMember,
  TimelineItem,
} from "@/types/database";

/**
 * Static site content — edit this file to update the public website.
 * Images live under /public (e.g. /gallery/*.jpeg, /certificates/*.png).
 */

export const siteSettings: SiteSettings = {
  id: "settings",
  company_name_ar: "فالكون ديزاين",
  company_name_en: "Falcon Design",
  tagline_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
  tagline_en: "Where Proven Mastery Meets Structural Innovation",
  logo_url: null,
  phone: "+971 56 233 1020",
  whatsapp: "+971 56 233 1020",
  address_ar: "العين، أبوظبي، الإمارات العربية المتحدة",
  address_en: "Al Ain, Abu Dhabi, United Arab Emirates",
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  youtube_url: null,
  x_url: null,
};

const seo = (
  slug: string,
  ar: string,
  en: string,
  descAr: string,
  descEn: string,
  img: string,
): Omit<SitePage, "id"> => ({
  slug,
  title_ar: ar,
  title_en: en,
  show_in_navigation: true,
  sort_order: 0,
  is_published: true,
  seo_title_ar: `${ar} | فالكون ديزاين`,
  seo_title_en: `${en} | Falcon Design`,
  seo_description_ar: descAr,
  seo_description_en: descEn,
  og_title_ar: ar,
  og_title_en: en,
  og_description_ar: descAr,
  og_description_en: descEn,
  og_image: img,
  canonical_url: null,
});

export const pages: SitePage[] = [
  {
    id: "page-home",
    ...seo(
      "home",
      "الرئيسية",
      "Home",
      "حلول متكاملة لأعمال الصلب والألمنيوم في العين وأبوظبي.",
      "Integrated steel and aluminum solutions in Al Ain and Abu Dhabi.",
      "/gallery/01.jpeg",
    ),
    sort_order: 1,
    seo_title_ar: "فالكون ديزاين | أعمال الصلب والألمنيوم",
    seo_title_en: "Falcon Design | Steel & Aluminum Works",
  },
  {
    id: "page-about",
    ...seo(
      "about",
      "من نحن",
      "About",
      "تعرف على رؤية ورسالة وفريق فالكون ديزاين.",
      "Learn about Falcon Design vision, mission, and team.",
      "/gallery/05.jpeg",
    ),
    sort_order: 2,
  },
  {
    id: "page-services",
    ...seo(
      "services",
      "خدماتنا",
      "Services",
      "حلول الصلب والألمنيوم المتخصصة للمشاريع الصناعية والمعمارية.",
      "Specialized steel and aluminum solutions for industrial and architectural projects.",
      "/gallery/10.jpeg",
    ),
    sort_order: 3,
  },
  {
    id: "page-gallery",
    ...seo(
      "gallery",
      "المشاريع",
      "Gallery",
      "استعرض مشاريع فالكون ديزاين في الإنشاءات المعدنية.",
      "Explore Falcon Design project portfolio.",
      "/gallery/01.jpeg",
    ),
    sort_order: 4,
  },
  {
    id: "page-certificates",
    ...seo(
      "certificates",
      "الشهادات",
      "Certificates",
      "شهادات الاعتماد والجودة لفالكون ديزاين.",
      "Accreditations and quality certificates of Falcon Design.",
      "/certificates/01.png",
    ),
    sort_order: 5,
  },
  {
    id: "page-contact",
    ...seo(
      "contact",
      "تواصل معنا",
      "Contact",
      "تواصل مع فريق فالكون ديزاين في العين، أبوظبي.",
      "Get in touch with Falcon Design in Al Ain, Abu Dhabi.",
      "/gallery/03.jpeg",
    ),
    sort_order: 6,
  },
];

function section(
  id: string,
  page_slug: string,
  section_key: string,
  data: Partial<SiteSection>,
): SiteSection {
  return {
    id,
    page_slug,
    section_key,
    title_ar: null,
    title_en: null,
    subtitle_ar: null,
    subtitle_en: null,
    description_ar: null,
    description_en: null,
    primary_button_ar: null,
    primary_button_en: null,
    primary_button_href: null,
    secondary_button_ar: null,
    secondary_button_en: null,
    secondary_button_href: null,
    image_url: null,
    alt_text_ar: null,
    alt_text_en: null,
    extra: {},
    is_published: true,
    ...data,
  };
}

export const sections: SiteSection[] = [
  section("s-hero", "home", "hero", {
    title_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
    title_en: "Where Proven Mastery Meets Structural Innovation",
    subtitle_ar: "أعمال الصلب والألمنيوم — العين، أبوظبي",
    subtitle_en: "Steel & Aluminum Works — Al Ain, Abu Dhabi",
    description_ar:
      "نمثل التآزر المثالي بين الابتكار الحديث وعقود من الخبرة الهندسية العميقة. نوفر حلولاً متكاملة تجمع القوة الإنشائية مع الدقة المعمارية.",
    description_en:
      "Falcon Design represents the perfect synergy between modern innovation and decades of deep-rooted engineering expertise. We deliver integrated steel and aluminum solutions with structural power and architectural precision.",
    primary_button_ar: "اطلب عرض سعر",
    primary_button_en: "Request a Quote",
    primary_button_href: "/contact",
    secondary_button_ar: "استعرض مشاريعنا",
    secondary_button_en: "View Projects",
    secondary_button_href: "/gallery",
    image_url: "/gallery/10.jpeg",
    alt_text_ar: "صالة صناعية حديثة بإضاءة عالية وهيكل صلب",
    alt_text_en: "Modern industrial hall with high-bay lighting and steel structure",
  }),
  section("s-cta", "home", "cta", {
    title_ar: "هل أنت مستعد لبدء مشروعك؟",
    title_en: "Ready to start your project?",
    description_ar:
      "دع فريقنا الهندسي يحوّل التحديات المعقدة إلى حلول دائمة تصمد أمام الزمن.",
    description_en:
      "Let our engineering team transform complex challenges into enduring solutions designed to stand the test of time.",
    primary_button_ar: "تواصل معنا",
    primary_button_en: "Contact Us",
    primary_button_href: "/contact",
  }),
  section("s-intro", "about", "introduction", {
    title_ar: "من نحن",
    title_en: "About Us",
    subtitle_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
    subtitle_en: "Where Proven Mastery Meets Structural Innovation",
    description_ar:
      "فالكون ديزاين مزود رائد لحلول الصلب والألمنيوم المتكاملة، نقدم اندماجاً سلساً بين القوة الإنشائية والدقة المعمارية. رؤيتنا تتجاوز التنفيذ — نسعى لبناء شراكات مستدامة قائمة على الثقة والجودة بلا تنازل.",
    description_en:
      "Falcon Design is a premier provider of integrated steel and aluminum solutions, delivering a seamless fusion of structural power and architectural precision. Our vision goes beyond execution — we forge sustainable partnerships built on trust and uncompromising quality.",
    image_url: "/gallery/05.jpeg",
    alt_text_ar: "داخل منشأة صناعية حديثة قيد الإنشاء",
    alt_text_en: "Interior of a modern industrial facility under construction",
  }),
  section("s-vision", "about", "vision", {
    title_ar: "رؤيتنا",
    title_en: "Our Vision",
    description_ar:
      "أن نكون الجهة الرائدة والأكثر ثقة في حلول الصلب والألمنيوم، واضعين معايير جديدة للجودة والابتكار الهندسي الذي يدوم لأجيال.",
    description_en:
      "To be the leading and most trusted authority in steel and aluminum solutions, setting new benchmarks for quality and engineering innovation that lasts for generations.",
  }),
  section("s-mission", "about", "mission", {
    title_ar: "رسالتنا",
    title_en: "Our Mission",
    description_ar:
      "تقديم حلول معدنية متكاملة تجمع بين المتانة الإنشائية والأناقة المعمارية، مستفيدين من خبرتنا العميقة وفريقنا المحترف لبناء معالم تدفع نجاح عملائنا.",
    description_en:
      "To deliver integrated metal solutions that combine structural durability with architectural elegance, leveraging our deep expertise and professional team to build landmarks that drive our clients' success.",
  }),
  section("s-svc", "services", "intro", {
    title_ar: "خدماتنا",
    title_en: "Our Services",
    subtitle_ar: "القوة الهندسية خلف مشاريعكم",
    subtitle_en: "The engineering power behind your projects",
    description_ar:
      "نوفر حلولاً فولاذية تتميز بالقوة الفائقة والأمان المطلق، مع حلول ألمنيوم متخصصة تمزج الأناقة بالدقة التصنيعية.",
    description_en:
      "We provide steel solutions defined by superior strength and absolute security, plus specialized aluminum works that blend aesthetic elegance with manufacturing precision.",
  }),
  section("s-certificates", "certificates", "intro", {
    title_ar: "الشهادات والاعتمادات",
    title_en: "Certificates & Accreditations",
    subtitle_ar: "جودة موثّقة ومعايير مهنية",
    subtitle_en: "Documented quality and professional standards",
    description_ar:
      "نلتزم بأعلى معايير الجودة والسلامة والامتثال. اطّلع على شهادات الاعتماد التي تعكس التزامنا بالتميز في أعمال الصلب والألمنيوم.",
    description_en:
      "We uphold the highest standards of quality, safety, and compliance. Explore the accreditations that reflect our commitment to excellence in steel and aluminum works.",
  }),
  section("s-contact", "contact", "intro", {
    title_ar: "تواصل معنا",
    title_en: "Contact Us",
    description_ar: "نحن هنا لدعم مشروعك القادم في العين وأبوظبي والإمارات.",
    description_en:
      "We are here to support your next project across Al Ain, Abu Dhabi, and the UAE.",
  }),
];

export const statistics: Statistic[] = [
  {
    id: "st1",
    value: "2019",
    prefix: "",
    suffix: "",
    label_ar: "سنة التأسيس",
    label_en: "Founded",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "st2",
    value: "15",
    prefix: "",
    suffix: "+",
    label_ar: "سنوات خبرة ميدانية",
    label_en: "Years Field Expertise",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "st3",
    value: "100",
    prefix: "",
    suffix: "+",
    label_ar: "مشروع منجز",
    label_en: "Projects Delivered",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "st4",
    value: "2",
    prefix: "",
    suffix: "",
    label_ar: "تخصصات رئيسية",
    label_en: "Core Disciplines",
    sort_order: 4,
    is_active: true,
  },
];

export const services: Service[] = [
  {
    id: "sv1",
    title_ar: "الهناجر والمستودعات",
    title_en: "Steel Sheds & Hangars",
    short_description_ar: "تصميم وتنفيذ هناجر ومستودعات ومظلات واسعة.",
    short_description_en: "Industrial sheds, warehouses, and large-scale canopies.",
    description_ar:
      "تصميم وتنفيذ الهناجر الصناعية والمستودعات والمظلات الكبيرة بأقصى درجات المتانة الإنشائية.",
    description_en:
      "Designing and executing industrial sheds, warehouses, and large-scale canopies with maximum structural durability.",
    image_url: "/gallery/01.jpeg",
    alt_text_ar: "هناجر صلب قيد الإنشاء",
    alt_text_en: "Steel shed under construction",
    icon: "warehouse",
    category: "steel",
    is_active: true,
    is_featured: true,
    is_published: true,
    sort_order: 1,
  },
  {
    id: "sv2",
    title_ar: "أبواب صلب وشبكات أمان",
    title_en: "Steel Doors & Security Grills",
    short_description_ar: "تصنيع أبواب صلب صناعية ومداخل مع حمايات.",
    short_description_en: "Industrial steel doors with window guards and fencing.",
    description_ar:
      "تصنيع أبواب الصلب الصناعية وأبواب المداخل مع حمايات النوافذ والأسوار.",
    description_en:
      "Fabrication of industrial and entrance steel doors, window guards, and fencing.",
    image_url: "/gallery/08.jpeg",
    alt_text_ar: "أعمال أبواب وشبكات صلب",
    alt_text_en: "Steel doors and security works",
    icon: "shield",
    category: "steel",
    is_active: true,
    is_featured: true,
    is_published: true,
    sort_order: 2,
  },
  {
    id: "sv3",
    title_ar: "طوابق الميزانين",
    title_en: "Mezzanine Floors",
    short_description_ar: "تصميم ذكي لطوابق الميزانين لتعظيم المساحات.",
    short_description_en: "Intelligent mezzanine design for storage and production.",
    description_ar:
      "تصميم وتنفيذ طوابق الميزانين لتعظيم المساحات التشغيلية داخل المنشآت.",
    description_en:
      "Intelligent structural design of mezzanine levels to maximize facility space.",
    image_url: "/gallery/10.jpeg",
    alt_text_ar: "منشأة صناعية داخلية",
    alt_text_en: "Industrial interior facility",
    icon: "layers",
    category: "steel",
    is_active: true,
    is_featured: true,
    is_published: true,
    sort_order: 3,
  },
  {
    id: "sv4",
    title_ar: "أعمال الصلب الإنشائية والثانوية",
    title_en: "Structural & Secondary Steelwork",
    short_description_ar: "سلالم هروب ودرابزينات وأعمال معدنية مخصصة.",
    short_description_en: "Fire escapes, handrails, and bespoke metalwork.",
    description_ar:
      "تنفيذ سلالم الهروب ودرابزينات الصلب وكافة الأعمال المعدنية المخصصة.",
    description_en:
      "Fire escape stairs, steel handrails, and bespoke metalwork to specification.",
    image_url: "/gallery/06.jpeg",
    alt_text_ar: "هيكل صلب إنشائي",
    alt_text_en: "Structural steel framework",
    icon: "hammer",
    category: "steel",
    is_active: true,
    is_featured: true,
    is_published: true,
    sort_order: 4,
  },
  {
    id: "sv5",
    title_ar: "درابزينات ألمنيوم",
    title_en: "Aluminum Handrails",
    short_description_ar: "أنظمة درابزين حديثة مقاومة للتآكل.",
    short_description_en: "Modern anti-corrosive aluminum handrail systems.",
    description_ar: "تصنيع وتركيب درابزينات الألمنيوم للسلالم والشرفات.",
    description_en:
      "Fabrication and installation of modern aluminum handrail systems.",
    image_url: "/gallery/12.jpeg",
    alt_text_ar: "درابزين ألمنيوم",
    alt_text_en: "Aluminum handrail system",
    icon: "rail",
    category: "aluminum",
    is_active: true,
    is_featured: true,
    is_published: true,
    sort_order: 5,
  },
  {
    id: "sv6",
    title_ar: "أبواب ألمنيوم فاخرة",
    title_en: "Premium Aluminum Doors",
    short_description_ar: "أبواب ألمنيوم عالية الجودة بعزل ممتاز.",
    short_description_en: "High-quality aluminum doors with weather insulation.",
    description_ar:
      "حلول أبواب ألمنيوم عالية الجودة بتصاميم مبتكرة وعزل استثنائي.",
    description_en:
      "High-quality aluminum door solutions with innovative designs and weather insulation.",
    image_url: "/gallery/15.jpeg",
    alt_text_ar: "أبواب ألمنيوم",
    alt_text_en: "Premium aluminum doors",
    icon: "door",
    category: "aluminum",
    is_active: true,
    is_featured: false,
    is_published: true,
    sort_order: 6,
  },
  {
    id: "sv7",
    title_ar: "أعمال ألمنيوم مخصصة",
    title_en: "Bespoke Aluminum Works",
    short_description_ar: "حلول ألمنيوم حسب الطلب للمتطلبات المعمارية.",
    short_description_en: "Tailor-made aluminum for architectural requirements.",
    description_ar:
      "حلول ألمنيوم مخصصة بدقة عالية للمتطلبات المعمارية والزخرفية.",
    description_en:
      "Tailor-made aluminum solutions for decorative and architectural requirements.",
    image_url: "/gallery/18.jpeg",
    alt_text_ar: "أعمال ألمنيوم مخصصة",
    alt_text_en: "Custom aluminum fabrication",
    icon: "sparkles",
    category: "aluminum",
    is_active: true,
    is_featured: false,
    is_published: true,
    sort_order: 7,
  },
];

export const coreValues: CoreValue[] = [
  {
    id: "cv1",
    title_ar: "شراكات مستدامة",
    title_en: "Sustainable Partnerships",
    description_ar: "نبني علاقات تمتد لسنوات بعد تسليم المشروع.",
    description_en:
      "We forge ongoing relationships that extend for years after delivery.",
    icon: "handshake",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "cv2",
    title_ar: "حلول متكاملة",
    title_en: "Integrated Solutions",
    description_ar:
      "نجمع أعمال الصلب الثقيل والألمنيوم المعماري في حل واحد.",
    description_en:
      "Heavy steelwork and architectural aluminum in one seamless solution.",
    icon: "layers",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "cv3",
    title_ar: "الالتزام بالمواعيد",
    title_en: "On-Time Delivery",
    description_ar: "أنظمة إدارة مشاريع صارمة لضمان التسليم في الوقت.",
    description_en:
      "Rigorous project management for on-time delivery without compromising quality.",
    icon: "clock",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "cv4",
    title_ar: "جودة بلا تنازل",
    title_en: "Uncompromising Quality",
    description_ar: "أحدث تقنيات التصنيع ومواد أولية ممتازة.",
    description_en: "Latest fabrication technologies and premium materials.",
    icon: "award",
    sort_order: 4,
    is_active: true,
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "tl1",
    year: "2019",
    title_ar: "انطلاق الشركة",
    title_en: "Company Launch",
    description_ar:
      "بدأت رحلتنا المؤسسية على أساس عقود من الخبرة الميدانية والهندسية.",
    description_en:
      "Our corporate journey began on decades of field and engineering expertise.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "tl2",
    year: "2020+",
    title_ar: "نمو المشاريع",
    title_en: "Project Growth",
    description_ar: "توسيع نطاق أعمال الصلب والألمنيوم عبر العين وأبوظبي.",
    description_en:
      "Expanded steel and aluminum delivery across Al Ain and Abu Dhabi.",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "tl3",
    year: "Today",
    title_ar: "تميز مستمر",
    title_en: "Continuing Excellence",
    description_ar: "مواصلة رفع معايير الجودة والابتكار في الحلول المعدنية.",
    description_en:
      "Raising quality and innovation benchmarks in metal solutions.",
    sort_order: 3,
    is_active: true,
  },
];

export const team: TeamMember[] = [
  {
    id: "tm1",
    name_ar: "فريق الهندسة",
    name_en: "Engineering Team",
    position_ar: "مهندسون وحرفيون متخصصون",
    position_en: "Specialized Engineers & Craftsmen",
    bio_ar:
      "فريق نخبة ملتزم بتحويل التحديات المعقدة إلى واقع عالي الجودة.",
    bio_en:
      "An elite team dedicated to transforming complex challenges into high-quality realities.",
    image_url: null,
    alt_text_ar: null,
    alt_text_en: null,
    sort_order: 1,
    is_active: true,
  },
];

export const galleryCategories: GalleryCategory[] = [
  {
    id: "cat-steel",
    name_ar: "هياكل صلب",
    name_en: "Steel Structures",
    slug: "steel-structures",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "cat-interiors",
    name_ar: "منشآت داخلية",
    name_en: "Interiors",
    slug: "interiors",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "cat-completed",
    name_ar: "مشاريع منفذة",
    name_en: "Completed Projects",
    slug: "completed",
    sort_order: 3,
    is_active: true,
  },
];

const cat = (n: number) =>
  n <= 4
    ? "cat-steel"
    : n === 5 || n === 6 || n === 7 || n === 10
      ? "cat-interiors"
      : "cat-completed";

/** Gallery images: files in /public/gallery/01.jpeg … 23.jpeg */
export const galleryItems: GalleryItem[] = Array.from({ length: 23 }, (_, i) => {
  const n = i + 1;
  const pad = String(n).padStart(2, "0");
  const isZayed = n >= 20;
  return {
    id: `gallery-${pad}`,
    category_id: cat(n),
    title_ar: isZayed ? `كلية زايد العسكرية ${n}` : `مشروع ${n}`,
    title_en: isZayed ? `Zayed Military College ${n}` : `Project ${n}`,
    description_ar: isZayed
      ? "أعمال منفذة ضمن مشاريع كلية زايد العسكرية."
      : "أعمال صلب وألمنيوم منجزة.",
    description_en: isZayed
      ? "Works delivered for Zayed Military College projects."
      : "Completed steel and aluminum works.",
    image_url: `/gallery/${pad}.jpeg`,
    alt_text_ar: isZayed
      ? "مشروع كلية زايد العسكرية"
      : `مشروع فالكون ديزاين ${n}`,
    alt_text_en: isZayed
      ? "Zayed Military College project"
      : `Falcon Design project ${n}`,
    sort_order: n,
    is_featured: [1, 2, 3, 5, 10, 20].includes(n),
    is_active: true,
    is_published: true,
  };
});

/**
 * Contact emails — edit addresses here manually.
 * Only entries with a real email (not empty) are shown on the site.
 */
export const contactEmails: ContactEmail[] = [
  {
    id: "email-1",
    label_ar: "عام",
    label_en: "General",
    email: "falcondesign20@gmail.com",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "email-2",
    label_ar: "المبيعات",
    label_en: "Sales",
    email: "sales@falcondesign.ae",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "email-3",
    label_ar: "المشاريع",
    label_en: "Projects",
    email: "projects@falcondesign.ae",
    is_active: true,
    sort_order: 3,
  },
];

export const contactSettings: ContactSettings = {
  id: "contact-settings",
  page_title_ar: "تواصل معنا",
  page_title_en: "Contact Us",
  page_description_ar: "راسلنا لمناقشة مشروعك القادم في أعمال الصلب والألمنيوم.",
  page_description_en: "Reach out to discuss your next steel and aluminum project.",
  company_name_ar: "فالكون ديزاين للمقاولات العامة — مؤسسة فردية",
  company_name_en: "Falcon Design General Contracting — Sole Proprietorship",
  address_ar: "العين، أبوظبي، الإمارات العربية المتحدة",
  address_en: "Al Ain, Abu Dhabi, United Arab Emirates",
  phone: "+971 56 233 1020",
  whatsapp: "+971 56 233 1020",
  business_hours_ar: "الأحد – الخميس: 8:00 ص – 6:00 م",
  business_hours_en: "Sunday – Thursday: 8:00 AM – 6:00 PM",
  latitude: 24.2075,
  longitude: 55.7447,
  google_maps_url: "https://maps.google.com/?q=Al+Ain+Abu+Dhabi+UAE",
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  youtube_url: null,
  x_url: null,
};

/**
 * Certificates — labels match the official document titles on each image scan.
 */
export const certificates: Certificate[] = [
  {
    id: "cert-1",
    title_ar: "شهادة السجل التجاري",
    title_en: "Commercial Registration Certificate",
    description_ar:
      "شهادة السجل التجاري لفالكون ديزاين للمقاولات العامة — شركة الشخص الواحد ذ.م.م، وتتضمن بيانات الرخصة والملكية ورأس المال.",
    description_en:
      "Commercial Registration Certificate for Falcon Design General Contracting — Sole Proprietorship L.L.C, including licence, ownership, and capital details.",
    issuer_ar: "سلطة أبوظبي للتسجيل / دائرة التنمية الاقتصادية",
    issuer_en: "Abu Dhabi Registration Authority / Department of Economic Development",
    year: "2024",
    image_url: "/certificates/01.png",
    alt_text_ar: "شهادة السجل التجاري — الصفحة الأولى",
    alt_text_en: "Commercial Registration Certificate — page 1",
    sort_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: "cert-2",
    title_ar: "شهادة السجل التجاري — الأنشطة والعنوان",
    title_en: "Commercial Registration Certificate — Activities & Address",
    description_ar:
      "صفحة الأنشطة المرخصة والعنوان الرسمي وعمليات الرخصة ضمن شهادة السجل التجاري.",
    description_en:
      "Licensed activities, official address, and licence transactions page of the Commercial Registration Certificate.",
    issuer_ar: "سلطة أبوظبي للتسجيل / دائرة التنمية الاقتصادية",
    issuer_en: "Abu Dhabi Registration Authority / Department of Economic Development",
    year: "2024",
    image_url: "/certificates/02.png",
    alt_text_ar: "شهادة السجل التجاري — الأنشطة والعنوان",
    alt_text_en: "Commercial Registration Certificate — activities and address",
    sort_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: "cert-3",
    title_ar: "شهادة السجل التجاري — عمليات الرخصة",
    title_en: "Commercial Registration Certificate — Licence Transactions",
    description_ar:
      "سجل عمليات الرخصة، بما في ذلك تعديل الأنشطة وإضافة أعمال تركيب السياج والأسلاك الشائكة.",
    description_en:
      "Licence transactions record, including activity replacement and adding fence and barbed wire installation works.",
    issuer_ar: "سلطة أبوظبي للتسجيل / دائرة التنمية الاقتصادية",
    issuer_en: "Abu Dhabi Registration Authority / Department of Economic Development",
    year: "2025",
    image_url: "/certificates/03.png",
    alt_text_ar: "شهادة السجل التجاري — عمليات الرخصة",
    alt_text_en: "Commercial Registration Certificate — licence transactions",
    sort_order: 3,
    is_featured: true,
    is_active: true,
  },
  {
    id: "cert-4",
    title_ar: "رخصة أبوظبي الاقتصادية",
    title_en: "Abu Dhabi Economic Licence",
    description_ar:
      "الرخصة الاقتصادية الرسمية لفالكون ديزاين، وتشمل بيانات الرخصة والملكية والأنشطة المرخصة والعنوان.",
    description_en:
      "Official Abu Dhabi Economic Licence for Falcon Design, including licence details, ownership, licensed activities, and address.",
    issuer_ar: "سلطة أبوظبي للتسجيل / دائرة التنمية الاقتصادية",
    issuer_en: "Abu Dhabi Registration Authority / Department of Economic Development",
    year: "2024",
    image_url: "/certificates/04.png",
    alt_text_ar: "رخصة أبوظبي الاقتصادية",
    alt_text_en: "Abu Dhabi Economic Licence",
    sort_order: 4,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-5",
    title_ar: "رخصة أبوظبي الاقتصادية — معلومات إضافية",
    title_en: "Abu Dhabi Economic Licence — Additional Information",
    description_ar:
      "المعلومات الإضافية للرخصة الاقتصادية، وتشمل أرقام عضوية الغرفة وبطاقة المنشأة لدى الوزارة والهيئة الاتحادية للهوية والجنسية.",
    description_en:
      "Additional economic licence information, including ADCCI membership and MOHRE / ICP establishment card numbers.",
    issuer_ar: "سلطة أبوظبي للتسجيل / دائرة التنمية الاقتصادية",
    issuer_en: "Abu Dhabi Registration Authority / Department of Economic Development",
    year: "2024",
    image_url: "/certificates/05.png",
    alt_text_ar: "رخصة أبوظبي الاقتصادية — معلومات إضافية",
    alt_text_en: "Abu Dhabi Economic Licence — additional information",
    sort_order: 5,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-6",
    title_ar: "بطاقة منشأة",
    title_en: "Establishment Card",
    description_ar:
      "بطاقة منشأة صادرة عن الهيئة الاتحادية للهوية والجنسية / إدارة العين لفالكون ديزاين، وتتضمن المخول بالتوقيع.",
    description_en:
      "Establishment Card issued by the Federal Authority for Identity & Citizenship / Al Ain Administration for Falcon Design, including the authorized signatory.",
    issuer_ar: "الهيئة الاتحادية للهوية والجنسية — إدارة العين",
    issuer_en: "Federal Authority for Identity & Citizenship — Al Ain Administration",
    year: "2023",
    image_url: "/certificates/06.png",
    alt_text_ar: "بطاقة منشأة — الهيئة الاتحادية للهوية والجنسية",
    alt_text_en: "Establishment Card — Federal Authority for Identity & Citizenship",
    sort_order: 6,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-7",
    title_ar: "شهادة تسجيل لضريبة القيمة المضافة",
    title_en: "VAT Registration Certificate",
    description_ar:
      "شهادة تسجيل فالكون ديزاين لضريبة القيمة المضافة في الإمارات العربية المتحدة وفق المرسوم بقانون اتحادي رقم 8 لسنة 2017.",
    description_en:
      "Certificate of Registration for Value Added Tax in the UAE for Falcon Design, as per Federal Decree-Law No. 8 of 2017.",
    issuer_ar: "الهيئة الاتحادية للضرائب",
    issuer_en: "Federal Tax Authority",
    year: "2023",
    image_url: "/certificates/07.png",
    alt_text_ar: "شهادة تسجيل لضريبة القيمة المضافة",
    alt_text_en: "VAT registration certificate",
    sort_order: 7,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-8",
    title_ar: "قائمة المؤسسات ضمن التسجيل الضريبي — ضريبة القيمة المضافة",
    title_en: "Establishments List under VAT Registration",
    description_ar:
      "قائمة المؤسسات الفردية والفروع المدرجة ضمن التسجيل الضريبي لضريبة القيمة المضافة، مع رقم الرخصة وجهة الترخيص.",
    description_en:
      "List of sole establishments and branches under the VAT taxable person registration, including licence number and licensing authority.",
    issuer_ar: "الهيئة الاتحادية للضرائب",
    issuer_en: "Federal Tax Authority",
    year: "2023",
    image_url: "/certificates/08.png",
    alt_text_ar: "قائمة المؤسسات ضمن التسجيل الضريبي لضريبة القيمة المضافة",
    alt_text_en: "Establishments list under VAT registration",
    sort_order: 8,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-9",
    title_ar: "شهادة تسجيل لضريبة الشركات",
    title_en: "Corporate Tax Registration Certificate",
    description_ar:
      "شهادة تسجيل فالكون ديزاين لضريبة الشركات في الإمارات وفق المرسوم بقانون اتحادي رقم 47 لسنة 2022.",
    description_en:
      "Certificate of Registration for Corporate Tax in the UAE for Falcon Design, as per Federal Decree-Law No. 47 of 2022.",
    issuer_ar: "الهيئة الاتحادية للضرائب",
    issuer_en: "Federal Tax Authority",
    year: "2024",
    image_url: "/certificates/09.png",
    alt_text_ar: "شهادة تسجيل لضريبة الشركات",
    alt_text_en: "Corporate tax registration certificate",
    sort_order: 9,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-10",
    title_ar: "قائمة المؤسسات ضمن التسجيل الضريبي — ضريبة الشركات",
    title_en: "Establishments List under Corporate Tax Registration",
    description_ar:
      "قائمة المؤسسات الفردية والفروع المندرجة ضمن التسجيل الضريبي لضريبة الشركات، مع جهة الترخيص ورقم الرخصة.",
    description_en:
      "List of sole establishments and branches under the corporate tax taxable person registration, including licensing authority and licence number.",
    issuer_ar: "الهيئة الاتحادية للضرائب",
    issuer_en: "Federal Tax Authority",
    year: "2024",
    image_url: "/certificates/10.png",
    alt_text_ar: "قائمة المؤسسات ضمن التسجيل الضريبي لضريبة الشركات",
    alt_text_en: "Establishments list under corporate tax registration",
    sort_order: 10,
    is_featured: false,
    is_active: true,
  },
  {
    id: "cert-11",
    title_ar: "بطاقة اعتماد التواقيع",
    title_en: "Electronic Company Card",
    description_ar:
      "بطاقة اعتماد التواقيع الصادرة عن وزارة الموارد البشرية والتوطين لفالكون ديزاين، وتتضمن المخول بالتوقيع.",
    description_en:
      "Electronic Company Card issued by the Ministry of Human Resources and Emiratisation for Falcon Design, including the authorized signatory.",
    issuer_ar: "وزارة الموارد البشرية والتوطين",
    issuer_en: "Ministry of Human Resources and Emiratisation",
    year: null,
    image_url: "/certificates/11.png",
    alt_text_ar: "بطاقة اعتماد التواقيع — وزارة الموارد البشرية والتوطين",
    alt_text_en: "Electronic Company Card — Ministry of Human Resources and Emiratisation",
    sort_order: 11,
    is_featured: false,
    is_active: true,
  },
];
