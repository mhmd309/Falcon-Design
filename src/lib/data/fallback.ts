import type {
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

export const fallbackSiteSettings: SiteSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  company_name_ar: "فالكون ديزاين",
  company_name_en: "Falcon Design",
  tagline_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
  tagline_en: "Where Proven Mastery Meets Structural Innovation",
  logo_url: null,
  phone: "+971 56 233 1020",
  whatsapp: "+971562331020",
  address_ar: "العين، أبوظبي، الإمارات العربية المتحدة",
  address_en: "Al Ain, Abu Dhabi, United Arab Emirates",
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  youtube_url: null,
  x_url: null,
};

const seo = (slug: string, ar: string, en: string, descAr: string, descEn: string, img: string): Omit<SitePage, "id"> => ({
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

export const fallbackPages: SitePage[] = [
  { id: "00000000-0000-0000-0000-000000000101", ...seo("home", "الرئيسية", "Home", "حلول متكاملة لأعمال الصلب والألمنيوم في العين وأبوظبي.", "Integrated steel and aluminum solutions in Al Ain and Abu Dhabi.", "/gallery/01.jpeg"), sort_order: 1, seo_title_ar: "فالكون ديزاين | أعمال الصلب والألمنيوم", seo_title_en: "Falcon Design | Steel & Aluminum Works" },
  { id: "00000000-0000-0000-0000-000000000102", ...seo("about", "من نحن", "About", "تعرف على رؤية ورسالة وفريق فالكون ديزاين.", "Learn about Falcon Design vision, mission, and team.", "/gallery/05.jpeg"), sort_order: 2, seo_title_ar: "من نحن | فالكون ديزاين", seo_title_en: "About Us | Falcon Design" },
  { id: "00000000-0000-0000-0000-000000000103", ...seo("services", "خدماتنا", "Services", "حلول الصلب والألمنيوم المتخصصة للمشاريع الصناعية والمعمارية.", "Specialized steel and aluminum solutions for industrial and architectural projects.", "/gallery/10.jpeg"), sort_order: 3, seo_title_ar: "خدماتنا | فالكون ديزاين", seo_title_en: "Our Services | Falcon Design" },
  { id: "00000000-0000-0000-0000-000000000104", ...seo("gallery", "المشاريع", "Gallery", "استعرض مشاريع فالكون ديزاين في الإنشاءات المعدنية.", "Explore Falcon Design project portfolio.", "/gallery/01.jpeg"), sort_order: 4, seo_title_ar: "معرض المشاريع | فالكون ديزاين", seo_title_en: "Project Gallery | Falcon Design" },
  { id: "00000000-0000-0000-0000-000000000105", ...seo("contact", "تواصل معنا", "Contact", "تواصل مع فريق فالكون ديزاين في العين، أبوظبي.", "Get in touch with Falcon Design in Al Ain, Abu Dhabi.", "/gallery/03.jpeg"), sort_order: 5, seo_title_ar: "تواصل معنا | فالكون ديزاين", seo_title_en: "Contact Us | Falcon Design" },
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

export const fallbackSections: SiteSection[] = [
  section("s-hero", "home", "hero", {
    title_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
    title_en: "Where Proven Mastery Meets Structural Innovation",
    subtitle_ar: "أعمال الصلب والألمنيوم — العين، أبوظبي",
    subtitle_en: "Steel & Aluminum Works — Al Ain, Abu Dhabi",
    description_ar: "نمثل التآزر المثالي بين الابتكار الحديث وعقود من الخبرة الهندسية العميقة. نوفر حلولاً متكاملة تجمع القوة الإنشائية مع الدقة المعمارية.",
    description_en: "Falcon Design represents the perfect synergy between modern innovation and decades of deep-rooted engineering expertise. We deliver integrated steel and aluminum solutions with structural power and architectural precision.",
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
    description_ar: "دع فريقنا الهندسي يحوّل التحديات المعقدة إلى حلول دائمة تصمد أمام الزمن.",
    description_en: "Let our engineering team transform complex challenges into enduring solutions designed to stand the test of time.",
    primary_button_ar: "تواصل معنا",
    primary_button_en: "Contact Us",
    primary_button_href: "/contact",
  }),
  section("s-intro", "about", "introduction", {
    title_ar: "من نحن",
    title_en: "About Us",
    subtitle_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
    subtitle_en: "Where Proven Mastery Meets Structural Innovation",
    description_ar: "فالكون ديزاين مزود رائد لحلول الصلب والألمنيوم المتكاملة، نقدم اندماجاً سلساً بين القوة الإنشائية والدقة المعمارية. رؤيتنا تتجاوز التنفيذ — نسعى لبناء شراكات مستدامة قائمة على الثقة والجودة بلا تنازل.",
    description_en: "Falcon Design is a premier provider of integrated steel and aluminum solutions, delivering a seamless fusion of structural power and architectural precision. Our vision goes beyond execution — we forge sustainable partnerships built on trust and uncompromising quality.",
    image_url: "/gallery/05.jpeg",
    alt_text_ar: "داخل منشأة صناعية حديثة قيد الإنشاء",
    alt_text_en: "Interior of a modern industrial facility under construction",
  }),
  section("s-vision", "about", "vision", {
    title_ar: "رؤيتنا",
    title_en: "Our Vision",
    description_ar: "أن نكون الجهة الرائدة والأكثر ثقة في حلول الصلب والألمنيوم، واضعين معايير جديدة للجودة والابتكار الهندسي الذي يدوم لأجيال.",
    description_en: "To be the leading and most trusted authority in steel and aluminum solutions, setting new benchmarks for quality and engineering innovation that lasts for generations.",
  }),
  section("s-mission", "about", "mission", {
    title_ar: "رسالتنا",
    title_en: "Our Mission",
    description_ar: "تقديم حلول معدنية متكاملة تجمع بين المتانة الإنشائية والأناقة المعمارية، مستفيدين من خبرتنا العميقة وفريقنا المحترف لبناء معالم تدفع نجاح عملائنا.",
    description_en: "To deliver integrated metal solutions that combine structural durability with architectural elegance, leveraging our deep expertise and professional team to build landmarks that drive our clients' success.",
  }),
  section("s-svc", "services", "intro", {
    title_ar: "خدماتنا",
    title_en: "Our Services",
    subtitle_ar: "القوة الهندسية خلف مشاريعكم",
    subtitle_en: "The engineering power behind your projects",
    description_ar: "نوفر حلولاً فولاذية تتميز بالقوة الفائقة والأمان المطلق، مع حلول ألمنيوم متخصصة تمزج الأناقة بالدقة التصنيعية.",
    description_en: "We provide steel solutions defined by superior strength and absolute security, plus specialized aluminum works that blend aesthetic elegance with manufacturing precision.",
  }),
  section("s-contact", "contact", "intro", {
    title_ar: "تواصل معنا",
    title_en: "Contact Us",
    description_ar: "نحن هنا لدعم مشروعك القادم في العين وأبوظبي والإمارات.",
    description_en: "We are here to support your next project across Al Ain, Abu Dhabi, and the UAE.",
  }),
];

export const fallbackStatistics: Statistic[] = [
  { id: "st1", value: "2019", prefix: "", suffix: "", label_ar: "سنة التأسيس", label_en: "Founded", sort_order: 1, is_active: true },
  { id: "st2", value: "15", prefix: "", suffix: "+", label_ar: "سنوات خبرة ميدانية", label_en: "Years Field Expertise", sort_order: 2, is_active: true },
  { id: "st3", value: "100", prefix: "", suffix: "+", label_ar: "مشروع منجز", label_en: "Projects Delivered", sort_order: 3, is_active: true },
  { id: "st4", value: "2", prefix: "", suffix: "", label_ar: "تخصصات رئيسية", label_en: "Core Disciplines", sort_order: 4, is_active: true },
];

export const fallbackServices: Service[] = [
  { id: "sv1", title_ar: "الهناجر والمستودعات", title_en: "Steel Sheds & Hangars", short_description_ar: "تصميم وتنفيذ هناجر ومستودعات ومظلات واسعة.", short_description_en: "Industrial sheds, warehouses, and large-scale canopies.", description_ar: "تصميم وتنفيذ الهناجر الصناعية والمستودعات والمظلات الكبيرة بأقصى درجات المتانة الإنشائية.", description_en: "Designing and executing industrial sheds, warehouses, and large-scale canopies with maximum structural durability.", image_url: "/gallery/01.jpeg", alt_text_ar: "هناجر صلب قيد الإنشاء", alt_text_en: "Steel shed under construction", icon: "warehouse", category: "steel", is_active: true, is_featured: true, is_published: true, sort_order: 1 },
  { id: "sv2", title_ar: "أبواب صلب وشبكات أمان", title_en: "Steel Doors & Security Grills", short_description_ar: "تصنيع أبواب صلب صناعية ومداخل مع حمايات.", short_description_en: "Industrial steel doors with window guards and fencing.", description_ar: "تصنيع أبواب الصلب الصناعية وأبواب المداخل مع حمايات النوافذ والأسوار.", description_en: "Fabrication of industrial and entrance steel doors, window guards, and fencing.", image_url: "/gallery/08.jpeg", alt_text_ar: "أعمال أبواب وشبكات صلب", alt_text_en: "Steel doors and security works", icon: "shield", category: "steel", is_active: true, is_featured: true, is_published: true, sort_order: 2 },
  { id: "sv3", title_ar: "طوابق الميزانين", title_en: "Mezzanine Floors", short_description_ar: "تصميم ذكي لطوابق الميزانين لتعظيم المساحات.", short_description_en: "Intelligent mezzanine design for storage and production.", description_ar: "تصميم وتنفيذ طوابق الميزانين لتعظيم المساحات التشغيلية داخل المنشآت.", description_en: "Intelligent structural design of mezzanine levels to maximize facility space.", image_url: "/gallery/10.jpeg", alt_text_ar: "منشأة صناعية داخلية", alt_text_en: "Industrial interior facility", icon: "layers", category: "steel", is_active: true, is_featured: true, is_published: true, sort_order: 3 },
  { id: "sv4", title_ar: "أعمال الصلب الإنشائية والثانوية", title_en: "Structural & Secondary Steelwork", short_description_ar: "سلالم هروب ودرابزينات وأعمال معدنية مخصصة.", short_description_en: "Fire escapes, handrails, and bespoke metalwork.", description_ar: "تنفيذ سلالم الهروب ودرابزينات الصلب وكافة الأعمال المعدنية المخصصة.", description_en: "Fire escape stairs, steel handrails, and bespoke metalwork to specification.", image_url: "/gallery/06.jpeg", alt_text_ar: "هيكل صلب إنشائي", alt_text_en: "Structural steel framework", icon: "hammer", category: "steel", is_active: true, is_featured: true, is_published: true, sort_order: 4 },
  { id: "sv5", title_ar: "درابزينات ألمنيوم", title_en: "Aluminum Handrails", short_description_ar: "أنظمة درابزين حديثة مقاومة للتآكل.", short_description_en: "Modern anti-corrosive aluminum handrail systems.", description_ar: "تصنيع وتركيب درابزينات الألمنيوم للسلالم والشرفات.", description_en: "Fabrication and installation of modern aluminum handrail systems.", image_url: "/gallery/12.jpeg", alt_text_ar: "درابزين ألمنيوم", alt_text_en: "Aluminum handrail system", icon: "rail", category: "aluminum", is_active: true, is_featured: true, is_published: true, sort_order: 5 },
  { id: "sv6", title_ar: "أبواب ألمنيوم فاخرة", title_en: "Premium Aluminum Doors", short_description_ar: "أبواب ألمنيوم عالية الجودة بعزل ممتاز.", short_description_en: "High-quality aluminum doors with weather insulation.", description_ar: "حلول أبواب ألمنيوم عالية الجودة بتصاميم مبتكرة وعزل استثنائي.", description_en: "High-quality aluminum door solutions with innovative designs and weather insulation.", image_url: "/gallery/15.jpeg", alt_text_ar: "أبواب ألمنيوم", alt_text_en: "Premium aluminum doors", icon: "door", category: "aluminum", is_active: true, is_featured: false, is_published: true, sort_order: 6 },
  { id: "sv7", title_ar: "أعمال ألمنيوم مخصصة", title_en: "Bespoke Aluminum Works", short_description_ar: "حلول ألمنيوم حسب الطلب للمتطلبات المعمارية.", short_description_en: "Tailor-made aluminum for architectural requirements.", description_ar: "حلول ألمنيوم مخصصة بدقة عالية للمتطلبات المعمارية والزخرفية.", description_en: "Tailor-made aluminum solutions for decorative and architectural requirements.", image_url: "/gallery/18.jpeg", alt_text_ar: "أعمال ألمنيوم مخصصة", alt_text_en: "Custom aluminum fabrication", icon: "sparkles", category: "aluminum", is_active: true, is_featured: false, is_published: true, sort_order: 7 },
];

export const fallbackCoreValues: CoreValue[] = [
  { id: "cv1", title_ar: "شراكات مستدامة", title_en: "Sustainable Partnerships", description_ar: "نبني علاقات تمتد لسنوات بعد تسليم المشروع.", description_en: "We forge ongoing relationships that extend for years after delivery.", icon: "handshake", sort_order: 1, is_active: true },
  { id: "cv2", title_ar: "حلول متكاملة", title_en: "Integrated Solutions", description_ar: "نجمع أعمال الصلب الثقيل والألمنيوم المعماري في حل واحد.", description_en: "Heavy steelwork and architectural aluminum in one seamless solution.", icon: "layers", sort_order: 2, is_active: true },
  { id: "cv3", title_ar: "الالتزام بالمواعيد", title_en: "On-Time Delivery", description_ar: "أنظمة إدارة مشاريع صارمة لضمان التسليم في الوقت.", description_en: "Rigorous project management for on-time delivery without compromising quality.", icon: "clock", sort_order: 3, is_active: true },
  { id: "cv4", title_ar: "جودة بلا تنازل", title_en: "Uncompromising Quality", description_ar: "أحدث تقنيات التصنيع ومواد أولية ممتازة.", description_en: "Latest fabrication technologies and premium materials.", icon: "award", sort_order: 4, is_active: true },
];

export const fallbackTimeline: TimelineItem[] = [
  { id: "tl1", year: "2019", title_ar: "انطلاق الشركة", title_en: "Company Launch", description_ar: "بدأت رحلتنا المؤسسية على أساس عقود من الخبرة الميدانية والهندسية.", description_en: "Our corporate journey began on decades of field and engineering expertise.", sort_order: 1, is_active: true },
  { id: "tl2", year: "2020+", title_ar: "نمو المشاريع", title_en: "Project Growth", description_ar: "توسيع نطاق أعمال الصلب والألمنيوم عبر العين وأبوظبي.", description_en: "Expanded steel and aluminum delivery across Al Ain and Abu Dhabi.", sort_order: 2, is_active: true },
  { id: "tl3", year: "Today", title_ar: "تميز مستمر", title_en: "Continuing Excellence", description_ar: "مواصلة رفع معايير الجودة والابتكار في الحلول المعدنية.", description_en: "Raising quality and innovation benchmarks in metal solutions.", sort_order: 3, is_active: true },
];

export const fallbackTeam: TeamMember[] = [
  { id: "tm1", name_ar: "فريق الهندسة", name_en: "Engineering Team", position_ar: "مهندسون وحرفيون متخصصون", position_en: "Specialized Engineers & Craftsmen", bio_ar: "فريق نخبة ملتزم بتحويل التحديات المعقدة إلى واقع عالي الجودة.", bio_en: "An elite team dedicated to transforming complex challenges into high-quality realities.", image_url: null, alt_text_ar: null, alt_text_en: null, sort_order: 1, is_active: true },
];

export const fallbackGalleryCategories: GalleryCategory[] = [
  { id: "11111111-1111-1111-1111-111111111101", name_ar: "هياكل صلب", name_en: "Steel Structures", slug: "steel-structures", sort_order: 1, is_active: true },
  { id: "11111111-1111-1111-1111-111111111102", name_ar: "منشآت داخلية", name_en: "Interiors", slug: "interiors", sort_order: 2, is_active: true },
  { id: "11111111-1111-1111-1111-111111111103", name_ar: "مشاريع منفذة", name_en: "Completed Projects", slug: "completed", sort_order: 3, is_active: true },
];

const cat = (n: number) =>
  n <= 4
    ? "11111111-1111-1111-1111-111111111101"
    : n === 5 || n === 6 || n === 7 || n === 10
      ? "11111111-1111-1111-1111-111111111102"
      : "11111111-1111-1111-1111-111111111103";

export const fallbackGalleryItems: GalleryItem[] = Array.from({ length: 23 }, (_, i) => {
  const n = i + 1;
  const pad = String(n).padStart(2, "0");
  const isZayed = n >= 20;
  return {
    id: `00000000-0000-0000-0000-0000000009${pad}`,
    category_id: cat(n),
    title_ar: isZayed ? `كلية زايد العسكرية ${n}` : `مشروع ${n}`,
    title_en: isZayed ? `Zayed Military College ${n}` : `Project ${n}`,
    description_ar: isZayed ? "أعمال منفذة ضمن مشاريع كلية زايد العسكرية." : "أعمال صلب وألمنيوم منجزة.",
    description_en: isZayed ? "Works delivered for Zayed Military College projects." : "Completed steel and aluminum works.",
    image_url: `/gallery/${pad}.jpeg`,
    alt_text_ar: isZayed ? "مشروع كلية زايد العسكرية" : `مشروع فالكون ديزاين ${n}`,
    alt_text_en: isZayed ? "Zayed Military College project" : `Falcon Design project ${n}`,
    sort_order: n,
    is_featured: [1, 2, 3, 5, 10, 20].includes(n),
    is_active: true,
    is_published: true,
  };
});

export const fallbackContactSettings: ContactSettings = {
  id: "00000000-0000-0000-0000-000000000701",
  page_title_ar: "تواصل معنا",
  page_title_en: "Contact Us",
  page_description_ar: "راسلنا لمناقشة مشروعك القادم في أعمال الصلب والألمنيوم.",
  page_description_en: "Reach out to discuss your next steel and aluminum project.",
  company_name_ar: "فالكون ديزاين للمقاولات العامة — مؤسسة فردية",
  company_name_en: "Falcon Design General Contracting — Sole Proprietorship",
  address_ar: "العين، أبوظبي، الإمارات العربية المتحدة",
  address_en: "Al Ain, Abu Dhabi, United Arab Emirates",
  phone: "+971 56 233 1020",
  whatsapp: "+971562331020",
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

export const fallbackContactEmails: ContactEmail[] = [
  { id: "00000000-0000-0000-0000-000000000801", label_ar: "عام", label_en: "General", email: "falcondesign20@gmail.com", is_active: true, sort_order: 1 },
  { id: "00000000-0000-0000-0000-000000000802", label_ar: "المبيعات", label_en: "Sales", email: "EMAIL_2", is_active: true, sort_order: 2 },
  { id: "00000000-0000-0000-0000-000000000803", label_ar: "المشاريع", label_en: "Projects", email: "EMAIL_3", is_active: true, sort_order: 3 },
  { id: "00000000-0000-0000-0000-000000000804", label_ar: "الدعم", label_en: "Support", email: "EMAIL_4", is_active: true, sort_order: 4 },
  { id: "00000000-0000-0000-0000-000000000805", label_ar: "الإدارة", label_en: "Management", email: "EMAIL_5", is_active: true, sort_order: 5 },
];
