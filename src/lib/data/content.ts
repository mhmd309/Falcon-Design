import type {
  Certificate,
  ContactEmail,
  CoreValue,
  GalleryCategory,
  GalleryItem,
  Service,
  SitePage,
  SiteSection,
  SiteSettings,
  Statistic,
  TimelineItem,
} from "@/types/content";
export const siteSettings: SiteSettings = {
  id: "settings",
  company_name_ar: "فالكون ديزاين",
  company_name_en: "Falcon Design",
  tagline_ar: "حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي",
  tagline_en: "Where Proven Mastery Meets Structural Innovation",
  logo_url: "/logo.png",
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
      "فالكون ديزاين — مقاولات عامة وأعمال صلب وألمنيوم في العين وأبوظبي. هياكل فولاذية، أبواب ونوافذ ألمنيوم، ودرابزين بجودة هندسية.",
      "Falcon Design — steel & aluminum fabrication and general contracting in Al Ain & Abu Dhabi. Structures, aluminum doors & windows, and precision metal works.",
      "/gallery/01.jpeg",
    ),
    seo_title_ar: "فالكون ديزاين | أعمال الصلب والألمنيوم في العين وأبوظبي",
    seo_title_en: "Falcon Design | Steel & Aluminum Works in Al Ain & Abu Dhabi",
  },
  {
    id: "page-about",
    ...seo(
      "about",
      "من نحن",
      "About",
      "تعرّف على فالكون ديزاين: رؤيتنا، رسالتنا، وقيمنا في تنفيذ مشاريع الصلب والألمنيوم باحترافية في الإمارات.",
      "Discover Falcon Design: our vision, mission, and values delivering professional steel and aluminum projects across the UAE.",
      "/gallery/05.jpeg",
    ),
  },
  {
    id: "page-services",
    ...seo(
      "services",
      "خدماتنا",
      "Services",
      "خدمات فالكون ديزاين: تركيب الهياكل الفولاذية، أعمال الألمنيوم، الدرابزين، الأسوار، والميزانين للمشاريع الصناعية والمعمارية.",
      "Falcon Design services: steel structure erection, aluminum works, handrails, fencing, and mezzanines for industrial and architectural projects.",
      "/gallery/10.jpeg",
    ),
  },
  {
    id: "page-gallery",
    ...seo(
      "gallery",
      "المشاريع",
      "Gallery",
      "معرض مشاريع فالكون ديزاين: أعمال صلب وألمنيوم منفّذة في العين وأبوظبي، بما في ذلك مشاريع كلية زايد العسكرية.",
      "Falcon Design project gallery: completed steel and aluminum works in Al Ain and Abu Dhabi, including Zayed Military College projects.",
      "/gallery/01.jpeg",
    ),
  },
  {
    id: "page-certificates",
    ...seo(
      "certificates",
      "الشهادات",
      "Certificates",
      "شهادات الترخيص والاعتماد الرسمية لفالكون ديزاين في أبوظبي — سجل تجاري ورخصة اقتصادية.",
      "Official Falcon Design licences and accreditations in Abu Dhabi — commercial registration and economic licence.",
      "/certificates/01.png",
    ),
  },
  {
    id: "page-contact",
    ...seo(
      "contact",
      "تواصل معنا",
      "Contact",
      "تواصل مع فالكون ديزاين في العين، أبوظبي — هاتف، واتساب، أو نموذج الطلب لمشاريع الصلب والألمنيوم.",
      "Contact Falcon Design in Al Ain, Abu Dhabi — phone, WhatsApp, or inquiry form for steel and aluminum projects.",
      "/gallery/03.jpeg",
    ),
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
    primary_button_ar: "تواصل معنا",
    primary_button_en: "Contact Us",
    primary_button_href: "/contact",
    secondary_button_ar: "استعرض مشاريعنا",
    secondary_button_en: "View Projects",
    secondary_button_href: "/gallery",
    image_url: "/slidehero.jpg",
    alt_text_ar: "هيكل صلب صناعي بإضاءة ذهبية — خلفية فالكون ديزاين",
    alt_text_en: "Industrial steel structure in golden light — Falcon Design hero",
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
  },
  {
    id: "st2",
    value: "15",
    prefix: "",
    suffix: "+",
    label_ar: "سنوات خبرة ميدانية",
    label_en: "Years Field Expertise",
  },
  {
    id: "st3",
    value: "100",
    prefix: "",
    suffix: "+",
    label_ar: "مشروع منجز",
    label_en: "Projects Delivered",
  },
  {
    id: "st4",
    value: "2",
    prefix: "",
    suffix: "",
    label_ar: "تخصصات رئيسية",
    label_en: "Core Disciplines",
  },
];

export const services: Service[] = [
  {
    id: "sv1",
    title_ar: "تركيب الهياكل الفولاذية",
    title_en: "Steel Structure Erection",
    short_description_ar: "رفع وتركيب أعمدة وعوارض الصلب للمباني الصناعية.",
    short_description_en: "Lifting and erecting steel columns and beams for industrial buildings.",
    description_ar:
      "تنفيذ أعمال رفع وتركيب الهياكل الفولاذية باستخدام الرافعات الثقيلة، مع دقة في محاذاة الأعمدة والكمرات وفق المخططات الهندسية ومعايير السلامة في الموقع.",
    description_en:
      "Erection of steel frames with heavy-lift cranes, precise alignment of columns and beams to engineering drawings, and strict on-site safety standards.",
    image_url: "/gallery/01.jpeg",
    alt_text_ar: "رافعات تركّب هيكل صلب لمبنى صناعي",
    alt_text_en: "Cranes erecting a steel frame for an industrial building",
    icon: "crane",
    category: "steel",
    is_featured: true,
  },
  {
    id: "sv2",
    title_ar: "هناجر ومستودعات معدنية",
    title_en: "Steel Sheds & Warehouses",
    short_description_ar: "تصميم وتنفيذ هناجر ومستودعات بهياكل صلب متينة.",
    short_description_en: "Design and build of durable steel sheds and warehouses.",
    description_ar:
      "توريد وتركيب هياكل الهناجر والمستودعات المعدنية من الأساسات الخرسانية حتى الهيكل الحامل، لتلبية احتياجات التخزين والتصنيع واللوجستيات.",
    description_en:
      "Supply and installation of steel sheds and warehouses from concrete foundations through the load-bearing frame for storage, manufacturing, and logistics needs.",
    image_url: "/gallery/20.jpeg",
    alt_text_ar: "هيكل هناجر صلب على قاعدة خرسانية",
    alt_text_en: "Steel hangar frame on a concrete slab",
    icon: "warehouse",
    category: "steel",
    is_featured: true,
  },
  {
    id: "sv3",
    title_ar: "مقاولات الإنشاءات المعدنية",
    title_en: "Metal Construction Contracting",
    short_description_ar: "تنفيذ مشاريع الإنشاءات المعدنية الصناعية والتجارية.",
    short_description_en: "Delivery of industrial and commercial metal construction projects.",
    description_ar:
      "إدارة وتنفيذ مقاولات الإنشاءات المعدنية بدءًا من تجهيز الموقع وتركيب الأعمدة والكمرات وحتى اكتمال الهيكل المعدني للمصانع والمستودعات.",
    description_en:
      "Full metal construction contracting from site preparation and frame assembly through completion of industrial and commercial steel buildings.",
    image_url: "/gallery/03.jpeg",
    alt_text_ar: "موقع إنشاء هيكل معدني برافعات ومعدات ثقيلة",
    alt_text_en: "Metal construction site with cranes and heavy equipment",
    icon: "building",
    category: "steel",
    is_featured: true,
  },
  {
    id: "sv4",
    title_ar: "تجميع الإطارات الفولاذية",
    title_en: "Steel Frame Assembly",
    short_description_ar: "تجميع وربط الإطارات الفولاذية بدقة ميدانية عالية.",
    short_description_en: "On-site assembly and bolting of steel portal frames.",
    description_ar:
      "تجميع الإطارات الفولاذية وربط الكمرات والدعامات في الموقع بفرق متخصصة، مع الالتزام بجداول التنفيذ ومعايير الجودة والسلامة.",
    description_en:
      "Specialist on-site assembly of steel portal frames, beams, and bracing to programme, quality, and safety requirements.",
    image_url: "/gallery/08.jpeg",
    alt_text_ar: "عمال يجمعون إطارًا فولاذيًا في موقع البناء",
    alt_text_en: "Workers assembling a steel frame on site",
    icon: "wrench",
    category: "steel",
    is_featured: true,
  },
  {
    id: "sv5",
    title_ar: "تكسية ألواح الساندوتش بانل",
    title_en: "Sandwich Panel Cladding",
    short_description_ar: "تركيب ألواح عازلة للأسقف والجدران الصناعية.",
    short_description_en: "Insulated sandwich panel installation for roofs and walls.",
    description_ar:
      "تركيب ألواح الساندوتش بانل العازلة للهناجر والمستودعات لتحقيق عزل حراري جيد وسرعة تنفيذ ومظهر خارجي منتظم للمنشآت الصناعية.",
    description_en:
      "Installation of insulated sandwich panels for hangars and warehouses, delivering thermal performance, fast build times, and a clean industrial finish.",
    image_url: "/gallery/06.jpeg",
    alt_text_ar: "مبنى صناعي مكسو بألواح عازلة",
    alt_text_en: "Industrial building clad with insulated panels",
    icon: "panels",
    category: "steel",
    is_featured: true,
  },
  {
    id: "sv6",
    title_ar: "تشطيب المستودعات الصناعية",
    title_en: "Industrial Warehouse Finishing",
    short_description_ar: "تشطيب داخلي كامل للمستودعات بمساحات مفتوحة وإضاءة عالية.",
    short_description_en: "Complete warehouse interiors with open spans and high-bay lighting.",
    description_ar:
      "تشطيب الفراغات الصناعية من ألواح داخلية وأرضيات خرسانية وأنظمة إضاءة عالية الارتفاع، لتجهيز المستودع للاستخدام التشغيلي مباشرة.",
    description_en:
      "Interior finishing of industrial spaces including wall panels, concrete floors, and high-bay lighting so warehouses are ready for operational use.",
    image_url: "/gallery/10.jpeg",
    alt_text_ar: "داخل مستودع صناعي مكتمل الإضاءة والألواح",
    alt_text_en: "Finished industrial warehouse interior with high-bay lighting",
    icon: "interior",
    category: "steel",
    is_featured: false,
  },
  {
    id: "sv7",
    title_ar: "هياكل صلب ثقيلة",
    title_en: "Heavy Steel Structures",
    short_description_ar: "تنفيذ هياكل صلب ثقيلة للمشاريع الصناعية الكبيرة.",
    short_description_en: "Heavy-duty steel structures for large industrial projects.",
    description_ar:
      "تصنيع وتركيب هياكل الصلب الثقيلة للمصانع والمنشآت الكبيرة، مع رافعات ومعدات متخصصة لضمان المتانة والاستقرار الإنشائي.",
    description_en:
      "Fabrication and erection of heavy steel structures for factories and large facilities, using specialised plant to ensure durability and structural stability.",
    image_url: "/gallery/07.jpeg",
    alt_text_ar: "رافعات تعمل على هيكل صلب ثقيل",
    alt_text_en: "Cranes working on a heavy steel structure",
    icon: "hammer",
    category: "steel",
    is_featured: false,
  },
  {
    id: "sv8",
    title_ar: "مساحات صناعية جاهزة",
    title_en: "Turnkey Industrial Spaces",
    short_description_ar: "تسليم مساحات صناعية جاهزة للتشغيل بمعايير عالية.",
    short_description_en: "Turnkey industrial halls delivered ready for operation.",
    description_ar:
      "حلول متكاملة لتسليم قاعات صناعية جاهزة تشمل الهيكل والتكسية والإضاءة والفتحات، بما يلائم التصنيع أو التخزين أو الخدمات اللوجستية.",
    description_en:
      "Integrated delivery of ready industrial halls covering structure, cladding, lighting, and openings for manufacturing, storage, or logistics use.",
    image_url: "/gallery/18.jpeg",
    alt_text_ar: "قاعة صناعية جاهزة بهيكل صلب وألواح عازلة",
    alt_text_en: "Ready industrial hall with steel frame and insulated panels",
    icon: "check",
    category: "steel",
    is_featured: false,
  },
  {
    id: "sv9",
    title_ar: "طوابق الميزانين المعدنية",
    title_en: "Steel Mezzanine Floors",
    short_description_ar: "إضافة طوابق ميزانين لتعظيم المساحات التشغيلية.",
    short_description_en: "Mezzanine floors that maximise usable facility space.",
    description_ar:
      "تصميم وتنفيذ طوابق ميزانين معدنية داخل المنشآت لتعظيم مساحات التخزين والإنتاج دون توسعة المبنى الأفقي.",
    description_en:
      "Design and installation of steel mezzanine floors inside facilities to expand storage and production capacity without enlarging the building footprint.",
    image_url: "/services/mezzanine.svg",
    alt_text_ar: "رسم توضيحي لطابق ميزانين معدني",
    alt_text_en: "Illustration of a steel mezzanine floor",
    icon: "layers",
    category: "steel",
    is_featured: false,
  },
  {
    id: "sv10",
    title_ar: "أعمال السياج والحماية",
    title_en: "Fencing & Security Works",
    short_description_ar: "تركيب السياج والأسلاك الشائكة وأنظمة الحماية.",
    short_description_en: "Fence, barbed wire, and perimeter security installation.",
    description_ar:
      "تنفيذ أعمال تركيب السياج والأسلاك الشائكة وحواجز الحماية للمواقع الصناعية والمشاريع، وفق متطلبات السلامة وتأمين المحيط.",
    description_en:
      "Installation of fencing, barbed wire, and perimeter protection for industrial sites and projects, aligned with safety and security requirements.",
    image_url: "/services/fencing.svg",
    alt_text_ar: "رسم توضيحي لأعمال السياج والحماية",
    alt_text_en: "Illustration of fencing and security works",
    icon: "shield",
    category: "steel",
    is_featured: false,
  },
  {
    id: "sv11",
    title_ar: "درابزينات ألمنيوم",
    title_en: "Aluminum Handrails",
    short_description_ar: "تصنيع وتركيب درابزين ألمنيوم مقاوم للتآكل.",
    short_description_en: "Corrosion-resistant aluminum handrail systems.",
    description_ar:
      "تصنيع وتركيب أنظمة درابزين ألمنيوم للسلالم والشرفات والممرات، بمظهر حديث ومقاومة عالية للعوامل الجوية في بيئة الإمارات.",
    description_en:
      "Fabrication and installation of aluminum handrail systems for stairs, balconies, and walkways — modern look with strong weather resistance for UAE conditions.",
    image_url: "/services/aluminum-handrails.svg",
    alt_text_ar: "رسم توضيحي لدرابزين ألمنيوم",
    alt_text_en: "Illustration of an aluminum handrail system",
    icon: "rail",
    category: "aluminum",
    is_featured: true,
  },
  {
    id: "sv12",
    title_ar: "أبواب ونوافذ ألمنيوم",
    title_en: "Aluminum Doors & Windows",
    short_description_ar: "حلول أبواب ونوافذ ألمنيوم بعزل وأناقة عالية.",
    short_description_en: "Aluminum doors and windows with strong insulation and finish.",
    description_ar:
      "توريد وتركيب أبواب ونوافذ ألمنيوم بتصاميم معمارية دقيقة وعزل مناسب للمشاريع التجارية والسكنية والصناعية.",
    description_en:
      "Supply and installation of aluminum doors and windows with precise architectural detailing and suitable insulation for commercial, residential, and industrial projects.",
    image_url: "/services/aluminum-doors.svg",
    alt_text_ar: "رسم توضيحي لأبواب ونوافذ ألمنيوم",
    alt_text_en: "Illustration of aluminum doors and windows",
    icon: "door",
    category: "aluminum",
    is_featured: false,
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
  },
  {
    id: "cv3",
    title_ar: "الالتزام بالمواعيد",
    title_en: "On-Time Delivery",
    description_ar: "أنظمة إدارة مشاريع صارمة لضمان التسليم في الوقت.",
    description_en:
      "Rigorous project management for on-time delivery without compromising quality.",
    icon: "clock",
  },
  {
    id: "cv4",
    title_ar: "جودة بلا تنازل",
    title_en: "Uncompromising Quality",
    description_ar: "أحدث تقنيات التصنيع ومواد أولية ممتازة.",
    description_en: "Latest fabrication technologies and premium materials.",
    icon: "award",
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
  },
  {
    id: "tl2",
    year: "2020+",
    title_ar: "نمو المشاريع",
    title_en: "Project Growth",
    description_ar: "توسيع نطاق أعمال الصلب والألمنيوم عبر العين وأبوظبي.",
    description_en:
      "Expanded steel and aluminum delivery across Al Ain and Abu Dhabi.",
  },
  {
    id: "tl3",
    year: "Today",
    title_ar: "تميز مستمر",
    title_en: "Continuing Excellence",
    description_ar: "مواصلة رفع معايير الجودة والابتكار في الحلول المعدنية.",
    description_en:
      "Raising quality and innovation benchmarks in metal solutions.",
  },
];

export const galleryCategories: GalleryCategory[] = [
  {
    id: "cat-steel",
    name_ar: "هياكل صلب",
    name_en: "Steel Structures",
    slug: "steel-structures",
  },
  {
    id: "cat-interiors",
    name_ar: "منشآت داخلية",
    name_en: "Interiors",
    slug: "interiors",
  },
  {
    id: "cat-completed",
    name_ar: "مشاريع منفذة",
    name_en: "Completed Projects",
    slug: "completed",
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
    is_featured: [1, 2, 3, 5, 10, 20].includes(n),
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
  },
  {
    id: "email-2",
    label_ar: "المبيعات",
    label_en: "Sales",
    email: "sales@falcondesign.ae",
  },
  {
    id: "email-3",
    label_ar: "المشاريع",
    label_en: "Projects",
    email: "projects@falcondesign.ae",
  },
];

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
    is_featured: true,
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
    is_featured: true,
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
    is_featured: true,
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
    is_featured: false,
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
    is_featured: false,
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
    is_featured: false,
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
    is_featured: false,
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
    is_featured: false,
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
    is_featured: false,
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
    is_featured: false,
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
    is_featured: false,
  },
];
