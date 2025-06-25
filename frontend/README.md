# PRAXXIO

*Votre assistant IA personnel, collaboratif et intelligent.*

## 🌟 Description

PRAXXIO est une application web de chat IA conçue pour être un assistant personnel intelligent. Elle utilise des modèles de langage puissants via l'API OpenRouter pour fournir des conversations fluides, contextuelles et utiles. L'interface est moderne, réactive et conçue pour une expérience utilisateur exceptionnelle, avec des fonctionnalités collaboratives et d'intelligence augmentée en cours de développement.

## ✨ Fonctionnalités

-   **💬 Chat Intelligent :** Conversez avec des modèles de pointe comme Llama 3.3 70B Instruct.
-   **💾 Persistance des Données :** Les conversations et les paramètres sont sauvegardés localement dans votre navigateur, avec un système de session utilisateur simple.
-   **🎨 Interface Élégante :**
    -   Design moderne et entièrement responsive.
    -   Thème sombre et clair personnalisable.
    -   Animations fluides avec Framer Motion pour une UX améliorée.
-   **🚀 Fonctionnalités Avancées :**
    -   **Mise en Forme Markdown :** Les réponses de l'IA supportent le Markdown pour une meilleure lisibilité.
    -   **Coloration Syntaxique :** Les blocs de code sont mis en évidence.
    -   **Copier en un clic :** Copiez facilement les réponses de l'IA.
    -   **Gestion de Chat :** Créez, supprimez, importez et exportez vos historiques de conversation.
-   **🔧 Personnalisation & Intelligence Augmentée :**
    -   Configurez votre propre clé API OpenRouter et choisissez votre modèle.
    -   **Mode Expert :** Activez le raisonnement pas-à-pas (Chain-of-Thought) pour des réponses plus détaillées.
    -   **Base de Connaissances :** Uploadez des documents pour enrichir le contexte de l'IA (en développement).
    -   **Mémoire à Long Terme :** Sauvegardez des informations clés que l'IA pourra réutiliser (en développement).
-   **🌐 Fonctionnalités Collaboratives (En développement) :**
    -   Partage de conversations en temps réel.
    -   Tableau blanc intégré pour la visualisation d'idées.

## 🛠️ Stack Technique

| Catégorie             | Technologies                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Outil de Build**    | Vite                                                                                           |
| **Framework**         | React 18.2                                                                                     |
| **Routage**           | React Router 6                                                                                 |
| **Style**             | TailwindCSS                                                                                    |
| **Composants UI**     | shadcn/ui, Radix UI                                                                            |
| **Icônes**            | Lucide React                                                                                   |
| **Animations**        | Framer Motion                                                                                  |
| **Rendu Markdown**    | `react-markdown` avec `react-syntax-highlighter`                                               |
| **Persistance**       | LocalStorage                                                                                   |
| **API IA**            | [OpenRouter](https://openrouter.ai/)                                                           |

## 🚀 Démarrage

Suivez ces étapes pour lancer le projet en local.

### Prérequis

-   [Node.js](https://nodejs.org/) (version 20.x ou supérieure)
-   [npm](https://www.npmjs.com/)

### Installation

1.  Clonez le dépôt (ou téléchargez les fichiers).

2.  Installez les dépendances :
    ```bash
    npm install
    ```

### Configuration

1.  Obtenez une clé API sur [OpenRouter](https://openrouter.ai/keys).
2.  Lancez l'application et cliquez sur l'icône des paramètres (⚙️).
3.  Entrez votre clé API dans le champ prévu et sauvegardez.

### Lancer l'application

```bash
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:5173` (ou un port similaire).

## Auteur

**Archange Elie Yatte**
-   Email : [codelie14@gmail.com](mailto:codelie14@gmail.com)
-   GitHub : [@codelie14](https://github.com/codelie14)