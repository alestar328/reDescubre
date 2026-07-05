export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  bio?: string;
  location: string;
  city: string;
  country: string;
  website: string;
  avatarPath?: string;
  coverImagePath?: string;
  // Sistema de valoración — las reviews se guardarán en Supabase (tabla provider_reviews)
  // rating = promedio de stars (1-5), reviewCount = total de valoraciones recibidas
  rating: number;
  reviewCount: number;
}

export interface ActivitySchedule {
  weekday: string;
  startTime: string;
  endTime: string;
  isFlexible?: boolean;  // true = rango en el que el cliente elige su hora; false = sesión de hora fija
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  whyThisActivity: string;
  categoryId: string;
  providerId: string;
  price: number | null;
  priceType: "free" | "paid";
  priceLabel: string;
  bookingUrl?: string;  // enlace externo de reservas si el proveedor gestiona la asistencia (Booksy, etc.)
  durationMin: number;
  minAge: number;
  maxAge: number;
  location: string;
  neighborhood: string;
  city: string;
  country: string;
  schedules: ActivitySchedule[];
  imageColor: string;
  imagePath: string;
  images?: string[];   // todas las imágenes de la actividad (carrusel); imagePath = la principal
  isPublished?: boolean;
  isMock?: boolean;    // DEMO-MOCK: true = actividad hardcodeada solo para presentación
}

export interface AgendaItem {
  id: string;
  activityId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "planned" | "confirmed" | "attended";
}

export const categories: Category[] = [
  {
    id: "exterior",
    slug: "exterior",
    name: "Exterior",
    icon: "TreePine",
    color: "#22C55E",
    bgColor: "#dcfce7",
    textColor: "#15803d",
  },
  {
    id: "playa",
    slug: "playa",
    name: "Playa",
    icon: "Waves",
    color: "#0EA5E9",
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
  },
  {
    id: "artistica",
    slug: "artistica",
    name: "Artística",
    icon: "Palette",
    color: "#A855F7",
    bgColor: "#f3e8ff",
    textColor: "#7e22ce",
  },
  {
    id: "social",
    slug: "social",
    name: "Social",
    icon: "Users",
    color: "#F59E0B",
    bgColor: "#fef3c7",
    textColor: "#92400e",
  },
  {
    id: "aprendizaje",
    slug: "aprendizaje",
    name: "Aprendizaje",
    icon: "GraduationCap",
    color: "#FF5C35",
    bgColor: "#ffede8",
    textColor: "#c2410c",
  },
  {
    id: "deporte",
    slug: "deporte",
    name: "Deporte",
    icon: "Dumbbell",
    color: "#EF4444",
    bgColor: "#fee2e2",
    textColor: "#b91c1c",
  },
];

export const providers: Provider[] = [
  {
    id: "p1",
    name: "Paddle Barcelona",
    description: "Centro de deportes acuáticos en la Barceloneta con instructores certificados.",
    bio: "Llevamos más de 10 años enseñando paddle surf y kayak en la Barceloneta. Nuestros instructores están certificados por la Federación Española de Piragüismo.",
    location: "Barceloneta Beach, s/n",
    city: "Barcelona",
    country: "España",
    website: "https://paddlebarcelona.com",
    rating: 4.8,
    reviewCount: 34,
  },
  {
    id: "p2",
    name: "Taller Gràcia Arts",
    description: "Espacio creativo en el barrio de Gràcia con talleres de arte para todas las edades.",
    location: "Carrer de la Providència, 42",
    city: "Barcelona",
    country: "España",
    website: "https://graciaarts.com",
    rating: 4.6,
    reviewCount: 21,
  },
  {
    id: "p3",
    name: "English Corner BCN",
    description: "Academia de idiomas con enfoque en conversación y cultura anglófona.",
    location: "Carrer d'Enric Granados, 18",
    city: "Barcelona",
    country: "España",
    website: "https://englishcornerbcn.com",
    rating: 4.9,
    reviewCount: 47,
  },
  {
    id: "p4",
    name: "FabLab Poblenou",
    description: "Laboratorio de fabricación digital y tecnología creativa en el 22@.",
    location: "Carrer de Pallars, 193",
    city: "Barcelona",
    country: "España",
    website: "https://fablabpoblenou.com",
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: "p5",
    name: "Playa Sport Club",
    description: "Club deportivo de playa con actividades gratuitas para jóvenes.",
    location: "Platja de la Barceloneta",
    city: "Barcelona",
    country: "España",
    website: "https://playasportclub.com",
    rating: 4.5,
    reviewCount: 62,
  },
  {
    id: "p6",
    name: "Rocódromo Sant Martí",
    description: "Centro de escalada indoor con rutas para todos los niveles.",
    location: "Carrer de Tànger, 98",
    city: "Barcelona",
    country: "España",
    website: "https://rocodromosantmarti.com",
    rating: 4.4,
    reviewCount: 29,
  },
  {
    id: "p7",
    name: "Lente Urbana",
    description: "Colectivo de fotografía urbana que explora Barcelona con ojos nuevos.",
    location: "Plaça dels Àngels, 1",
    city: "Barcelona",
    country: "España",
    website: "https://lenteurbana.cat",
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "p8",
    name: "Aventura Náutica BCN",
    description: "Empresa de deportes náuticos en el Port Olímpic de Barcelona.",
    location: "Moll de Mestral, Port Olímpic",
    city: "Barcelona",
    country: "España",
    website: "https://aventuraNautica.com",
    rating: 4.7,
    reviewCount: 38,
  },
  {
    id: "p9",
    name: "Teatre Jove Gràcia",
    description: "Compañía de teatro juvenil que fomenta la expresión y la creatividad.",
    location: "Carrer de Verdi, 150",
    city: "Barcelona",
    country: "España",
    website: "https://teatrejovegracia.com",
    rating: 4.9,
    reviewCount: 11,
  },
  {
    id: "p10",
    name: "Huertos Comunitarios Horta",
    description: "Red de huertos urbanos comunitarios en el barrio de Horta.",
    location: "Carrer de Feliu i Codina, 20",
    city: "Barcelona",
    country: "España",
    website: "https://huertoshorta.com",
    rating: 4.3,
    reviewCount: 8,
  },
  {
    id: "p11",
    name: "Studio 22 Music",
    description: "Estudio de música y producción electrónica en el corazón del 22@.",
    location: "Carrer de Roc Boronat, 117",
    city: "Barcelona",
    country: "España",
    website: "https://studio22music.com",
    rating: 4.6,
    reviewCount: 22,
  },
  {
    id: "p12",
    name: "Running Joves BCN",
    description: "Club de running juvenil que entrena en el Parque de la Ciutadella.",
    location: "Passeig de Pujades, 1",
    city: "Barcelona",
    country: "España",
    website: "https://runningjovesbcn.com",
    rating: 4.5,
    reviewCount: 41,
  },
  {
    id: "p13",
    name: "Surf Costa Verde",
    description: "Escuela de surf en la Costa Verde de Lima, con instructores locales certificados y tablas para todos los niveles.",
    location: "Playa La Pampilla, Costa Verde",
    city: "Lima",
    country: "Perú",
    website: "https://surfcostaverde.pe",
    rating: 4.9,
    reviewCount: 57,
  },
  {
    id: "p14",
    name: "Terrissa Barcelona",
    description: "Taller de cerámica artesanal en el Poblenou con hornos propios y materiales de calidad.",
    location: "Carrer de Pallars, 85",
    city: "Barcelona",
    country: "España",
    website: "https://terrissabcn.com",
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: "p15",
    name: "Escuela de Baile Ritmo Latino",
    description: "Escuela de baile especializada en ritmos latinos: bachata, salsa y merengue para todos los niveles.",
    location: "Carrer del Consell de Cent, 255",
    city: "Barcelona",
    country: "España",
    website: "https://ritmolatinobarcelona.com",
    rating: 4.8,
    reviewCount: 33,
  },
  {
    id: "p16",
    name: "Salsa al Parque",
    description: "Colectivo de bailarines que organiza clases y sesiones abiertas de salsa en los parques de Barcelona.",
    location: "Passeig de Pujades, 1 (Parc de la Ciutadella)",
    city: "Barcelona",
    country: "España",
    website: "https://salsaalparque.cat",
    rating: 4.4,
    reviewCount: 26,
  },
  {
    id: "p17",
    name: "Asociación Gatos BCN",
    description: "Asociación de protección animal dedicada al rescate, acogida y adopción de gatos callejeros en Barcelona.",
    location: "Carrer del Parlament, 37",
    city: "Barcelona",
    country: "España",
    website: "https://gatosbcn.org",
    rating: 5.0,
    reviewCount: 44,
  },
];

export const activities: Activity[] = [
  {
    id: "act1",
    title: "Paddle Surf Iniciación",
    description:
      "Aprende a mantener el equilibrio sobre la tabla mientras disfrutas del mar Mediterráneo. Clases en grupos reducidos con instructor certificado. Material incluido.",
    whyThisActivity:
      "El paddle surf combina equilibrio, coordinación y fuerza de manera suave y progresiva. Practicarlo en el mar desarrolla la concentración y reduce el estrés — es imposible mirar el móvil cuando estás de pie sobre el agua.",
    categoryId: "playa",
    providerId: "p1",
    price: 15,
    priceType: "paid",
    priceLabel: "€15/sesión",
    durationMin: 90,
    minAge: 12,
    maxAge: 25,
    location: "Barceloneta Beach, s/n",
    neighborhood: "Barceloneta",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Lunes", startTime: "09:00", endTime: "10:30" },
      { weekday: "Lunes", startTime: "15:00", endTime: "16:30" },
      { weekday: "Miércoles", startTime: "09:00", endTime: "10:30" },
      { weekday: "Sábado", startTime: "10:00", endTime: "11:30" },
    ],
    imageColor: "#0EA5E9",
    imagePath: "/img/paddelSurf_cover.jpg",
  },
  {
    id: "act2",
    title: "Taller de Ilustración",
    description:
      "Descubre tu estilo propio en un taller de ilustración con técnicas de acuarela, tinta y digital. Para principiantes y niveles intermedios. Todo el material incluido.",
    whyThisActivity:
      "La ilustración desarrolla la paciencia, la atención al detalle y la autoexpresión. Crear con las manos es un antídoto directo al consumo pasivo de contenido digital — pasas de ser espectador a ser autor.",
    categoryId: "artistica",
    providerId: "p2",
    price: 20,
    priceType: "paid",
    priceLabel: "€20/sesión",
    durationMin: 120,
    minAge: 13,
    maxAge: 25,
    location: "Carrer de la Providència, 42",
    neighborhood: "Gràcia",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Martes", startTime: "17:00", endTime: "19:00" },
      { weekday: "Jueves", startTime: "17:00", endTime: "19:00" },
      { weekday: "Sábado", startTime: "11:00", endTime: "13:00" },
    ],
    imageColor: "#A855F7",
    imagePath: "/img/ilustracion_cover.jpg",
  },
  {
    id: "act3",
    title: "Inglés Conversacional",
    description:
      "Mejora tu inglés hablando de temas reales: música, cultura, viajes y actualidad. Grupos de máximo 8 personas. Nivel B1-B2. Native speakers como instructores.",
    whyThisActivity:
      "El inglés conversacional en grupos pequeños elimina el miedo a hablar que genera la enseñanza tradicional. Practicar con nativos desarrolla la escucha activa y la comunicación genuina — habilidades clave para la vida real.",
    categoryId: "aprendizaje",
    providerId: "p3",
    price: 12,
    priceType: "paid",
    priceLabel: "€12/sesión",
    durationMin: 60,
    minAge: 14,
    maxAge: 25,
    location: "Carrer d'Enric Granados, 18",
    neighborhood: "Eixample",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Lunes", startTime: "10:00", endTime: "11:00" },
      { weekday: "Jueves", startTime: "10:00", endTime: "11:00" },
      { weekday: "Sábado", startTime: "12:00", endTime: "13:00" },
    ],
    imageColor: "#FF5C35",
    imagePath: "/img/ingles_cover.jpeg",
  },
  {
    id: "act4",
    title: "Robótica y Drones",
    description:
      "Construye y programa robots y drones desde cero. Aprende programación visual y Python en un entorno maker. Proyectos reales que te puedes llevar a casa.",
    whyThisActivity:
      "La robótica transforma la relación con la tecnología: de consumidor pasivo a creador activo. Programar un robot que tú mismo construiste desarrolla la lógica, la persistencia ante el error y la satisfacción del trabajo propio.",
    categoryId: "aprendizaje",
    providerId: "p4",
    price: 25,
    priceType: "paid",
    priceLabel: "€25/sesión",
    durationMin: 180,
    minAge: 12,
    maxAge: 20,
    location: "Carrer de Pallars, 193",
    neighborhood: "Poblenou",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Martes", startTime: "09:00", endTime: "12:00" },
      { weekday: "Viernes", startTime: "16:00", endTime: "19:00" },
    ],
    imageColor: "#FF5C35",
    imagePath: "/img/robotica_cover.jpeg",
  },
  {
    id: "act5",
    title: "Vóley Playa",
    description:
      "Únete a partidos de vóley playa en la Barceloneta. Grupos mixtos, todos los niveles. Solo necesitas ganas — el resto lo ponemos nosotros.",
    whyThisActivity:
      "El vóley playa es una de las actividades sociales más completas: exige comunicación constante entre compañeros, toma de decisiones rápida y trabajo en equipo. Además, hacerlo en la playa añade un plus de desconexión total.",
    categoryId: "playa",
    providerId: "p5",
    price: null,
    priceType: "free",
    priceLabel: "Gratis",
    durationMin: 120,
    minAge: 14,
    maxAge: 25,
    location: "Platja de la Barceloneta",
    neighborhood: "Barceloneta",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Miércoles", startTime: "18:00", endTime: "20:00" },
      { weekday: "Sábado", startTime: "16:00", endTime: "18:00" },
      { weekday: "Domingo", startTime: "11:00", endTime: "13:00" },
    ],
    imageColor: "#0EA5E9",
    imagePath: "/img/voley_cover.jpeg",
  },
  {
    id: "act6",
    title: "Escalada en Rocódromo",
    description:
      "Aprende técnicas de escalada en un rocódromo seguro y equipado. Rutas para todos los niveles. Instructor presente en todo momento. Material incluido.",
    whyThisActivity:
      "La escalada es meditación activa: cada vía es un problema que resolver con mente y cuerpo. Exige concentración total, gestión del miedo y confianza en uno mismo — exactamente lo contrario a la gratificación instantánea de las pantallas.",
    categoryId: "deporte",
    providerId: "p6",
    price: 18,
    priceType: "paid",
    priceLabel: "€18/sesión",
    durationMin: 90,
    minAge: 12,
    maxAge: 25,
    location: "Carrer de Tànger, 98",
    neighborhood: "Sant Martí",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Lunes", startTime: "17:00", endTime: "18:30" },
      { weekday: "Miércoles", startTime: "17:00", endTime: "18:30" },
      { weekday: "Sábado", startTime: "10:00", endTime: "11:30" },
    ],
    imageColor: "#EF4444",
    imagePath: "/img/rocodromo_cover.jpg",
  },
  {
    id: "act7",
    title: "Fotografía Urbana",
    description:
      "Explora Barcelona con una cámara en mano. Aprende composición, luz y narrativa visual mientras descubres rincones únicos de la ciudad. Cámara de móvil suficiente.",
    whyThisActivity:
      "La fotografía entrena la mirada: aprendes a observar el mundo en lugar de consumirlo. Es paradójico pero cierto — usar el móvil para fotografiar te hace más presente que usarlo para el scroll infinito.",
    categoryId: "artistica",
    providerId: "p7",
    price: 15,
    priceType: "paid",
    priceLabel: "€15/sesión",
    durationMin: 150,
    minAge: 14,
    maxAge: 25,
    location: "Plaça dels Àngels, 1",
    neighborhood: "Raval",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Viernes", startTime: "10:00", endTime: "12:30" },
      { weekday: "Domingo", startTime: "10:00", endTime: "12:30" },
    ],
    imageColor: "#A855F7",
    imagePath: "/img/fotografia_cover.jpg",
  },
  {
    id: "act8",
    title: "Kayak en el Puerto",
    description:
      "Explora el Port Olímpic y la costa barcelonesa en kayak. Sesiones en pareja o individual. Sin experiencia previa necesaria. Chaleco y remo incluidos.",
    whyThisActivity:
      "Remar exige ritmo, respiración y presencia total — no puedes pensar en TikTok cuando gestionas un kayak en el mar. Además, ver Barcelona desde el agua ofrece una perspectiva completamente nueva de la ciudad donde vives.",
    categoryId: "exterior",
    providerId: "p8",
    price: 22,
    priceType: "paid",
    priceLabel: "€22/sesión",
    durationMin: 120,
    minAge: 14,
    maxAge: 25,
    location: "Moll de Mestral, Port Olímpic",
    neighborhood: "Port Olímpic",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Martes", startTime: "10:00", endTime: "12:00" },
      { weekday: "Jueves", startTime: "10:00", endTime: "12:00" },
      { weekday: "Sábado", startTime: "10:00", endTime: "12:00" },
    ],
    imageColor: "#22C55E",
    imagePath: "/img/kayak_cover.jpg",
  },
  {
    id: "act9",
    title: "Teatro Joven",
    description:
      "Improvisación, texto y expresión corporal en un ambiente seguro y sin juicios. Para jóvenes que quieren explorar la actuación o simplemente perder la vergüenza.",
    whyThisActivity:
      "El teatro desarrolla empatía, escucha activa y presencia en el momento — todo lo que las pantallas erosionan. Ponerse en el lugar de otro personaje es uno de los ejercicios más poderosos de inteligencia emocional que existen.",
    categoryId: "social",
    providerId: "p9",
    price: 10,
    priceType: "paid",
    priceLabel: "€10/sesión",
    durationMin: 90,
    minAge: 12,
    maxAge: 22,
    location: "Carrer de Verdi, 150",
    neighborhood: "Gràcia",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Jueves", startTime: "16:00", endTime: "17:30" },
      { weekday: "Sábado", startTime: "11:00", endTime: "12:30" },
    ],
    imageColor: "#F59E0B",
    imagePath: "/img/teatro_cover.jpg",
  },
  {
    id: "act10",
    title: "Huerto Urbano",
    description:
      "Aprende a cultivar tus propias plantas y verduras en un huerto comunitario. Técnicas de compostaje, riego y cuidado de plantas. Grupo pequeño, ritmo tranquilo.",
    whyThisActivity:
      "Trabajar la tierra es el antídoto más antiguo al agotamiento mental. Ver crecer algo que tú has plantado — con paciencia, cuidado y sin atajos — es una lección de vida que ninguna app puede dar.",
    categoryId: "exterior",
    providerId: "p10",
    price: null,
    priceType: "free",
    priceLabel: "Gratis",
    durationMin: 60,
    minAge: 12,
    maxAge: 25,
    location: "Carrer de Feliu i Codina, 20",
    neighborhood: "Horta",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Miércoles", startTime: "16:00", endTime: "17:00" },
      { weekday: "Sábado", startTime: "10:00", endTime: "11:00" },
    ],
    imageColor: "#22C55E",
    imagePath: "/img/huerto_cover.jpg",
  },
  {
    id: "act11",
    title: "DJ y Producción Musical",
    description:
      "Aprende a mezclar música y producir tus propios beats desde cero. Software profesional, equipo de estudio y un ambiente creativo en el Poblenou.",
    whyThisActivity:
      "La producción musical convierte la escucha pasiva de música en creación activa. Entender cómo se construye un tema cambia para siempre tu relación con el sonido — y con la tecnología, que pasa a ser tu herramienta, no tu distracción.",
    categoryId: "artistica",
    providerId: "p11",
    price: 30,
    priceType: "paid",
    priceLabel: "€30/sesión",
    durationMin: 120,
    minAge: 14,
    maxAge: 25,
    location: "Carrer de Roc Boronat, 117",
    neighborhood: "Poblenou",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Martes", startTime: "17:00", endTime: "19:00" },
      { weekday: "Viernes", startTime: "17:00", endTime: "19:00" },
    ],
    imageColor: "#A855F7",
    imagePath: "/img/dj_cover.avif",
  },
  {
    id: "act12",
    title: "Running Club Joven",
    description:
      "Corre por el Parque de la Ciutadella con otros jóvenes. Ritmos adaptados para principiantes y niveles intermedios. Sesión con calentamiento y estiramientos incluidos.",
    whyThisActivity:
      "Correr en grupo elimina la barrera de motivación que el ejercicio individual tiene. El running libera endorfinas, mejora el sueño y reduce la ansiedad — todo lo que el uso excesivo de pantallas deteriora gradualmente.",
    categoryId: "deporte",
    providerId: "p12",
    price: null,
    priceType: "free",
    priceLabel: "Gratis",
    durationMin: 60,
    minAge: 14,
    maxAge: 25,
    location: "Passeig de Pujades, 1 (entrada Ciutadella)",
    neighborhood: "Ciutadella",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Lunes", startTime: "07:30", endTime: "08:30" },
      { weekday: "Miércoles", startTime: "07:30", endTime: "08:30" },
      { weekday: "Viernes", startTime: "07:30", endTime: "08:30" },
      { weekday: "Domingo", startTime: "09:00", endTime: "10:00" },
    ],
    imageColor: "#EF4444",
    imagePath: "/img/running_cover.jpg",
  },
  {
    id: "act13",
    title: "Surf Costa Verde",
    description:
      "Aprende a surfear en las olas del Pacífico en la playa de la Costa Verde. Clases para principiantes y nivel intermedio con instructores certificados. Tabla y traje incluidos.",
    whyThisActivity:
      "Surfear es pura presencia: no hay pantallas que valgan cuando una ola se acerca. El surf desarrolla el equilibrio, la lectura del entorno natural y una conexión profunda con el océano que ningún videojuego puede replicar.",
    categoryId: "playa",
    providerId: "p13",
    price: 35,
    priceType: "paid",
    priceLabel: "S/35/sesión",
    durationMin: 120,
    minAge: 12,
    maxAge: 25,
    location: "Playa La Pampilla, Costa Verde",
    neighborhood: "Costa Verde",
    city: "Lima",
    country: "Perú",
    schedules: [
      { weekday: "Sábado", startTime: "07:00", endTime: "09:00" },
      { weekday: "Domingo", startTime: "07:00", endTime: "09:00" },
    ],
    imageColor: "#0EA5E9",
    imagePath: "/img/surfLima_cover.jpg",
  },
  {
    id: "act14",
    title: "Taller de Cerámica",
    description:
      "Aprende a modelar arcilla con tus manos: desde el centrado en el torno hasta el acabado y esmaltado. Grupos reducidos, horno propio. Todas las piezas son tuyas.",
    whyThisActivity:
      "La cerámica exige paciencia, tacto y presencia absoluta — con las manos llenas de arcilla no hay forma de mirar el móvil. Crear algo tridimensional que puedes tocar y usar es una de las experiencias más satisfactorias que existen.",
    categoryId: "artistica",
    providerId: "p14",
    price: 22,
    priceType: "paid",
    priceLabel: "€22/sesión",
    durationMin: 120,
    minAge: 13,
    maxAge: 25,
    location: "Carrer de Pallars, 85",
    neighborhood: "Poblenou",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Martes", startTime: "18:00", endTime: "20:00" },
      { weekday: "Jueves", startTime: "18:00", endTime: "20:00" },
      { weekday: "Sábado", startTime: "10:00", endTime: "12:00" },
    ],
    imageColor: "#A855F7",
    imagePath: "/img/cercamica_cover.jpg",
  },
  {
    id: "act15",
    title: "Taller de Bachata",
    description:
      "Aprende bachata desde cero o mejora tu técnica en una escuela de baile profesional. Clases en pareja o individual, música en vivo algunos viernes. Ambiente joven y sin juicios.",
    whyThisActivity:
      "Bailar bachata desarrolla la escucha activa, la coordinación y la conexión con otra persona — todo lo contrario a la interacción digital. El contacto humano genuino y el ritmo son un antídoto natural contra la sobrexposición a pantallas.",
    categoryId: "social",
    providerId: "p15",
    price: 10,
    priceType: "paid",
    priceLabel: "€10/sesión",
    durationMin: 60,
    minAge: 14,
    maxAge: 25,
    location: "Carrer del Consell de Cent, 255",
    neighborhood: "Eixample",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Lunes", startTime: "19:00", endTime: "20:00" },
      { weekday: "Miércoles", startTime: "19:00", endTime: "20:00" },
      { weekday: "Viernes", startTime: "20:00", endTime: "21:00" },
    ],
    imageColor: "#F59E0B",
    imagePath: "/img/bachata_cover.jpg",
  },
  {
    id: "act16",
    title: "Salsa en la Ciutadella",
    description:
      "Sesión abierta de salsa en el Parc de la Ciutadella. Nivel principiante y medio. Música en directo los domingos. Solo tienes que aparecer — el resto lo ponemos nosotros.",
    whyThisActivity:
      "Bailar en un parque con desconocidos rompe barreras sociales de una manera que ninguna red social puede replicar. La salsa es comunicación pura: escuchas el ritmo, lees a tu pareja y te mueves juntos sin mediar palabras.",
    categoryId: "social",
    providerId: "p16",
    price: null,
    priceType: "free",
    priceLabel: "Gratis",
    durationMin: 90,
    minAge: 12,
    maxAge: 25,
    location: "Passeig de Pujades, 1 (Parc de la Ciutadella)",
    neighborhood: "Ciutadella",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Sábado", startTime: "18:00", endTime: "19:30" },
      { weekday: "Domingo", startTime: "17:00", endTime: "18:30" },
    ],
    imageColor: "#F59E0B",
    imagePath: "/img/salsa_cover.jpg",
  },
  {
    id: "act17",
    title: "Voluntariado: Cuida un Gatito",
    description:
      "Ayuda en la asociación Gatos BCN: socialización de gatitos rescatados, limpieza de espacios, preparación de adopciones y acompañamiento en jornadas de acogida. Sin experiencia previa necesaria.",
    whyThisActivity:
      "Cuidar animales desarrolla la empatía, la responsabilidad y la calma — cualidades que el scroll infinito erosiona. Estar con gatos reduce el cortisol de forma medida y proporciona una conexión emocional real que ninguna pantalla puede dar.",
    categoryId: "social",
    providerId: "p17",
    price: null,
    priceType: "free",
    priceLabel: "Gratis",
    durationMin: 120,
    minAge: 13,
    maxAge: 25,
    location: "Carrer del Parlament, 37",
    neighborhood: "Sant Antoni",
    city: "Barcelona",
    country: "España",
    schedules: [
      { weekday: "Sábado", startTime: "10:00", endTime: "12:00" },
      { weekday: "Domingo", startTime: "10:00", endTime: "12:00" },
    ],
    imageColor: "#22C55E",
    imagePath: "/img/voluntarioGato_cover.jpg",
  },
];

export const mockAgendaItems: AgendaItem[] = [
  // Semana del 19-25 mayo 2025 (semana de demo)
  // Lunes 19
  { id: "ag1", activityId: "act3", date: "2026-05-25", startTime: "10:00", endTime: "11:00", status: "confirmed" },
  { id: "ag2", activityId: "act1", date: "2026-05-25", startTime: "15:00", endTime: "16:30", status: "confirmed" },
  // Martes 26
  { id: "ag3", activityId: "act4", date: "2026-05-26", startTime: "09:00", endTime: "12:00", status: "confirmed" },
  // Miércoles 27
  { id: "ag4", activityId: "act6", date: "2026-05-27", startTime: "17:00", endTime: "18:30", status: "planned" },
  // Jueves 28
  { id: "ag5", activityId: "act3", date: "2026-05-28", startTime: "10:00", endTime: "11:00", status: "confirmed" },
  { id: "ag6", activityId: "act9", date: "2026-05-28", startTime: "16:00", endTime: "17:30", status: "planned" },
  // Viernes 29
  { id: "ag7", activityId: "act7", date: "2026-05-29", startTime: "10:00", endTime: "12:30", status: "planned" },
  // Sábado 30
  { id: "ag8", activityId: "act8", date: "2026-05-30", startTime: "10:00", endTime: "12:00", status: "confirmed" },
  { id: "ag9", activityId: "act5", date: "2026-05-30", startTime: "16:00", endTime: "18:00", status: "planned" },
  // Domingo 31 — vacío
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getActivityById(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getAgendaForWeek(weekStart: Date): AgendaItem[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return mockAgendaItems.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= weekStart && itemDate <= weekEnd;
  });
}
