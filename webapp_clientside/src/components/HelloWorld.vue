<template>
  <div class="home-page">
    <!-- Hero -->
    <header class="hero container">
      <div class="hero-copy">
        <span class="eyebrow rise" style="--i: 0">{{ msg }}</span>
        <h1 class="hero-title rise" style="--i: 1">
          Follow every bin from the <span class="mark">curb</span> to the plant.
        </h1>
        <p class="hero-lead rise" style="--i: 2">
          Manage household waste collection and recycling: waste types,
          collection points, collection rounds and treatment centers — in one place.
        </p>
        <div class="d-flex flex-wrap gap-2 rise" style="--i: 3">
          <router-link to="/collections" class="btn-brand">
            See collections <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </router-link>
          <router-link to="/collection-points" class="btn-ghost">
            <i class="bi bi-map" aria-hidden="true"></i> Find a drop-off point
          </router-link>
        </div>
      </div>

      <div class="hero-art rise" style="--i: 2">
        <img :src="heroImg" alt="Yellow, blue, red and green wheelie bins against a wall" class="art-main" />
        <img :src="cardboardImg" alt="Colourful flattened cardboard ready for recycling" class="art-small" />
        <div class="chip chip-top">
          <span class="chip-icon"><i class="bi bi-box-seam" aria-hidden="true"></i></span>
          <div>
            <strong class="tabular">5,080.7 kg</strong>
            <small>collected so far</small>
          </div>
        </div>
        <div class="chip chip-bottom">
          <i class="bi bi-check2-circle" aria-hidden="true"></i>
          <span>8 cities covered</span>
        </div>
        <svg class="art-loop" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="loopPath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text>
            <textPath href="#loopPath" textLength="274" lengthAdjust="spacing">reduce · reuse · recycle ·</textPath>
          </text>
        </svg>
      </div>
    </header>

    <!-- Key figures -->
    <section class="container">
      <dl class="stats rise" style="--i: 4">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <i :class="['bi', stat.icon]" aria-hidden="true"></i>
          <dt>{{ stat.label }}</dt>
          <dd class="tabular">{{ stat.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- Sections -->
    <section class="container section">
      <div class="section-head">
        <div>
          <span class="eyebrow">Explore the data</span>
          <h2 class="section-title">Four views on the recycling chain</h2>
        </div>
        <p class="text-muted section-sub">
          Pick a section to browse the records stored in the database.
        </p>
      </div>

      <div class="bento">
        <router-link
          v-for="(item, index) in sections"
          :key="item.to"
          :to="item.to"
          :class="['tile', `tile-${index + 1}`]"
        >
          <img :src="item.image" :alt="item.imageAlt" class="tile-img" loading="lazy" />
          <div class="tile-shade"></div>
          <span class="tile-index">0{{ index + 1 }}</span>
          <div class="tile-body">
            <span class="tile-icon"><i :class="['bi', item.icon]" aria-hidden="true"></i></span>
            <h3 class="tile-title">{{ item.label }}</h3>
            <p class="tile-desc">{{ item.description }}</p>
          </div>
          <span class="tile-go"><i class="bi bi-arrow-up-right" aria-hidden="true"></i></span>
        </router-link>
      </div>
    </section>

    <!-- How it works -->
    <section class="container section">
      <div class="flow">
        <div class="flow-intro">
          <span class="eyebrow eyebrow-light">How it works</span>
          <h2 class="section-title text-white">One loop, four steps</h2>
          <p class="flow-sub">
            Each record in the app matches one link of the chain, so you can
            trace a bag of waste all the way to its treatment.
          </p>
        </div>
        <ol class="flow-steps">
          <li v-for="(item, index) in sections" :key="item.to" class="flow-step">
            <span class="flow-num">{{ index + 1 }}</span>
            <i :class="['bi', item.icon, 'flow-icon']" aria-hidden="true"></i>
            <strong>{{ item.step }}</strong>
            <span>{{ item.label }}</span>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script>
import sections from '@/sections'
import heroImg from '@/assets/img/hero-bins.jpg'
import cardboardImg from '@/assets/img/cardboard.jpg'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      sections,
      heroImg,
      cardboardImg,
      stats: [
        { icon: 'bi-recycle', label: 'Waste types', value: '10' },
        { icon: 'bi-geo-alt', label: 'Collection points', value: '10' },
        { icon: 'bi-truck', label: 'Collection rounds', value: '10' },
        { icon: 'bi-speedometer2', label: 'Treatment capacity', value: '16,650 t' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home-page {
  overflow-x: clip;
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 3rem;
  align-items: center;
  padding-top: 4rem;
  padding-bottom: 3.5rem;
}

.hero-title {
  margin: 1.1rem 0 1.25rem;
  font-size: clamp(2.6rem, 5.8vw, 4.9rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.mark {
  padding: 0 0.08em;
  margin: 0 -0.08em;
  white-space: nowrap;
  background: linear-gradient(
    transparent 58%,
    var(--accent) 58%,
    var(--accent) 90%,
    transparent 90%
  );
}

.hero-lead {
  max-width: 32rem;
  margin-bottom: 2rem;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--muted);
}

.hero-art {
  position: relative;
  aspect-ratio: 1 / 1.02;
  max-width: 560px;
  width: 100%;
  justify-self: end;
}

.art-main {
  position: absolute;
  inset: 0 0 12% 12%;
  width: 88%;
  height: 88%;
  object-fit: cover;
  border-radius: 200px 200px var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow);
}

.art-small {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 42%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius);
  border: 6px solid var(--paper);
  box-shadow: var(--shadow);
  transform: rotate(-5deg);
  transition: transform 0.5s var(--ease);
}

.hero-art:hover .art-small {
  transform: rotate(-1deg) translateY(-6px);
}

.chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 1rem 0.65rem 0.65rem;
  border-radius: 999px;
  background: rgba(251, 250, 245, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow);
  animation: float 6s ease-in-out infinite;
}

.chip strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  line-height: 1.1;
}

.chip small {
  color: var(--muted);
}

.chip-icon {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--ink);
  color: var(--accent);
}

.chip-top {
  top: 16%;
  left: 2%;
}

.chip-bottom {
  right: -2%;
  bottom: 18%;
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  background: var(--accent);
  border-color: transparent;
  animation-delay: -3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.art-loop {
  position: absolute;
  top: -3%;
  right: -3%;
  width: 26%;
  animation: spin 22s linear infinite;
}

.art-loop text {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  fill: var(--ink);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.stat {
  position: relative;
  padding: 1.6rem 1.75rem;
}

.stat + .stat {
  border-left: 1px solid var(--line);
}

.stat .bi {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 1.2rem;
  color: var(--leaf);
}

.stat dt {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--muted);
}

.stat dd {
  margin: 0.3rem 0 0;
  font-family: var(--font-display);
  font-size: 2.3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

/* Sections */
.section {
  padding-top: 5.5rem;
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: 2rem;
}

.section-title {
  margin: 0.7rem 0 0;
  font-size: clamp(2rem, 3.6vw, 2.9rem);
  font-weight: 800;
}

.section-sub {
  max-width: 22rem;
  margin: 0;
}

.bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 260px;
  gap: 1rem;
}

.tile-1 { grid-column: span 4; }
.tile-2 { grid-column: span 2; grid-row: span 2; }
.tile-3 { grid-column: span 2; }
.tile-4 { grid-column: span 2; }

.tile {
  position: relative;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-radius: var(--radius-lg);
  color: #fff;
  text-decoration: none;
  isolation: isolate;
  box-shadow: var(--shadow-sm);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.tile:hover {
  color: #fff;
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.tile-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  transition: transform 0.8s var(--ease);
}

.tile:hover .tile-img {
  transform: scale(1.06);
}

.tile-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(19, 36, 26, 0) 25%, rgba(19, 36, 26, 0.88) 100%);
}

.tile-index {
  position: absolute;
  top: 1.1rem;
  left: 1.3rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(19, 36, 26, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.tile-body {
  padding: 1.5rem;
}

.tile-icon {
  display: inline-grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  margin-bottom: 0.8rem;
  border-radius: 0.8rem;
  background: var(--accent);
  color: var(--ink);
  font-size: 1.2rem;
}

.tile-title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
}

.tile-desc {
  margin: 0;
  max-width: 24rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.tile-go {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  background: #fff;
  color: var(--ink);
  font-size: 1.1rem;
  transition: transform 0.4s var(--ease), background-color 0.3s var(--ease);
}

.tile:hover .tile-go {
  background: var(--accent);
  transform: rotate(45deg);
}

/* Flow */
.flow {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 2.5rem;
  align-items: center;
  padding: 3.5rem;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(211, 234, 107, 0.18), transparent 60%),
    radial-gradient(50% 70% at 0% 100%, rgba(77, 138, 99, 0.35), transparent 70%),
    var(--ink);
  color: #fff;
}

.eyebrow-light {
  color: var(--accent);
}

.flow-sub {
  margin: 1rem 0 0;
  max-width: 24rem;
  color: rgba(255, 255, 255, 0.7);
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}

.flow-step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 1.25rem 1.1rem;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s var(--ease), transform 0.3s var(--ease);
}

.flow-step:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}

.flow-step:nth-child(even) {
  margin-top: 2rem;
}

.flow-num {
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

.flow-icon {
  margin-bottom: 1.4rem;
  font-size: 1.8rem;
  color: var(--accent);
}

.flow-step strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.flow-step span:last-child {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Responsive */
@media (max-width: 991.98px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 2.5rem;
  }

  .hero-art {
    justify-self: center;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat:nth-child(3) {
    border-left: 0;
  }

  .stat:nth-child(n + 3) {
    border-top: 1px solid var(--line);
  }

  .bento {
    grid-template-columns: repeat(2, 1fr);
  }

  .tile-1,
  .tile-2,
  .tile-3,
  .tile-4 {
    grid-column: span 1;
    grid-row: span 1;
  }

  .tile-1 {
    grid-column: span 2;
  }

  .flow {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.75rem;
  }

  .flow-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 575.98px) {
  .bento {
    grid-template-columns: 1fr;
    grid-auto-rows: 230px;
  }

  .tile-1 {
    grid-column: span 1;
  }

  .stat {
    padding: 1.25rem;
  }

  .stat dd {
    font-size: 1.8rem;
  }

  .flow-step:nth-child(even) {
    margin-top: 0;
  }

  .stat .bi {
    display: none;
  }

  .art-loop {
    right: 0;
  }

  .chip-bottom {
    right: 0;
  }
}
</style>
