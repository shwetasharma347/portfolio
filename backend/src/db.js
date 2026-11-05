import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial seed data matching frontend data
const initialData = {
  products: [
    {
      id: "aero-glide-pro",
      name: "Aero Glide Pro",
      tagline: "Performance Running",
      price: 145.0,
      category: "men",
      rating: 4.9,
      reviewCount: 342,
      badge: "#1 Best Seller",
      badgeColor: "bg-[#e06c4f]",
      isBestSeller: true,
      isTrending: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC95F61-pL2pv7kiJuyGV3Wx5dJhaks25BlnubBgRaYveHhJz5hYs3cfsxY4wROSJaJZws1vap_jddsp1QLRHJiBE8tREhlekvNcfEX5ApEx9lRYR-OpRJm95VQM-bqEh6C93uVDI3iGbf9XUuJXRoiI2hSgZgiySigCoK0oQk640JVDe3XAZlzHM2TRgdaQTB_JqJhaeZiAFdiErKRs0HiXt-TPY0kGRsgsBIU9X4NsYaDiMRbm18",
      description: "A clean, minimalist studio running shoe floating gently over a pale neomorphic pedestal. Crisp white and cool indigo tones with hyper-cushioned sole.",
      sizes: [8, 9, 10, 11, 12, 13],
      color: "Cloud White / Indigo"
    },
    {
      id: "silk-aeris-pro",
      name: "Silk Aeris Pro",
      tagline: "Everyday Luxury",
      price: 145.0,
      category: "men",
      rating: 4.8,
      reviewCount: 128,
      badge: "NEW RELEASE",
      badgeColor: "bg-tertiary text-white",
      isBestSeller: true,
      isTrending: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuju4LiRM5ZCw4G1DqW3-nEULYzLQEgmSLHOdfhxPRMiYChmT6t3t8-ypwdAoxZbOqCXRhEvL4tyWCXjDiRRTCcI4wB9-iKjsBrp7X44fyS8PEBBTlePE3Q8yPmZwH05DiGGbExQBLHV-KDTjVdNRc2Xexua37h3jHFenbl9kw5dRRe6UvuOFzZPsnvoPz_Y_buxDVzsOlOdvdLXicFaI3kURdwz-LIPKhisYI_pA6skpheVWXlFI",
      description: "The ultimate everyday sneaker. Engineered with a responsive neomorphic foam midsole for unparalleled all-day comfort.",
      sizes: [8, 9, 10, 11, 12],
      color: "Stone Indigo"
    },
    {
      id: "strider-xt",
      name: "Strider XT",
      tagline: "Performance Runner",
      price: 130.0,
      category: "men",
      rating: 4.7,
      reviewCount: 94,
      badge: "POPULAR",
      badgeColor: "bg-primary text-white",
      isBestSeller: true,
      isTrending: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKYZlFPtTMscmBDjxXgoslqSibpH86DUz6U-UZV3Zi75HLj6Vi8u-_qIWEwXR_9nDK9xcl2xsj5luUrBtNirCyWY0T_wDWeUo5llM8a_mCRnyn2eR6Nurbne6ncxCQYR6WrYu1q9VtRHSiSPQJ654R2dQgaqY93o0drZkJZ5Ntm-enoyQskLhWdkbfUfJv1B5f3TyR4YLtd4ZNUihGebwd_3UEXbV3YHCJu5Ui97LmQGJe8u533Zw",
      description: "Macro-engineered textured sole resting on smooth clay-like surface with terracotta orange heel tab accent.",
      sizes: [9, 10, 11, 12],
      color: "Slate Gray"
    },
    {
      id: "aura-runner",
      name: "The 'Aura' Runner",
      tagline: "Viral Streetwear Silhouette",
      price: 165.0,
      category: "trending",
      rating: 4.95,
      reviewCount: 512,
      badge: "VIRAL PICK",
      badgeColor: "bg-primary text-white",
      isBestSeller: true,
      isTrending: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqvllBCZJBwnJh44P4Gg928YR-nhyDxWkQbA3oTeGlVy9_6GOcEkmlcSZlI0ASNK0QmdpkvlwrquG3iet3Etq-y6-oR5EtHQHuEsq-UGapcTqHKBcQtD_QkZwPvXRHnYBRDDQn4P9lohX5UTJ9ZQbBu9tBYfWHZOvwmainVnZJ-pWGSqjNtsVLR6tZcd809V8nKFOtZ39tcN1Vi84_HZIr_ok_v8jvRWv2X8PvTrWvWWfvUyzKhpE",
      description: "Spotted on streets from Tokyo to New York. The Aura redefines daily comfort with a hyper-minimalist profile and unparalleled cushioning.",
      sizes: [7, 8, 9, 10, 11, 12],
      color: "Onyx & Indigo"
    },
    {
      id: "cloudstep-pulse",
      name: "CloudStep Pulse",
      tagline: "Weightless Movement",
      price: 120.0,
      category: "women",
      rating: 4.85,
      reviewCount: 218,
      badge: "EDITOR'S CHOICE",
      badgeColor: "bg-primary text-white",
      isBestSeller: true,
      isTrending: true,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsyFtpJbuPrc_4OxGfLtQUKm3hkPBpjUWVgSpsb6t67FWZeC64UnvRg-zr2VIXbvo9TFL-Nomka5mB3AwnnWV94G8pnIaQXgg10kXAUkcsCXf5ENIxzf7NVgcC8-MRNoMs1xGkhTDKSI-DAdnNHuQ7_sfm2TnQBQIcuED3eYSObjstnppmpGjH7tulF_YhvsW8BjwP_tzdRkjiwfJmjzh8AsnwUE6UY0L_NXmV3vlnOFGskK3-8Zk",
      description: "Elegance and confidence merged in a modern architectural silhouette. Soft, diffused daylight tones.",
      sizes: [5, 6, 7, 8, 9, 10],
      color: "Alabaster White"
    },
    {
      id: "kids-playstride-lite",
      name: "PlayStride Lite",
      tagline: "Kids All-Day Trainer",
      price: 75.0,
      category: "kids",
      rating: 4.9,
      reviewCount: 164,
      badge: "PARENT FAVORITE",
      badgeColor: "bg-tertiary text-white",
      isBestSeller: true,
      isTrending: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6nU-Hp-pWYYiVFBYHKmvqWD6oS2Ta_6SOHYrnqoWpUCTSiGewH7m7DlVq7AU_1JYSFjdxWtnG7JDdD66DQvyq2L_6tlLX5HdQrY5lbJcYNhXwMxwCmfOam9E-6BLzEz3OFQ_bMc9liOuqS49thpggRLYP7za-5wZV8lmZVekHqazwh3JGPx4Ooio505nu2LyAhHIchTSZ1wiOHZlMIFNQ-4iYUXRSZwNMQEWmGWSorAW5yffUgMo",
      description: "Fun, durable and supportive steps designed for playground joy, dynamic jumping, and classroom comfort.",
      sizes: [1, 2, 3, 4, 11, 12, 13],
      color: "Multi Neon"
    },
    {
      id: "aero-silk-runner",
      name: "Aero Silk Runner",
      tagline: "Iconic Minimalist",
      price: 145.0,
      category: "men",
      rating: 4.8,
      reviewCount: 280,
      badge: "SIGNATURE",
      badgeColor: "bg-primary text-white",
      isBestSeller: true,
      isTrending: false,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFD43U9BxRhvoT97sKf1abj9n0pvtWvibKuuxjjwwTWrpgzDg7TE8dG_Mp4VQ0R2Y9qLHhhX6Ye--BtavPpcG_tbrLkT5-bV4u5UxPRLOerSf2xrJI_tTlACe9M3cDlY7nLbwbwmFL-9IpLHyvv7whU3DykZRK8q1H0jOvUqlymhBNNBjg3TuzsxIfBkCY17vPZo07QMOpBqhUUiP0KtrSQTyJPW3o-McheUew2tdxv5uv-31q9mY",
      description: "Close-up studio quality shot of smooth clay-like white and indigo neomorphic sneaker.",
      sizes: [8, 9, 10, 11, 12],
      color: "Cloud White"
    }
  ],
  categories: [
    { id: "men", name: "Men", icon: "male", path: "/men" },
    { id: "women", name: "Women", icon: "female", path: "/women" },
    { id: "kids", name: "Kids", icon: "child_care", path: "/kids" },
    { id: "trending", name: "Trending", icon: "local_fire_department", path: "/trending", highlight: true },
    { id: "best-sellers", name: "Best Sellers", icon: "star", path: "/best-sellers" }
  ],
  reviewStats: {
    averageRating: 4.8,
    totalReviews: 1284,
    distribution: [
      { stars: 5, label: "5 Stars", percentage: 85 },
      { stars: 4, label: "4 Stars", percentage: 10 },
      { stars: 3, label: "3 Stars", percentage: 3 },
      { stars: 2, label: "2 Stars", percentage: 1 },
      { stars: 1, label: "1 Star", percentage: 1 }
    ]
  },
  reviews: [
    {
      id: 1,
      author: "Sarah Jenkins",
      verified: true,
      rating: 5,
      date: "October 12, 2024",
      title: "Incredibly comfortable right out of the box",
      content: "I was hesitant to buy shoes online without trying them on, but these exceeded all expectations. The soft neomorphic aesthetic isn't just a look; the actual feel of the shoe reflects that same cushioned, premium quality. I wore them for a full 8-hour shift on my feet and experienced zero discomfort. Highly recommend!",
      helpfulCount: 24,
      unhelpfulCount: 2
    },
    {
      id: 2,
      author: "Michael T.",
      verified: true,
      rating: 5,
      date: "September 28, 2024",
      title: "Great style, runs slightly narrow",
      content: "The design is flawless and they look amazing with both casual and semi-formal outfits. The materials feel very high quality. My only minor gripe is that they run a bit narrow in the toe box. If you have wider feet, I'd suggest going half a size up. Otherwise, a stellar product.",
      helpfulCount: 12,
      unhelpfulCount: 0
    },
    {
      id: 3,
      author: "Elena Rostova",
      verified: true,
      rating: 5,
      date: "August 15, 2024",
      title: "Feels like walking on sculpted clouds",
      content: "The tactile depth and soft sole are next-level. Everyone in my studio asks where I got these shoes. The indigo accent is subtle yet striking in person.",
      helpfulCount: 19,
      unhelpfulCount: 1
    },
    {
      id: 4,
      author: "Marcus Chen",
      verified: true,
      rating: 4,
      date: "July 04, 2024",
      title: "Exceptional craftsmanship and durability",
      content: "Have had these for over 3 months of daily wear now. The neomorphic sole holds up incredibly well and retains its original bounce without flattening.",
      helpfulCount: 8,
      unhelpfulCount: 0
    }
  ],
  orders: [],
  newsletter: []
};

// Initialize DB file if not present
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

export function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading DB file:', error);
    return initialData;
  }
}

export function writeDB(data) {
  initDB();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing DB file:', error);
  }
}
