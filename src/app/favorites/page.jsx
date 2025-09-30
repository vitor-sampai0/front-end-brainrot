"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, Empty, message } from "antd";
import { 
  HeartFilled, 
  DeleteOutlined, 
  EyeOutlined,
  HeartOutlined,
  EditOutlined
} from "@ant-design/icons";
import { favoritesStorage, brainrotStorage } from "../../hooks/useLocalStorage";
import styles from "./favorites.module.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = favoritesStorage.getAll();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      message.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (brainrot) => {
    try {
      // Remover dos favoritos no localStorage
      favoritesStorage.remove(brainrot.id);
      
      // Atualizar o brainrot no storage principal
      brainrotStorage.update(brainrot.id, { 
        ...brainrot, 
        favorite: false 
      });
      
      // Atualizar estado local
      const newFavorites = favorites.filter(fav => fav.id !== brainrot.id);
      setFavorites(newFavorites);
      
      message.success('Removido dos favoritos!');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      message.error('Erro ao remover favorito. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <HeartFilled className={styles.titleIcon} />
            Meus Favoritos
          </h1>
          <p className={styles.subtitle}>
            Sua coleção de brainrots favoritos ({favorites.length} itens)
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <Empty
              image={<HeartOutlined className={styles.emptyIcon} />}
              description={
                <div className={styles.emptyContent}>
                  <h3>Nenhum favorito ainda</h3>
                  <p>Comece explorando os brainrots e adicione seus favoritos aqui!</p>
                  <Link href="/brainrots">
                    <Button type="primary" size="large" className={styles.exploreButton}>
                      Explorar Brainrots
                    </Button>
                  </Link>
                </div>
              }
            />
          </div>
        ) : (
          <div className={styles.favoritesGrid}>
            {favorites.map((brainrot, index) => (
              <Card
                key={brainrot.id}
                className={styles.favoriteCard}
                style={{ animationDelay: `${index * 0.1}s` }}
                cover={
                  brainrot.img_1 ? (
                    <div className={styles.imageContainer}>
                      <Image 
                        src={brainrot.img_1} 
                        alt={brainrot.name}
                        width={300}
                        height={200}
                        className={styles.cardImage}
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.favoriteIcon}>
                          <HeartFilled />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>🧠</span>
                    </div>
                  )
                }
                actions={[
                  <Link href={`/brainrots/${brainrot.id}`} key="view">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      className={styles.actionButton}
                    >
                      Ver Detalhes
                    </Button>
                  </Link>,
                  <Link href={`/brainrots/${brainrot.id}/edit`} key="edit">
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      className={styles.actionButton}
                    >
                      Editar
                    </Button>
                  </Link>,
                  <Button 
                    key="remove"
                    type="text" 
                    icon={<DeleteOutlined />} 
                    className={styles.removeButton}
                    onClick={() => removeFavorite(brainrot)}
                  >
                    Remover
                  </Button>
                ]}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{brainrot.name}</h3>
                  <div className={styles.cardStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Custo:</span>
                      <span className={styles.statValue}>${brainrot.cost || 0}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Renda:</span>
                      <span className={styles.statValue}>${brainrot.income || 0}</span>
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.addedDate}>
                      Favorito • ID: {brainrot.id}
                    </span>
                    {brainrot.concluida && (
                      <span className={styles.completedBadge}>Concluído</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
