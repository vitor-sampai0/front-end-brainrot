"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Card, Spin, Button, Descriptions, Tag, message } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined, HeartOutlined, HeartFilled, EditOutlined } from "@ant-design/icons";
import { brainrotStorage, favoritesStorage } from "@/hooks/useLocalStorage";
import styles from "../brainrots.module.css";

export default function BrainrotDetailsPage({ params }) {
  const [brainrot, setBrainrot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const getRealId = (id) => {
    if (typeof id === "string" && (id.startsWith("api_") || id.startsWith("local_"))) {
      return id.split("_")[1];
    }
    return id;
  };

  const fetchBrainrot = async (brainrotID) => {
    try {
      setLoading(true);
      const realId = getRealId(brainrotID);
      
      // Primeiro tentar buscar no localStorage
      const localBrainrots = brainrotStorage.getAll();
      const localBrainrot = localBrainrots.find(b => b.id === realId);
      
      if (localBrainrot) {
        setBrainrot({
          ...localBrainrot,
          isFromAPI: false,
          userCreated: true,
          id: `local_${localBrainrot.id}`
        });
        setIsFavorited(favoritesStorage.isFavorite(realId));
        setLoading(false);
        return;
      }

      // Se não encontrou localmente, tentar buscar da API
      try {
        const response = await axios.get(`http://localhost:4000/brainrot/${realId}`);
        if (response.data) {
          setBrainrot({
            ...response.data,
            isFromAPI: true,
            userCreated: false,
            id: `api_${response.data.id}`
          });
          setIsFavorited(favoritesStorage.isFavorite(realId));
        } else {
          setBrainrot(null);
        }
      } catch (apiError) {
        console.log("Brainrot não encontrado na API:", apiError);
        setBrainrot(null);
      }
    } catch (error) {
      console.error("Erro ao buscar brainrot:", error);
      setBrainrot(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchBrainrot(params.id);
    }
  }, [params.id]);

  const handleFavorite = () => {
    if (!brainrot) return;
    
    const realId = getRealId(brainrot.id);
    
    if (isFavorited) {
      favoritesStorage.remove(realId);
      message.success("Removido dos favoritos!");
      setIsFavorited(false);
    } else {
      favoritesStorage.add({ ...brainrot, id: realId });
      message.success("Adicionado aos favoritos!");
      setIsFavorited(true);
    }
  };

  const canEdit = () => {
    return brainrot && brainrot.userCreated && !brainrot.isFromAPI;
  };

  const handleEdit = () => {
    if (canEdit()) {
      const realId = getRealId(brainrot.id);
      window.location.href = `/brainrots/${realId}/edit`;
    } else {
      message.warning("Apenas brainrots criados por você podem ser editados!");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!brainrot) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <h3>Brainrot não encontrado</h3>
          <Link href="/brainrots">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Voltar para lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Cabeçalho com botão voltar */}
      <div className={styles.header}>
        <Link href="/brainrots">
          <Button icon={<ArrowLeftOutlined />} className={styles.backButton}>
            Voltar
          </Button>
        </Link>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Detalhes do Brainrot</h2>
          <div className={styles.headerActions}>
            <Button
              icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleFavorite}
              className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ""}`}
            >
              {isFavorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            </Button>
            {canEdit() && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                className={styles.editButton}
              >
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Card com foto e info principal */}
        <Card className={styles.mainCard}>
          <div className={styles.brainrotHeader}>
            {brainrot.img_1 ? (
              <Image
                src={brainrot.img_1}
                alt={brainrot.name}
                width={300}
                height={400}
                className={styles.brainrotImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>🧠</span>
                <p>Imagem não disponível</p>
              </div>
            )}
            <div className={styles.brainrotInfo}>
              <h3 className={styles.brainrotName}>{brainrot.name || "Desconhecido"}</h3>
              <div className={styles.tags}>
                {brainrot.isFromAPI && <Tag color="blue">API</Tag>}
                {brainrot.userCreated && <Tag color="green">Seu</Tag>}
                {brainrot.rarity_1 && <Tag color="gold">{brainrot.rarity_1}</Tag>}
                {isFavorited && <Tag color="red">❤️ Favorito</Tag>}
              </div>
            </div>
          </div>
        </Card>

        {/* Informações detalhadas do Brainrot */}
        <Card
          title={
            <>
              <EnvironmentOutlined /> Informações Completas
            </>
          }
          className={styles.detailCard}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="ID" span={2}>
              {getRealId(brainrot.id)}
            </Descriptions.Item>
            <Descriptions.Item label="Nome" span={2}>
              {brainrot.name || "Desconhecido"}
            </Descriptions.Item>
            <Descriptions.Item label="Descrição" span={2}>
              {brainrot.description || "Descrição não disponível"}
            </Descriptions.Item>
            <Descriptions.Item label="Custo">
              ${brainrot.cost || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Renda">
              ${brainrot.income || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Raridade">
              {brainrot.rarity_1 || "Comum"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {brainrot.concluida ? "✅ Concluído" : "⏳ Em andamento"}
            </Descriptions.Item>
            <Descriptions.Item label="Região">
              {brainrot.region || "Região não especificada"}
            </Descriptions.Item>
            <Descriptions.Item label="Localização">
              {brainrot.location || "Localização não especificada"}
            </Descriptions.Item>
            <Descriptions.Item label="Origem">
              {brainrot.isFromAPI ? "Dados da API" : "Criado localmente"}
            </Descriptions.Item>
            <Descriptions.Item label="Pode Editar">
              {canEdit() ? "✅ Sim" : "❌ Não"}
            </Descriptions.Item>
            <Descriptions.Item label="Criado em" span={2}>
              {brainrot.createdAt ? new Date(brainrot.createdAt).toLocaleString('pt-BR') : "Data não disponível"}
            </Descriptions.Item>
            {brainrot.updatedAt && (
              <Descriptions.Item label="Atualizado em" span={2}>
                {new Date(brainrot.updatedAt).toLocaleString('pt-BR')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </div>
    </div>
  );
}
