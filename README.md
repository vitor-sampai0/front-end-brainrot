# 🧠 Steal a Brainrot

Uma aplicação web moderna desenvolvida em **Next.js** para explorar, visualizar e gerenciar uma coleção de "brainrots" com interface elegante e funcionalidades completas.

## ✨ Características

- **Interface Moderna**: Design responsivo com gradientes e efeitos visuais
- **Coleção de Brainrots**: Visualize brainrots com imagens, raridade e detalhes
- **Sistema de Favoritos**: Marque e gerencie seus brainrots favoritos
- **Integração com API**: Suporte para dados externos via API REST
- **Páginas Dinâmicas**: Sistema de roteamento dinâmico para detalhes
- **Paginação**: Navegação eficiente através de grandes coleções
- **Gerenciamento de Dados**: Import/export de dados e exemplos pré-definidos

## 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) com React 19
- **UI Framework**: [Ant Design 5.27.3](https://ant.design/)
- **Styling**: CSS Modules com design system personalizado
- **HTTP Client**: [Axios 1.11.0](https://axios-http.com/)


## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── about/                 # Página sobre o desenvolvedor
│   ├── brainrots/            # Listagem de brainrots
│   │   └── [id]/             # Página de detalhes dinâmica
│   ├── favorites/            # Página de favoritos
│   ├── globals.css           # Estilos globais
│   ├── layout.jsx            # Layout principal
│   └── page.jsx              # Página inicial
├── hooks/
│   └── useLocalStorage.js    # Hook personalizado para localStorage
└── public/                   # Arquivos estáticos
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

## 🎯 Funcionalidades

### 🏠 Página Inicial
- Landing page atrativa com seções informativas
- Call-to-action para explorar brainrots
- Navegação intuitiva

### 📋 Listagem de Brainrots
- Grid responsivo de cards com brainrots
- Sistema de favoritos com ícone de coração
- Paginação configurável (4, 8, 12, 16 itens)
- Estatísticas em tempo real (API, Locais, Favoritos, Total)
- Botão "Ver Detalhes" para cada item

### 🔍 Detalhes do Brainrot
- Página completa com todas as informações
- Exibição de imagem, nome, descrição, custo, renda
- Tags de identificação (API, Seu, Raridade, Favorito)
- Sistema de favoritos integrado
- Informações de criação e atualização

### ❤️ Sistema de Favoritos
- Adicionar/remover favoritos com um clique
- Página dedicada para favoritos
- Indicadores visuais nos cards

### 💾 Gerenciamento de Dados
- Import/export de dados em JSON
- Carregamento de dados de exemplo
- Limpeza de todos os dados
- Armazenamento local robusto

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/vitor-sampai0/front-end-brainrot.git
cd front-end-brainrot
```

2. **Instale as dependências**
```bash
npm install

```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev

```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📄 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com Turbopack


## 🎨 Design System

O projeto utiliza um design system personalizado com:
- **Cores**: Gradientes roxo/azul (#667eea → #764ba2)
- **Tipografia**: Inter font family
- **Componentes**: Ant Design customizado
- **Efeitos**: Backdrop blur, sombras e transições suaves
- **Responsividade**: Mobile-first design

## 🔌 Integração com API

A aplicação suporta integração com API externa:
- **Endpoint esperado**: `https://front-end-brainrot.vercel.app/brainrots`
- **Formato**: JSON com campos id, name, description, cost, income, etc.

## 👤 Sobre o Desenvolvedor

**Vitor Sampaio** - 17 anos  
Estudante SENAI apaixonado por tecnologia e jogos.

⭐ Se você gostou do projeto, considere dar uma estrela no repositório!
