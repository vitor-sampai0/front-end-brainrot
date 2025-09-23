"use client";

import Link from "next/link";
import styles from "./notfound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Página não encontrada</h1>
      <p className={styles.description}>
        Oops! A página que você procura não existe ou foi removida.
      </p>
      <Link href="/" className={styles.link}>
        Voltar para a Home
      </Link>
    </div>
  );
}
