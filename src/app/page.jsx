

import Image from "next/image";
import styles from "./home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.landingBg}>
      <section className={styles.heroAlt}>
        <div className={styles.heroContentAlt}>
          <Image src="/globe.svg" alt="Logo" width={90} height={90} className={styles.heroIcon} />
          <h1 className={styles.title}>Steal a Brainrot</h1>
          <p className={styles.subtitle}>
            Descubra, explore e favorite brainrots únicos do universo Steal a Brainrot.<br/>
            Uma experiência visual, divertida e feita para você!
          </p>
          <div className={styles.heroActions}>
            <Link href="/brainrots" className={styles.ctaPrimary}>Ver Brainrots</Link>
            <Link href="/about" className={styles.ctaSecondary}>Sobre o Dev</Link>
          </div>
        </div>
      </section>

      {/* Seção 1 - Esquerda */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionContentLeft}>
          <Image src="/file.svg" alt="Listagem" width={70} height={70} />
          <div>
            <h2>Listagem Completa</h2>
            <p>Veja todos os brainrots cadastrados, com imagens, raridade e detalhes.</p>
          </div>
        </div>
      </section>

      {/* Seção 2 - Direita */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionContentRight}>
          <div>
            <h2>Detalhes Ricos</h2>
            <p>Abra cada brainrot e veja informações detalhadas, localização e descrição.</p>
          </div>
          <Image src="/window.svg" alt="Detalhes" width={70} height={70} />
        </div>
      </section>

      {/* Seção 3 - Esquerda */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionContentLeft}>
          <Image src="/vercel.svg" alt="Favoritos" width={70} height={70} />
          <div>
            <h2>Favoritos</h2>
            <p>Marque brainrots favoritos e acesse rapidamente os seus preferidos.</p>
          </div>
        </div>
      </section>

      {/* Seção 4 - Direita */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionContentRight}>
          <div>
            <h2>Sobre o Dev</h2>
            <p>Conheça quem desenvolveu o projeto e inspire-se para criar o seu!</p>
          </div>
          <Image src="/next.svg" alt="Sobre Mim" width={70} height={70} />
        </div>
      </section>

      <section className={styles.ctaSectionAlt}>
        <h2>Pronto para explorar?</h2>
        <Link href="/brainrots" className={styles.ctaPrimaryLarge}>Comece agora</Link>
      </section>
    </div>
  );
}
