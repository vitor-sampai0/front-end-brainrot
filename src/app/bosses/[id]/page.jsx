"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import styles from "./[id].module.css";
import { Card, Spin, Button, Descriptions } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined } from "@ant-design/icons";

export default function BrainrotDetailsPage({ params }) {
  const [brainrot, setBrainrot] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBrainrot = async (brainrotID) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/brainrot/${brainrotID}`
      );
      setBrainrot(response.data.data); // Ajuste para acessar o campo correto
    } catch (error) {
      console.log("Erro ao buscar brainrot:", error);
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
          <Link href="/bosses">
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
        <Link href="/bosses">
          <Button icon={<ArrowLeftOutlined />} className={styles.backButton}>
            Voltar
          </Button>
        </Link>
        <h2 className={styles.title}>Detalhes dos Brainrots</h2>
      </div>

      <div className={styles.contentWrapper}>
        {/* Card com foto e info principal */}
        <Card className={styles.mainCard}>
          <div className={styles.bossHeader}>
            {brainrot.image ? (
              <Image
                src={brainrot.image}
                alt={brainrot.name}
                width={400}
                height={192}
                className="mt-2 w-60 h-50 object-cover rounded-md"
              />
            ) : (
              <div className="mt-2 w-60 h-50 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                Imagem não encontrada
              </div>
            )}
            <div className={styles.bossInfo}>
              <h3 className={styles.bossName}>{brainrot.name || "Desconhecido"}</h3>
            </div>
          </div>
        </Card>

        {/* Informações do Boss */}
        <Card
          title={
            <>
              <EnvironmentOutlined /> Informações dos Brainrots
            </>
          }
          className={styles.detailCard}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Nome do Brainrot">
              {brainrot.name || "Desconhecido"}
            </Descriptions.Item>

          </Descriptions>
        </Card>

        {/* Localização do boss */}
        <Card
          title={
            <>
              <EnvironmentOutlined /> Localização do boss
            </>
          }
          className={styles.detailCard}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Região">
              {brainrot.region || "Região Desconhecida"}
            </Descriptions.Item>
            <Descriptions.Item label="Localização">
              {brainrot.location || "Localização Desconhecida"}
            </Descriptions.Item>
            <Descriptions.Item label="Descrição">
              {brainrot.description || "Descrição Desconhecida"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
}
