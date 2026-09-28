require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Blog = require('./models/Blog');

const blogsToSeed = [
  {
    title: 'How to Prevent Cylinder Scoring in Rotogravure Printing: The Complete Operator Guide',
    slug: 'how-to-prevent-cylinder-scoring-in-rotogravure-printing',
    targetWebsites: ['doctorblade.co.in', 'all'],
    category: 'Troubleshooting & Defects',
    excerpt: 'Cylinder scoring is one of the most expensive press room failures in rotogravure printing. Discover the primary metallurgical and mechanical causes, and learn practical steps to eliminate cylinder damage using blade angle calibration, filtration, and polymer doctor blades.',
    featuredImage: 'https://www.doctorblade.co.in/Doctorblade/polymer-blade/227.jpg',
    imageAlt: 'WIPEX Polymer Doctor Blade protecting gravure cylinder from scoring',
    metaTitle: 'How to Prevent Cylinder Scoring in Rotogravure Printing | ImageTech',
    metaDescription: 'Eliminate gravure cylinder scoring and costly re-chroming. Master blade angle calibration, ink filtration, and learn why polymer doctor blades prevent cylinder wear.',
    keywords: [
      'cylinder scoring doctor blade',
      'prevent gravure cylinder scratches',
      'chrome cylinder wear',
      'polymer doctor blade vs steel',
      'rotogravure printing defects',
      'doctor blade cylinder protection'
    ],
    canonicalUrl: 'https://www.doctorblade.co.in/blog/how-to-prevent-cylinder-scoring-in-rotogravure-printing',
    readTime: '6 min read',
    author: {
      name: 'ImageTech Engineering Team',
      title: 'Senior Printing & Packaging Specialist',
      avatar: 'https://www.doctorblade.co.in/logo-512x512.png'
    },
    relatedProductSlug: 'wipex-polymer-doctor-blade',
    toc: [
      { id: 'what-is-cylinder-scoring', text: 'What is Cylinder Scoring and Why is it Costly?', level: 2 },
      { id: 'root-causes', text: 'Top 4 Root Causes of Scoring in Rotogravure', level: 2 },
      { id: 'blade-angle-pressure', text: 'Optimizing Blade Angle and Holder Pressure', level: 2 },
      { id: 'filtration-cleanliness', text: 'Ink Filtration & Particle Management', level: 2 },
      { id: 'polymer-doctor-blades', text: 'Why Switch to Polymer Doctor Blades for Sensitive Rolls?', level: 2 },
      { id: 'prevention-checklist', text: 'Operator Daily Shift Prevention Checklist', level: 2 }
    ],
    faqs: [
      {
        question: 'Can a scored gravure cylinder be repaired on-press?',
        answer: 'Minor superficial chrome scratches can sometimes be polished with ultrafine diamond paste or polishing stone, but deep score lines that transfer ink require taking the cylinder off-press for de-chroming, copper re-engraving, and re-plating.'
      },
      {
        question: 'Why do polymer doctor blades eliminate cylinder scoring risks?',
        answer: 'Polymer blades are made of dense engineering plastics that have a significantly lower surface hardness than metallic chromium or copper. If a foreign contaminant is caught under the blade, the soft polymer yields rather than grooving into the hard cylinder surface.'
      },
      {
        question: 'What is the ideal contact angle to prevent blade edge burrs?',
        answer: 'The recommended working contact angle for steel doctor blades is between 55° and 65°. Running shallower than 50° increases the contact area and encourages edge chipping and burr generation.'
      },
      {
        question: 'How often should ink filters be inspected to prevent scoring?',
        answer: 'Magnetic filters and inline mesh filters (typically 100 to 150 mesh) should be cleaned at least once per shift and thoroughly inspected whenever a fresh drum of solvent or recycled ink is introduced.'
      }
    ],
    content: `## What is Cylinder Scoring and Why is it Costly?

In rotogravure printing, **cylinder scoring** refers to permanent circumferential grooves or hairline scratch marks etched across the chrome-plated surface of the engraved cylinder. Once a cylinder is scored, excess ink slips past the doctor blade and creates visible continuous streaks across the printed web.

Beyond ruining printed rolls, cylinder scoring causes catastrophic press downtime. A damaged cylinder must be removed, stripped, copper-re-etched or polished, and electroplated with fresh chrome. For packaging converters running multi-color high-speed jobs, scoring incidents directly cost thousands of dollars in lost substrates, rework, and delayed client deliveries.

---

## Top 4 Root Causes of Scoring in Rotogravure

Scoring does not happen by accident. Extensive pressroom investigations show that over 90% of scoring incidents stem from four specific culprits:

1. **Foreign Particle Contamination in the Ink Pan**:
   Microscopic metal shavings, dried ink flakes, paper dust, and abrasive pigment particles circulate through the ink reservoir. When a particle gets trapped between the blade edge and the spinning cylinder, it acts like a miniature lathe tool, gouging a circular trench into the chrome.
2. **Excessive Blade Pressure & Deflection**:
   When press operators experience incomplete ink wiping or hazing, the natural instinct is often to crank down pneumatic blade pressure. Excessive pressure flexes the blade, increases friction, and causes micro-chipping along the wiping tip.
3. **Improper Doctor Blade Installation & Oscillation Stoppage**:
   If the blade holder oscillation mechanism jams or slows down, heat and friction concentrate on fixed tracks, accelerating localized groove wear.
4. **Incorrect Blade Edge Profile Selection**:
   Using an overly thick blade edge without a properly ground lamella or bevel increases the contact zone width, trapping debris more easily.

---

## Optimizing Blade Angle and Holder Pressure

The single most effective operational parameter to master is the **contact angle**. 

- **Target Contact Angle**: Maintain **55° to 65°** tangential contact with the cylinder surface.
- **Why It Matters**: When the angle drops below 50°, the blade "skates" across the ink film. Operators instinctively increase pressure to compensate, which bends the blade backward (heel contact) and severely stresses the chrome.
- **The "Kiss Impression" Principle**: Always apply the minimum blade pressure required to achieve a clean wipe. Excessive force shortens blade life by 60% and increases cylinder friction drag.

---

## Ink Filtration & Particle Management

Preventing cylinder scoring requires a zero-tolerance approach to ink contamination:

- **Dual-Stage Magnetic Filtration**: Install high-intensity neodymium rare-earth magnetic traps in the ink return line. These capture ferrous metal particles shed by pumps, pipes, and doctor blade holders.
- **Inline Filter Bags**: Use continuous 100–150 mesh nylon or polypropylene filter bags on the supply line feeding the ink fountain.
- **Doctor Blade Washers**: Never dry-wipe a doctor blade against a stationary or rotating cylinder. Always ensure ink or solvent lubrication is flowing before lowering the blade assembly.

---

## Why Switch to Polymer Doctor Blades for Sensitive Rolls?

For converters operating sensitive ceramic anilox rollers or expensive gravure cylinders, conventional carbon steel blades always carry an inherent risk of scoring if an operator makes an error.

**WIPEX Polymer Doctor Blades** solve this problem completely:
- **Non-Metallic Engineering Polymer**: Formulated with high-lubricity industrial polymers that have zero metallic grit.
- **Zero Cylinder Scoring**: The polymer material is softer than chrome plating. If foreign debris enters the contact zone, the polymer blade safely absorbs or deflects around the particle instead of digging into the cylinder.
- **Corrosion Immunity**: 100% resistant to water-based inks, caustic washes, and aggressive solvents.
- **Operator Safety**: No razor-sharp steel burrs, reducing pressroom finger cuts and laceration injuries during blade changes.

---

## Operator Daily Shift Prevention Checklist

Post this checklist directly on your press console to prevent cylinder scoring on every run:

1. **Check Blade Oscillation**: Confirm the mechanical stroke (10–15 mm) is moving smoothly at all times.
2. **Inspect Blade Clamping**: Ensure the backing blade and doctor blade are clamped perfectly flat without ripples or waviness.
3. **Clean Magnetic Traps**: Inspect and clean the ink pan magnetic rods at every shift change.
4. **Verify Angle Gauge**: Measure blade angle with an angle protractor whenever the blade holder is serviced.
5. **Listen for Tone Changes**: A high-pitched squeal or chatter indicates dry friction or excessive pressure—lubricate immediately.`
  },
  {
    title: 'Doctor Blade Contact Angle and Pressure Optimization Guide for Gravure and Flexo Presses',
    slug: 'doctor-blade-contact-angle-and-pressure-optimization-guide',
    targetWebsites: ['doctorblade.co.in', 'all'],
    category: 'Press Setup & Optimization',
    excerpt: 'Mastering blade angle (55°–65°) and wiping pressure is the cornerstone of defect-free printing. Learn how improper blade deflection causes ink spitting, hazing, and rapid edge wear, and how to calibrate your press for peak efficiency.',
    featuredImage: 'https://www.doctorblade.co.in/Doctorblade/steel-blade/224.jpg',
    imageAlt: 'Precision WIPEX Carbon Steel Doctor Blade contact angle setup',
    metaTitle: 'Doctor Blade Angle & Pressure Optimization Guide | ImageTech Industries',
    metaDescription: 'Optimize doctor blade contact angle (55°–65°) and wiping pressure in gravure and flexo presses. Eliminate ink spitting, tone hazing, and premature blade failure.',
    keywords: [
      'doctor blade contact angle',
      'doctor blade pressure',
      'gravure doctor blade setup',
      'flexo blade angle',
      'blade deflection',
      'ink wiping optimization',
      'prevent ink spitting'
    ],
    canonicalUrl: 'https://www.doctorblade.co.in/blog/doctor-blade-contact-angle-and-pressure-optimization-guide',
    readTime: '7 min read',
    author: {
      name: 'ImageTech Engineering Team',
      title: 'Press Mechanics Specialist',
      avatar: 'https://www.doctorblade.co.in/logo-512x512.png'
    },
    relatedProductSlug: 'wipex-carbon-steel-doctor-blade',
    toc: [
      { id: 'importance-of-geometry', text: 'Why Blade Geometry Dictates Print Quality', level: 2 },
      { id: 'ideal-contact-angle', text: 'The Golden 55°–65° Contact Angle Explained', level: 2 },
      { id: 'blade-pressure-traps', text: 'The Cost of Over-Pressuring the Doctor Blade', level: 2 },
      { id: 'flexo-chamber-setup', text: 'Chamber Doctor Blade Systems in Flexography', level: 2 },
      { id: 'lamella-vs-bevel', text: 'Selecting the Right Edge Profile (Lamella vs Bevel)', level: 2 },
      { id: 'calibration-routine', text: 'Step-by-Step Press Calibration Routine', level: 2 }
    ],
    faqs: [
      {
        question: 'What happens if the doctor blade contact angle is too low (under 50°)?',
        answer: 'When the angle is below 50°, hydrodynamic lift forces from the ink film push the blade away from the cylinder. This causes hazing, floating, uneven tone wiping, and forces operators to apply dangerous amounts of extra pressure.'
      },
      {
        question: 'What causes blade chatter marks on the substrate?',
        answer: 'Chatter marks occur when the blade holder vibrates at high speeds. This is usually caused by excessive blade extension beyond the backup blade, insufficient clamp tightness, or running a steep angle (over 70°) combined with high pressure.'
      },
      {
        question: 'Why is lamella edge profile preferred for long rotogravure runs?',
        answer: 'A lamella edge maintains a constant tip thickness (e.g. 0.05 mm or 0.07 mm) as it wears down, providing a uniform contact area and consistent ink film thickness throughout the roll run.'
      },
      {
        question: 'How much should the working blade extend beyond the backup blade?',
        answer: 'The standard recommendation is 2 mm to 4 mm extension beyond the backup blade. Too much extension causes excessive blade bending and flutter; too little makes the blade overly rigid and harsh on the cylinder.'
      }
    ],
    content: `## Why Blade Geometry Dictates Print Quality

In both flexographic and rotogravure printing, the doctor blade acts as a high-precision mechanical metering valve. Its sole job is to shear away excess surface ink so that only the ink inside the engraved anilox cells or gravure cup recesses reaches the printing substrate.

Yet, despite using top-grade inks and high-resolution plates, pressrooms constantly battle defects like:
- **Tonal Hazing / Scumming**: A light film of unwanted ink spreading over non-image areas.
- **Ink Spitting**: Specks of ink spraying onto the web at high press speeds.
- **Streak Lines**: Fine parallel lines running through solid vignettes.

Almost every single one of these defects is directly related to **contact angle misalignment** or **excessive blade pressure**.

---

## The Golden 55°–65° Contact Angle Explained

The **contact angle** is the angle formed between the tangent line of the cylinder at the point of contact and the front face of the doctor blade.

- **Under 50° (Too Shallow)**:
  The hydrodynamic pressure of the incoming ink film acts like water skiing beneath a ski. It forces the blade up and away from the roller surface. The blade skates over ink, leading to severe hazing and bleeding.
- **55° to 65° (The Sweet Spot)**:
  At this angle, the blade achieves clean shearing action with minimal friction resistance. Ink is cleanly shaved off, hydrodynamic forces are balanced, and the blade tip wears evenly without rounding.
- **Over 70° (Too Steep)**:
  A steep angle makes the blade act like a chisel. It generates intense friction, induces high-frequency blade chatter, and wears both the blade edge and cylinder chrome prematurely.

---

## The Cost of Over-Pressuring the Doctor Blade

A common mistake in packaging presses is using pressure as a substitute for proper blade alignment. When hazing appears, operators tighten the pneumatic cylinder screws.

Here is what happens inside the micro-zone when you over-pressure:
1. **Heel Contact**: The blade flexes backward. Instead of the precision ground tip touching the cylinder, the rounded heel of the blade rides on the surface.
2. **Friction Heat**: Chrome surface temperature spikes, causing ink solvents to dry rapidly behind the blade, forming dried ink crusts.
3. **Rapid Blade Fatigue**: Blade life drops from 80,000 meters down to 25,000 meters, forcing frequent reel stops.

---

## Chamber Doctor Blade Systems in Flexography

In closed-chamber flexo systems, two blades work simultaneously against the ceramic anilox roller:
- **The Metering Blade (Working Blade)**: Pointed in the reverse direction of anilox rotation, typically at a 30° to 35° angle to the chamber body, creating a 60° angle against the anilox.
- **The Containment Blade**: Rides in the direction of rotation to keep ink inside the chamber.

**Crucial Setup Rule**: Containment blades must always be set with light pressure. If the containment blade is over-tightened, it deflects ink backwards and generates the infamous flexo "ink spitting" phenomenon onto the moving packaging film.

---

## Selecting the Right Edge Profile (Lamella vs Bevel)

- **Lamella Profile (Step Edge)**:
  The tip is ground with a micro-step (e.g., 0.06 mm thick across 1.3 mm depth). As the blade wears, the contact area remains mathematically identical. Ideal for high-end process printing, cosmetics packaging, and fine halftone vignettes.
- **Bevel Profile (Angled Edge)**:
  Tapered at 15° to 30°. Highly rigid and durable. Perfect for abrasive white inks, heavy metallic pigments, and corrugated flexo operations.

---

## Step-by-Step Press Calibration Routine

1. **Verify Backup Blade Condition**: Inspect the support blade for straightness. Replace if nicked or bent.
2. **Mount with Consistent Clamp Torque**: Tighten blade holder screws from the center outward to avoid ripples.
3. **Set Extension to 3.0 mm**: Use a gauge tool to confirm uniform 3 mm blade protrusion along the entire holder length.
4. **Zero-In With Light Contact**: Bring the blade holder forward until the first hint of contact, then add only 0.5 to 1.0 bar of pneumatic pressure.
5. **Inspect the Wipe**: Once ink begins circulating, confirm a clean dry wipe across the roller ends.`
  },
  {
    title: 'Carbon Steel vs Stainless Steel vs Polymer Doctor Blades: Material Selection Matrix',
    slug: 'carbon-steel-vs-stainless-steel-vs-polymer-doctor-blades-selection',
    targetWebsites: ['doctorblade.co.in', 'all'],
    category: 'Material Selection',
    excerpt: 'Choosing the right doctor blade material directly impacts blade life, print density, and roll longevity. Compare metallurgical properties, hardness, chemical resistance, and cost factors across Carbon Steel, Stainless Steel, and Polymer blades.',
    featuredImage: 'https://www.doctorblade.co.in/Doctorblade/steel-blade/225.jpg',
    imageAlt: 'Comparison of carbon steel, stainless steel, and polymer doctor blades',
    metaTitle: 'Carbon Steel vs Stainless Steel vs Polymer Doctor Blades | ImageTech',
    metaDescription: 'Detailed metallurgical guide comparing carbon steel, stainless steel, and polymer doctor blades. Choose the best blade material for your printing ink and press speed.',
    keywords: [
      'carbon steel vs stainless steel doctor blade',
      'polymer doctor blade material',
      'water based ink doctor blade',
      'doctor blade comparison',
      'ceramic roll protection',
      'printing doctor blade selection'
    ],
    canonicalUrl: 'https://www.doctorblade.co.in/blog/carbon-steel-vs-stainless-steel-vs-polymer-doctor-blades-selection',
    readTime: '6 min read',
    author: {
      name: 'ImageTech Engineering Team',
      title: 'Metallurgical Materials Specialist',
      avatar: 'https://www.doctorblade.co.in/logo-512x512.png'
    },
    relatedProductSlug: 'wipex-stainless-steel-doctor-blade',
    toc: [
      { id: 'why-material-matters', text: 'Why Doctor Blade Metallurgy Matters', level: 2 },
      { id: 'carbon-steel-deep-dive', text: 'WIPEX Carbon Steel: The Industrial Benchmark', level: 2 },
      { id: 'stainless-steel-deep-dive', text: 'Stainless Steel: Conquering Corrosion & Water Inks', level: 2 },
      { id: 'polymer-blades-deep-dive', text: 'Engineering Polymers: Safety & Anilox Protection', level: 2 },
      { id: 'selection-comparison-table', text: 'Comprehensive Technical Comparison Table', level: 2 },
      { id: 'decision-framework', text: 'How to Choose the Right Blade for Your Press', level: 2 }
    ],
    faqs: [
      {
        question: 'When is Stainless Steel strictly required over Carbon Steel?',
        answer: 'Stainless steel is mandatory whenever you run water-based inks, alkaline coatings, or inks with pH levels above 8.5. In these conditions, carbon steel rusts rapidly, releasing microscopic oxide particles that contaminate the ink system.'
      },
      {
        question: 'Can polymer doctor blades handle high press speeds (300+ m/min)?',
        answer: 'Modern high-density engineering polymer blades with custom bevels perform reliably on high-speed wide-web flexo presses up to 350 m/min, especially when used in enclosed chamber doctor blade systems.'
      },
      {
        question: 'Which blade material provides the sharpest print dot reproduction?',
        answer: 'Refined carbon steel blades with a precision lamella edge provide the crispest shearing action and sharpest dot definition, making them the preferred choice for rotogravure photo reproduction and micro-text.'
      },
      {
        question: 'Do polymer doctor blades wear out faster than steel?',
        answer: 'On abrasive white or titanium dioxide inks, polymers may wear slightly faster than steel; however, because they do not damage the multimillion-rupee anilox roll and eliminate operator cuts, the total cost of ownership is often substantially lower.'
      }
    ],
    content: `## Why Doctor Blade Metallurgy Matters

Every printing press operator knows that doctor blades are consumable items. However, treating all doctor blades as interchangeable commodities is one of the most expensive misconceptions in packaging manufacturing.

The chemical formulation of your ink (solvent, water, or UV), the abrasiveness of your pigments (such as titanium dioxide or metallic flakes), press operating speeds, and cylinder surface hardness all dictate which blade material will deliver optimal performance.

Selecting the wrong material leads to:
- Chemical corrosion causing blade pitting and ink streaking.
- Severe friction heat degrading inks.
- Permanent cylinder scoring and expensive re-engraving.

Below is a complete metallurgical breakdown of the three primary doctor blade materials manufactured by ImageTech Industries.

---

## WIPEX Carbon Steel: The Industrial Benchmark

**Carbon Steel** doctor blades remain the gold standard for high-precision rotogravure and solvent-based flexographic printing.

- **Metallurgical Composition**: Premium Swedish refined high-carbon strip steel with uniform carbide distribution.
- **Surface Hardness**: Approximately 580 to 600 HV (Vickers Hardness).
- **Core Advantages**:
  - Unrivaled edge straightness and stiffness.
  - Razor-clean ink shearing, producing unmatched dot clarity in halftones.
  - Micro-honed lamella edges that wear down evenly without creating burrs.
- **Best Suited For**: Flexible packaging rotogravure, solvent inks, publication gravure, and high-resolution label printing.

---

## Stainless Steel: Conquering Corrosion & Water Inks

While carbon steel excels in solvent inks, it faces a fatal vulnerability: **water and moisture**.

When exposed to water-based flexo inks or high-humidity pressrooms, carbon steel begins oxidizing within hours. Microscopic rust pits form along the wiping edge. These pits cause micro-leaks, uneven ink metering, and contaminate the ink fountain with abrasive iron oxide flakes.

- **Metallurgical Composition**: High-chromium stainless alloy engineered for high tensile strength and rust immunity.
- **Surface Hardness**: Approximately 560 to 580 HV.
- **Core Advantages**:
  - 100% resistant to chemical oxidation and water-based ink degradation.
  - Extended blade lifespan during long corrugated box and paper packaging runs.
  - Zero rust contamination in the ink circulation circuit.
- **Best Suited For**: Corrugated carton flexo, paper sack printing, water-based coatings, and high-pH alkaline ink formulations.

---

## Engineering Polymers: Safety & Anilox Protection

In modern flexography, ceramic anilox rollers are among the most expensive capital assets on the press floor. A single steel blade failure can scratch an anilox sleeve, ruining thousands of printing cells permanently.

**WIPEX Polymer Doctor Blades** provide an advanced non-metallic alternative:
- **Material**: High-molecular-weight engineering polymer compounds.
- **Core Advantages**:
  - **Zero Anilox Scoring**: Will never groove or scratch ceramic or chrome surfaces.
  - **Superior Containment**: Conforms effortlessly to chamber seals without end-seal leakage.
  - **Maximized Operator Safety**: Technicians cannot cut their fingers during blade cleaning or installation.
- **Best Suited For**: Ceramic anilox protection, chamber containment blades, white ink stations, and corrugated flexo.

---

## Comprehensive Technical Comparison Table

| Feature / Metric | WIPEX Carbon Steel | WIPEX Stainless Steel | WIPEX Polymer Blade |
| :--- | :--- | :--- | :--- |
| **Material Base** | Refined High Carbon | High-Chromium Stainless | Engineering Polymer |
| **Vickers Hardness** | 580 – 600 HV | 560 – 580 HV | Non-Metallic Polymer |
| **Solvent Ink Compatibility** | ⭐⭐⭐⭐⭐ (Excellent) | ⭐⭐⭐⭐⭐ (Excellent) | ⭐⭐⭐⭐ (Very Good) |
| **Water Ink Compatibility** | ⭐⭐ (Rust Risk) | ⭐⭐⭐⭐⭐ (Immune) | ⭐⭐⭐⭐⭐ (Immune) |
| **Cylinder Protection** | High Precision | High Precision | ⭐⭐⭐⭐⭐ (Safest) |
| **Operator Safety** | Requires Gloves | Requires Gloves | 100% Safe (No cuts) |
| **Standard Thicknesses** | 0.15 mm, 0.20 mm | 0.15 mm, 0.20 mm | 0.75 mm |

---

## How to Choose the Right Blade for Your Press

Follow this simple decision rule in your plant:
1. **Are you running solvent-based gravure with fine halftones?** -> Select **WIPEX Carbon Steel with Lamella Edge**.
2. **Are you running water-based corrugated inks or high-pH coatings?** -> Select **WIPEX Stainless Steel**.
3. **Are you experiencing anilox wear, end-seal leaks, or operator safety incidents?** -> Switch immediately to **WIPEX Polymer Doctor Blades**.`
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding blogs...');

    for (const b of blogsToSeed) {
      const existing = await Blog.findOne({ slug: b.slug });
      if (existing) {
        console.log(`Blog already exists, updating: ${b.slug}`);
        await Blog.findOneAndUpdate({ slug: b.slug }, b, { new: true });
      } else {
        console.log(`Creating new blog: ${b.slug}`);
        await Blog.create(b);
      }
    }

    console.log('✅ Successfully seeded all Doctor Blade technical blogs!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
