-- Seed data for Falcon Design (demo / development)
-- Content derived from FalconDesign.pdf company profile.
-- After creating an Auth user in Supabase, insert them into admin_users:
--   insert into public.admin_users (user_id, email) values ('<auth-user-uuid>', 'admin@example.com');

truncate table
  public.contact_messages,
  public.contact_emails,
  public.contact_settings,
  public.gallery_items,
  public.gallery_categories,
  public.team_members,
  public.timeline_items,
  public.core_values,
  public.services,
  public.statistics,
  public.site_sections,
  public.site_pages,
  public.site_settings
cascade;

insert into public.site_settings (
  company_name_ar, company_name_en, tagline_ar, tagline_en,
  phone, whatsapp, address_ar, address_en
) values (
  'فالكون ديزاين',
  'Falcon Design',
  'حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي',
  'Where Proven Mastery Meets Structural Innovation',
  '+971 56 233 1020',
  '+971562331020',
  'العين، أبوظبي، الإمارات العربية المتحدة',
  'Al Ain, Abu Dhabi, United Arab Emirates'
);

insert into public.site_pages (
  slug, title_ar, title_en, show_in_navigation, sort_order, is_published,
  seo_title_ar, seo_title_en, seo_description_ar, seo_description_en,
  og_title_ar, og_title_en, og_description_ar, og_description_en, og_image
) values
(
  'home', 'الرئيسية', 'Home', true, 1, true,
  'فالكون ديزاين | أعمال الصلب والألمنيوم',
  'Falcon Design | Steel & Aluminum Works',
  'حلول متكاملة لأعمال الصلب والألمنيوم في العين وأبوظبي — مقاولات عامة.',
  'Integrated steel and aluminum solutions in Al Ain and Abu Dhabi — general contracting.',
  'فالكون ديزاين', 'Falcon Design',
  'خبرة هندسية وحلول إنشائية فاخرة.',
  'Engineering expertise with premium structural solutions.',
  '/gallery/01.jpeg'
),
(
  'about', 'من نحن', 'About', true, 2, true,
  'من نحن | فالكون ديزاين',
  'About Us | Falcon Design',
  'تعرف على رؤية ورسالة وفريق فالكون ديزاين.',
  'Learn about Falcon Design vision, mission, and team.',
  'من نحن', 'About Falcon Design',
  'تآزر بين الابتكار والخبرة الهندسية العميقة.',
  'Synergy between innovation and deep engineering expertise.',
  '/gallery/05.jpeg'
),
(
  'services', 'خدماتنا', 'Services', true, 3, true,
  'خدماتنا | فالكون ديزاين',
  'Our Services | Falcon Design',
  'حلول الصلب والألمنيوم المتخصصة للمشاريع الصناعية والمعمارية.',
  'Specialized steel and aluminum solutions for industrial and architectural projects.',
  'خدماتنا', 'Our Services',
  'من الهناجر إلى الأعمال المخصصة.',
  'From sheds and hangars to bespoke metalwork.',
  '/gallery/10.jpeg'
),
(
  'gallery', 'المشاريع', 'Gallery', true, 4, true,
  'معرض المشاريع | فالكون ديزاين',
  'Project Gallery | Falcon Design',
  'استعرض مشاريع فالكون ديزاين في الإنشاءات المعدنية.',
  'Explore Falcon Design steel and aluminum project portfolio.',
  'معرض المشاريع', 'Project Gallery',
  'أعمال منفذة بجودة عالية.',
  'Delivered projects with uncompromising quality.',
  '/gallery/01.jpeg'
),
(
  'contact', 'تواصل معنا', 'Contact', true, 5, true,
  'تواصل معنا | فالكون ديزاين',
  'Contact Us | Falcon Design',
  'تواصل مع فريق فالكون ديزاين في العين، أبوظبي.',
  'Get in touch with Falcon Design in Al Ain, Abu Dhabi.',
  'تواصل معنا', 'Contact Falcon Design',
  'نسعد بخدمتكم.',
  'We are ready to support your next project.',
  '/gallery/03.jpeg'
);

insert into public.site_sections (
  page_slug, section_key,
  title_ar, title_en, subtitle_ar, subtitle_en,
  description_ar, description_en,
  primary_button_ar, primary_button_en, primary_button_href,
  secondary_button_ar, secondary_button_en, secondary_button_href,
  image_url, alt_text_ar, alt_text_en
) values
(
  'home', 'hero',
  'حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي', 'Where Proven Mastery Meets Structural Innovation',
  'أعمال الصلب والألمنيوم — العين، أبوظبي', 'Steel & Aluminum Works — Al Ain, Abu Dhabi',
  'نمثل التآزر المثالي بين الابتكار الحديث وعقود من الخبرة الهندسية العميقة. نوفر حلولاً متكاملة تجمع القوة الإنشائية مع الدقة المعمارية.',
  'Falcon Design represents the perfect synergy between modern innovation and decades of deep-rooted engineering expertise. We deliver integrated steel and aluminum solutions with structural power and architectural precision.',
  'اطلب عرض سعر', 'Request a Quote', '/contact',
  'استعرض مشاريعنا', 'View Projects', '/gallery',
  '/gallery/10.jpeg',
  'صالة صناعية حديثة بإضاءة عالية وهيكل صلب',
  'Modern industrial hall with high-bay lighting and steel structure'
),
(
  'home', 'cta',
  'هل أنت مستعد لبدء مشروعك؟', 'Ready to start your project?',
  null, null,
  'دع فريقنا الهندسي يحوّل التحديات المعقدة إلى حلول دائمة تصمد أمام الزمن.',
  'Let our engineering team transform complex challenges into enduring solutions designed to stand the test of time.',
  'تواصل معنا', 'Contact Us', '/contact',
  null, null, null,
  null, null, null
),
(
  'about', 'introduction',
  'من نحن', 'About Us',
  'حيث تلتقي الخبرة المثبتة بالابتكار الإنشائي',
  'Where Proven Mastery Meets Structural Innovation',
  'فالكون ديزاين مزود رائد لحلول الصلب والألمنيوم المتكاملة، نقدم اندماجاً سلساً بين القوة الإنشائية والدقة المعمارية لمجموعة واسعة من القطاعات. رؤيتنا تتجاوز التنفيذ فحسب — نسعى لبناء شراكات مستدامة قائمة على الثقة والجودة بلا تنازل.',
  'Falcon Design is a premier provider of integrated steel and aluminum solutions, delivering a seamless fusion of structural power and architectural precision across industries. Our vision goes beyond execution — we forge sustainable partnerships built on trust and uncompromising quality.',
  null, null, null, null, null, null,
  '/gallery/05.jpeg',
  'داخل منشأة صناعية حديثة قيد الإنشاء',
  'Interior of a modern industrial facility under construction'
),
(
  'about', 'vision',
  'رؤيتنا', 'Our Vision',
  null, null,
  'أن نكون الجهة الرائدة والأكثر ثقة في حلول الصلب والألمنيوم، واضعين معايير جديدة للجودة والابتكار الهندسي الذي يدوم لأجيال.',
  'To be the leading and most trusted authority in steel and aluminum solutions, setting new benchmarks for quality and engineering innovation that lasts for generations.',
  null, null, null, null, null, null, null, null, null
),
(
  'about', 'mission',
  'رسالتنا', 'Our Mission',
  null, null,
  'تقديم حلول معدنية متكاملة تجمع بين المتانة الإنشائية والأناقة المعمارية، مستفيدين من خبرتنا العميقة وفريقنا المحترف لبناء معالم تدفع نجاح عملائنا وتجسد جوهر الشراكات المستدامة.',
  'To deliver integrated metal solutions that combine structural durability with architectural elegance, leveraging our deep expertise and professional team to build landmarks that drive our clients'' success and embody sustainable partnerships.',
  null, null, null, null, null, null, null, null, null
),
(
  'services', 'intro',
  'خدماتنا', 'Our Services',
  'القوة الهندسية خلف مشاريعكم',
  'The engineering power behind your projects',
  'نوفر حلولاً فولاذية تتميز بالقوة الفائقة والأمان المطلق، مع حلول ألمنيوم متخصصة تمزج الأناقة بالدقة التصنيعية.',
  'We provide steel solutions defined by superior strength and absolute security, plus specialized aluminum works that blend aesthetic elegance with manufacturing precision.',
  null, null, null, null, null, null, null, null, null
),
(
  'contact', 'intro',
  'تواصل معنا', 'Contact Us',
  null, null,
  'نحن هنا لدعم مشروعك القادم في العين وأبوظبي والإمارات.',
  'We are here to support your next project across Al Ain, Abu Dhabi, and the UAE.',
  null, null, null, null, null, null, null, null, null
);

insert into public.statistics (value, prefix, suffix, label_ar, label_en, sort_order, is_active) values
('2019', '', '', 'سنة التأسيس', 'Founded', 1, true),
('15', '', '+', 'سنوات خبرة ميدانية', 'Years Field Expertise', 2, true),
('100', '', '+', 'مشروع منجز', 'Projects Delivered', 3, true),
('2', '', '', 'تخصصات رئيسية', 'Core Disciplines', 4, true);

insert into public.services (
  title_ar, title_en, short_description_ar, short_description_en,
  description_ar, description_en, image_url, alt_text_ar, alt_text_en,
  icon, category, is_active, is_featured, is_published, sort_order
) values
(
  'الهناجر والمستودعات', 'Steel Sheds & Hangars',
  'تصميم وتنفيذ هناجر ومستودعات ومظلات واسعة بأعلى متانة إنشائية.',
  'Designing and executing industrial sheds, warehouses, and large-scale canopies.',
  'تصميم وتنفيذ الهناجر الصناعية والمستودعات والمظلات الكبيرة بأقصى درجات المتانة الإنشائية وفق المواصفات الفنية.',
  'Designing and executing industrial sheds, warehouses, and large-scale canopies with maximum structural durability.',
  '/gallery/01.jpeg', 'هناجر صلب قيد الإنشاء', 'Steel shed under construction',
  'warehouse', 'steel', true, true, true, 1
),
(
  'أبواب صلب وشبكات أمان', 'Steel Doors & Security Grills',
  'تصنيع أبواب صلب صناعية ومداخل مع حمايات نوافذ وأسوار.',
  'Industrial and entrance steel doors with window guards and fencing.',
  'تصنيع أبواب الصلب الصناعية وأبواب المداخل، إلى جانب حمايات النوافذ والأسوار لضمان أعلى مستويات الأمان.',
  'Fabrication of industrial and entrance steel doors, along with window guards and fencing for highest security levels.',
  '/gallery/08.jpeg', 'أعمال أبواب وشبكات صلب', 'Steel doors and security works',
  'shield', 'steel', true, true, true, 2
),
(
  'طوابق الميزانين', 'Mezzanine Floors',
  'تصميم ذكي لطوابق الميزانين لتعظيم مساحات التخزين والإنتاج.',
  'Intelligent mezzanine design to maximize storage and production space.',
  'تصميم وتنفيذ طوابق الميزانين لتعظيم المساحات التشغيلية داخل المنشآت بكفاءة هندسية عالية.',
  'Intelligent structural design of mezzanine levels to maximize storage and production space within facilities.',
  '/gallery/10.jpeg', 'منشأة صناعية داخلية', 'Industrial interior facility',
  'layers', 'steel', true, true, true, 3
),
(
  'أعمال الصلب الإنشائية والثانوية', 'Structural & Secondary Steelwork',
  'سلالم هروب، درابزينات، وجميع الأعمال المعدنية المخصصة.',
  'Fire escape stairs, handrails, and bespoke metalwork.',
  'تنفيذ سلالم الهروب ودرابزينات الصلب وكافة الأعمال المعدنية المخصصة وفق المواصفات الفنية.',
  'Execution of fire escape stairs, steel handrails, and all bespoke metalwork according to technical specifications.',
  '/gallery/06.jpeg', 'هيكل صلب إنشائي', 'Structural steel framework',
  'hammer', 'steel', true, true, true, 4
),
(
  'درابزينات ألمنيوم', 'Aluminum Handrails',
  'أنظمة درابزين حديثة للسلالم والشرفات مقاومة للتآكل.',
  'Modern handrail systems with superior anti-corrosive properties.',
  'تصنيع وتركيب أنظمة درابزين الألمنيوم الحديثة للسلالم والشرفات بخصائص مقاومة فائقة للتآكل.',
  'Fabrication and installation of modern aluminum handrail systems for stairs and balconies with superior anti-corrosive properties.',
  '/gallery/12.jpeg', 'درابزين ألمنيوم', 'Aluminum handrail system',
  'rail', 'aluminum', true, true, true, 5
),
(
  'أبواب ألمنيوم فاخرة', 'Premium Aluminum Doors',
  'حلول أبواب ألمنيوم عالية الجودة بعزل ممتاز وتصاميم مبتكرة.',
  'High-quality aluminum doors with innovative design and weather insulation.',
  'حلول أبواب ألمنيوم عالية الجودة بتصاميم مبتكرة وعزل استثنائي ضد العوامل الجوية.',
  'High-quality aluminum door solutions featuring innovative designs and exceptional weather insulation.',
  '/gallery/15.jpeg', 'أبواب ألمنيوم', 'Premium aluminum doors',
  'door', 'aluminum', true, false, true, 6
),
(
  'أعمال ألمنيوم مخصصة', 'Bespoke Aluminum Works',
  'حلول ألمنيوم حسب الطلب للمتطلبات المعمارية والزخرفية.',
  'Tailor-made aluminum solutions for decorative and architectural needs.',
  'حلول ألمنيوم مخصصة بدقة عالية للمتطلبات المعمارية والزخرفية الخاصة.',
  'Tailor-made aluminum solutions for decorative and specific architectural requirements.',
  '/gallery/18.jpeg', 'أعمال ألمنيوم مخصصة', 'Custom aluminum fabrication',
  'sparkles', 'aluminum', true, false, true, 7
);

insert into public.core_values (title_ar, title_en, description_ar, description_en, icon, sort_order, is_active) values
(
  'شراكات مستدامة', 'Sustainable Partnerships',
  'لا نبحث عن صفقات عابرة؛ نبني علاقات تمتد لسنوات بعد تسليم المشروع.',
  'We don’t just seek deals; we forge ongoing relationships that extend for years after delivery.',
  'handshake', 1, true
),
(
  'حلول متكاملة', 'Integrated Solutions',
  'نجمع أعمال الصلب الثقيل والألمنيوم المعماري في حل واحد سلس.',
  'We integrate heavy steelwork and architectural aluminum into one seamless solution.',
  'layers', 2, true
),
(
  'الالتزام بالمواعيد', 'On-Time Delivery',
  'نطبق أنظمة إدارة مشاريع صارمة لضمان التسليم في الوقت دون المساس بالجودة.',
  'Rigorous project management ensures on-time delivery without compromising quality.',
  'clock', 3, true
),
(
  'جودة بلا تنازل', 'Uncompromising Quality',
  'نستخدم أحدث تقنيات التصنيع ومواد أولية ممتازة لاستثمار طويل الأمد.',
  'Latest fabrication technologies and premium materials for long-term, time-resistant structures.',
  'award', 4, true
);

insert into public.timeline_items (year, title_ar, title_en, description_ar, description_en, sort_order, is_active) values
(
  '2019', 'انطلاق الشركة', 'Company Launch',
  'بدأت رحلتنا المؤسسية في عام 2019 على أساس عقود من الخبرة الميدانية والهندسية.',
  'Our corporate journey began in 2019 on a foundation of decades of field and engineering expertise.',
  1, true
),
(
  '2020+', 'نمو المشاريع', 'Project Growth',
  'توسيع نطاق أعمال الصلب والألمنيوم عبر العين وأبوظبي.',
  'Expanded steel and aluminum delivery across Al Ain and Abu Dhabi.',
  2, true
),
(
  'Today', 'تميز مستمر', 'Continuing Excellence',
  'مواصلة رفع معايير الجودة والابتكار في الحلول المعدنية.',
  'Continuing to raise quality and innovation benchmarks in metal solutions.',
  3, true
);

insert into public.team_members (
  name_ar, name_en, position_ar, position_en, bio_ar, bio_en,
  image_url, alt_text_ar, alt_text_en, sort_order, is_active
) values
(
  'فريق الهندسة', 'Engineering Team',
  'مهندسون وحرفيون متخصصون', 'Specialized Engineers & Craftsmen',
  'فريق نخبة من المهندسين والحرفيين ملتزم بتحويل التحديات المعقدة إلى واقع عالي الجودة.',
  'An elite team of engineers and craftsmen dedicated to transforming complex challenges into high-quality realities.',
  null, null, null, 1, true
);

insert into public.gallery_categories (id, name_ar, name_en, slug, sort_order, is_active) values
('11111111-1111-1111-1111-111111111101', 'هياكل صلب', 'Steel Structures', 'steel-structures', 1, true),
('11111111-1111-1111-1111-111111111102', 'منشآت داخلية', 'Interiors', 'interiors', 2, true),
('11111111-1111-1111-1111-111111111103', 'مشاريع منفذة', 'Completed Projects', 'completed', 3, true);

insert into public.gallery_items (
  category_id, title_ar, title_en, description_ar, description_en,
  image_url, alt_text_ar, alt_text_en, sort_order, is_featured, is_active, is_published
) values
('11111111-1111-1111-1111-111111111101', 'تركيب هيكل صلب', 'Steel Frame Erection', 'رفع وتركيب عوارض صلب بمعدات ثقيلة.', 'Crane-assisted steel beam erection on an industrial site.', '/gallery/01.jpeg', 'رافعات ترفع عوارض صلب', 'Cranes lifting steel beams', 1, true, true, true),
('11111111-1111-1111-1111-111111111101', 'هيكل صناعي', 'Industrial Framework', 'هيكل معدني لمشروع صناعي واسع.', 'Large-scale industrial steel framework.', '/gallery/02.jpeg', 'هيكل صناعي', 'Industrial steel framework', 2, true, true, true),
('11111111-1111-1111-1111-111111111101', 'أعمال موقع', 'Site Works', 'تنفيذ أعمال صلب في الموقع.', 'On-site steel fabrication and assembly.', '/gallery/03.jpeg', 'أعمال صلب في الموقع', 'On-site steel works', 3, true, true, true),
('11111111-1111-1111-1111-111111111101', 'تجميع إنشائي', 'Structural Assembly', 'تجميع عناصر إنشائية بدقة هندسية.', 'Precision structural assembly.', '/gallery/04.jpeg', 'تجميع إنشائي', 'Structural assembly', 4, false, true, true),
('11111111-1111-1111-1111-111111111102', 'داخل منشأة', 'Facility Interior', 'تشطيب داخلي بألواح عازلة وهيكل صلب.', 'Interior cladding with insulated panels and steel frame.', '/gallery/05.jpeg', 'داخل منشأة صناعية', 'Industrial facility interior', 5, true, true, true),
('11111111-1111-1111-1111-111111111102', 'سقف معدني', 'Metal Roof Structure', 'هيكل سقف معدني بارتفاعات كبيرة.', 'High-bay metal roof structure.', '/gallery/06.jpeg', 'سقف معدني', 'Metal roof structure', 6, false, true, true),
('11111111-1111-1111-1111-111111111102', 'مساحة تشغيلية', 'Operational Hall', 'قاعة تشغيلية واسعة جاهزة للتشغيل.', 'Wide operational hall ready for use.', '/gallery/07.jpeg', 'قاعة تشغيلية', 'Operational hall', 7, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 08', 'Completed Project 08', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/08.jpeg', 'مشروع منجز', 'Completed project', 8, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 09', 'Completed Project 09', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/09.jpeg', 'مشروع منجز', 'Completed project', 9, false, true, true),
('11111111-1111-1111-1111-111111111102', 'صالة مضاءة', 'Illuminated Hall', 'صالة صناعية بإضاءة صناعية حديثة.', 'Industrial hall with modern high-bay lighting.', '/gallery/10.jpeg', 'صالة صناعية مضاءة', 'Illuminated industrial hall', 10, true, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 11', 'Completed Project 11', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/11.jpeg', 'مشروع منجز', 'Completed project', 11, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 12', 'Completed Project 12', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/12.jpeg', 'مشروع منجز', 'Completed project', 12, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 13', 'Completed Project 13', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/13.jpeg', 'مشروع منجز', 'Completed project', 13, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 14', 'Completed Project 14', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/14.jpeg', 'مشروع منجز', 'Completed project', 14, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 15', 'Completed Project 15', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/15.jpeg', 'مشروع منجز', 'Completed project', 15, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 16', 'Completed Project 16', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/16.jpeg', 'مشروع منجز', 'Completed project', 16, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 17', 'Completed Project 17', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/17.jpeg', 'مشروع منجز', 'Completed project', 17, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 18', 'Completed Project 18', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/18.jpeg', 'مشروع منجز', 'Completed project', 18, false, true, true),
('11111111-1111-1111-1111-111111111103', 'مشروع منجز 19', 'Completed Project 19', 'أعمال صلب وألمنيوم منجزة.', 'Completed steel and aluminum works.', '/gallery/19.jpeg', 'مشروع منجز', 'Completed project', 19, false, true, true),
('11111111-1111-1111-1111-111111111103', 'كلية زايد العسكرية', 'Zayed Military College', 'أعمال منفذة ضمن مشاريع كلية زايد العسكرية.', 'Works delivered for Zayed Military College projects.', '/gallery/20.jpeg', 'مشروع كلية زايد العسكرية', 'Zayed Military College project', 20, true, true, true),
('11111111-1111-1111-1111-111111111103', 'كلية زايد العسكرية 21', 'Zayed Military College 21', 'أعمال منفذة ضمن مشاريع كلية زايد العسكرية.', 'Works delivered for Zayed Military College projects.', '/gallery/21.jpeg', 'مشروع كلية زايد العسكرية', 'Zayed Military College project', 21, false, true, true),
('11111111-1111-1111-1111-111111111103', 'كلية زايد العسكرية 22', 'Zayed Military College 22', 'أعمال منفذة ضمن مشاريع كلية زايد العسكرية.', 'Works delivered for Zayed Military College projects.', '/gallery/22.jpeg', 'مشروع كلية زايد العسكرية', 'Zayed Military College project', 22, false, true, true),
('11111111-1111-1111-1111-111111111103', 'كلية زايد العسكرية 23', 'Zayed Military College 23', 'أعمال منفذة ضمن مشاريع كلية زايد العسكرية.', 'Works delivered for Zayed Military College projects.', '/gallery/23.jpeg', 'مشروع كلية زايد العسكرية', 'Zayed Military College project', 23, false, true, true);

insert into public.contact_settings (
  page_title_ar, page_title_en, page_description_ar, page_description_en,
  company_name_ar, company_name_en, address_ar, address_en,
  phone, whatsapp, business_hours_ar, business_hours_en,
  latitude, longitude, google_maps_url
) values (
  'تواصل معنا', 'Contact Us',
  'راسلنا لمناقشة مشروعك القادم في أعمال الصلب والألمنيوم.',
  'Reach out to discuss your next steel and aluminum project.',
  'فالكون ديزاين للمقاولات العامة — مؤسسة فردية',
  'Falcon Design General Contracting — Sole Proprietorship',
  'العين، أبوظبي، الإمارات العربية المتحدة',
  'Al Ain, Abu Dhabi, United Arab Emirates',
  '+971 56 233 1020',
  '+971562331020',
  'الأحد – الخميس: 8:00 ص – 6:00 م',
  'Sunday – Thursday: 8:00 AM – 6:00 PM',
  24.2075000,
  55.7447000,
  'https://maps.google.com/?q=Al+Ain+Abu+Dhabi+UAE'
);

insert into public.contact_emails (label_ar, label_en, email, is_active, sort_order) values
('عام', 'General', 'falcondesign20@gmail.com', true, 1),
('المبيعات', 'Sales', 'EMAIL_2', true, 2),
('المشاريع', 'Projects', 'EMAIL_3', true, 3),
('الدعم', 'Support', 'EMAIL_4', true, 4),
('الإدارة', 'Management', 'EMAIL_5', true, 5);
