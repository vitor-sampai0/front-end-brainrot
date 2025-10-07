"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { 
  Card, Spin, Pagination, Button, Modal, Dropdown, Tag, message 
} from "antd";

import { 
  EyeOutlined, HeartOutlined, HeartFilled, 
  SettingOutlined, PlusOutlined, 
  DownloadOutlined, UploadOutlined, DatabaseOutlined, ClearOutlined 
} from "@ant-design/icons";

import styles from "./brainrots.module.css";

// Importações das funções de storage
import { brainrotStorage, favoritesStorage } from "@/hooks/useLocalStorage";

export default function BrainrotsPage() {
  const [brainrots, setBrainrots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [favorites, setFavorites] = useState([]);
  const [apiBrainrots, setApiBrainrots] = useState([]);
  const [localBrainrots, setLocalBrainrots] = useState([]);

  useEffect(() => {
    loadBrainrots();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = favoritesStorage.getAll();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  const loadBrainrots = async () => {
    setLoading(true);
    try {
      // Carregar da API
      let apiData = [];
      try {
        const response = await axios.get("http://localhost:4000/brainrot");
        apiData = (response.data || []).map(item => ({
          ...item,
          isFromAPI: true,
          userCreated: false,
          id: `api_${item.id}`,
        }));
        setApiBrainrots(apiData);
      } catch {
        message.warning("API não disponível - mostrando apenas brainrots locais");
        setApiBrainrots([]);
      }
      const combined = [...apiData, ...localData];
      setBrainrots(combined);

    } catch (error) {
      console.error("Erro ao buscar brainrots:", error);
      setBrainrots([]);
    } finally {
      setLoading(false);
    }
  };

  const getRealId = (id) => {
    if (typeof id === "string" && (id.startsWith("api_") || id.startsWith("local_"))) {
      return id.split("_")[1];
    }
    return id;
  };

  const canEdit = (brainrot) => brainrot.userCreated && !brainrot.isFromAPI;

  const handleEdit = (brainrot) => {
    if (canEdit(brainrot)) {
      window.location.href = `/brainrots/${getRealId(brainrot.id)}/edit`;
    } else {
      message.warning("Apenas brainrots criados por você podem ser editados!");
    }
  };

  const handleDelete = (brainrot) => {
    if (!canEdit(brainrot)) {
      return message.warning("Apenas brainrots criados por você podem ser excluídos!");
    }

    Modal.confirm({
      title: "Confirmar Exclusão",
      content: `Excluir "${brainrot.name}"? Esta ação não pode ser desfeita.`,
      okText: "Excluir",
      cancelText: "Cancelar",
      okType: "danger",
      onOk: () => {
        const realId = getRealId(brainrot.id);
        const success = brainrotStorage.delete(realId);
        if (success) {
          message.success("Brainrot excluído!");
          favoritesStorage.remove(realId);
          loadBrainrots();
          loadFavorites();
        } else {
          message.error("Erro ao excluir brainrot.");
        }
      },
    });
  };

  const handleFavorite = (brainrot) => {
    const realId = getRealId(brainrot.id);
    const isFavorited = favoritesStorage.isFavorite(realId);

    if (isFavorited) {
      favoritesStorage.remove(realId);
      message.success("Removido dos favoritos!");
    } else {
      favoritesStorage.add({ ...brainrot, id: realId });
      message.success("Adicionado aos favoritos!");
    }

    loadFavorites();
    if (canEdit(brainrot)) {
      brainrotStorage.update(realId, { ...brainrot, favorite: !isFavorited });
    }
    setBrainrots(prev =>
      prev.map(item =>
        item.id === brainrot.id ? { ...item, favorite: !isFavorited } : item
      )
    );
  };

  const handleDataManagement = (key) => {
    switch (key) {
      case "export":
        exportData();
        message.success("Dados exportados!");
        break;
      case "import":
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              await importData(file);
              message.success("Dados importados!");
              loadBrainrots();
              loadFavorites();
            } catch (error) {
              message.error("Erro ao importar dados!");
            }
          }
        };
        input.click();
        break;
      case "sample":
        Modal.confirm({
          title: "Carregar dados de exemplo",
          content: "Isso irá adicionar brainrots de exemplo ao seu sistema. Deseja continuar?",
          onOk: () => {
            initializeSampleData();
            message.success("Dados de exemplo carregados!");
            loadBrainrots();
          },
        });
        break;
      case "clear":
        Modal.confirm({
          title: "Limpar todos os dados",
          content: "Isso irá remover TODOS os seus brainrots e favoritos. Esta ação não pode ser desfeita!",
          okText: "Limpar",
          cancelText: "Cancelar",
          okType: "danger",
          onOk: () => {
            brainrotStorage.clear();
            favoritesStorage.saveAll([]);
            message.success("Dados limpos!");
            loadBrainrots();
            loadFavorites();
          },
        });
        break;
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentBrainrots = brainrots.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Spin size="large" />
          <p className={styles.loadingText}>Carregando brainrots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Brainrots Collection</h1>
          <p className={styles.subtitle}>Utilizando API Própria</p>
        </div>
        <div className={styles.headerActions}>
          <Dropdown
            menu={{
              items: [
                { key: "export", icon: <DownloadOutlined />, label: "Exportar Dados" },
                { key: "import", icon: <UploadOutlined />, label: "Importar Dados" },
                { key: "sample", icon: <DatabaseOutlined />, label: "Carregar Exemplos" },
                { type: "divider" },
                { key: "clear", icon: <ClearOutlined />, label: "Limpar Dados", danger: true },
              ],
              onClick: ({ key }) => handleDataManagement(key),
            }}
            placement="bottomRight"
          >
            <Button icon={<SettingOutlined />} className={styles.dataButton}>
              Gerenciar Dados
            </Button>
          </Dropdown>

        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{apiBrainrots.length}</span>
          <span className={styles.statLabel}>Da API</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{favorites.length}</span>
          <span className={styles.statLabel}>Favoritos</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{brainrots.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      {/* Cards */}
      <div className={styles.brainrotsGrid}>
        {currentBrainrots.map((brainrot, index) => {
          const realId = getRealId(brainrot.id);
          const isFavorited = favoritesStorage.isFavorite(realId);

          return (
            <Card
              key={brainrot.id}
              className={styles.brainrotCard}
              cover={
                brainrot.img_1 ? (
                  <div className={styles.imageContainer}>
                    <Image src={brainrot.img_1} alt={brainrot.name} width={300} height={200} />
                    <button
                      className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ""}`}
                      onClick={() => handleFavorite(brainrot)}
                    >
                      {isFavorited ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                  </div>
                ) : (
                  <div className={styles.imagePlaceholder}>🧠</div>
                )
              }
              actions={[
                <Link href={`/brainrots/${realId}`} key="view">
                  <Button type="text" icon={<EyeOutlined />}>Ver Detalhes</Button>
                </Link>
              ]}
            >
              <h3>{brainrot.name}</h3>
              <p>Custo: ${brainrot.cost || 0}</p>
              <p>Renda: ${brainrot.income || 0}</p>
              <p>ID: {realId}</p>
              {brainrot.isFromAPI && <Tag color="blue">API</Tag>}
              {brainrot.userCreated && <Tag color="green">Seu</Tag>}
            </Card>
          );
        })}
      </div>

      {/* Paginação */}
      {brainrots.length > 0 && (
        <Pagination
          current={currentPage}
          total={brainrots.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          onShowSizeChange={handlePageSizeChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} brainrots`}
          pageSizeOptions={["4", "8", "12", "16"]}
        />
      )}
    </div>
  );
}
