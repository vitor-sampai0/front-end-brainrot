"use client";

import styles from "./favorites.module.css";

export default function FavoritesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Favoritos</h1>
      <p className={styles.description}>
        Aqui você verá os brainrots que marcar como favoritos (em breve!).
      </p>
    </div>
  );
}
