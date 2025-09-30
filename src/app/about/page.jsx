"use client";

import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vitor Sampaio</h1>
      <h2 className={styles.subtitle}>Estudante SENAI • 17 anos</h2>
      <p className={styles.description}>
        Olá! Eu sou o Vitor Sampaio, tenho 17 anos e sou apaixonado por tecnologia e jogos.<br/>
        Atualmente estudo no SENAI e estou sempre buscando aprender mais e evoluir como desenvolvedor.<br/>
        Meu objetivo é me tornar um desenvolvedor cada vez melhor e contribuir com projetos incríveis!
      </p>
      <div className={styles.interests}>
        <span>🎮 Jogos</span>
        <span>💻 Tecnologia</span>
        <span>🎓 SENAI</span>
      </div>
    </div>
  );
}
