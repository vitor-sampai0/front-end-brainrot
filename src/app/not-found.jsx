"use client";

import Link from "next/link";
import styles from "./notfound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Ops! Página não encontrada</h1>
        <p className={styles.description}>
          A página que você procura não existe ou foi removida.<br/>
          Que tal explorar os brainrots disponíveis?
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.cta}>
            Voltar ao Início
          </Link>
          <Link href="/brainrots" className={styles.ctaSecondary}>
            Ver Brainrots
          </Link>
        </div>
      </div>
    </div>
  );
}
