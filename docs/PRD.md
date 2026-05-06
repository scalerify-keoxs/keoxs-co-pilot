# CAHIER DES CHARGES (PRD) : PROJET "KEOXS CO-PILOT"
**Statut** : Open Source / Local-First AI Agent
**Destinataire** : Équipe de Développement (Google Antigravity)
**Version** : 1.0

## 1. VISION & OBJECTIFS DU PROJET
*   **Problème** : Les vendeurs Amazon FBA sont noyés sous des fichiers Excel illisibles. Les agences coûtent cher et les logiciels SaaS actuels posent des problèmes de confidentialité des données financières.
*   **Solution** : Créer un "Micro-Agent IA" open source, installable localement sur PC/Mac. Il agit comme un Directeur E-commerce de poche : il ingère les données brutes par simple "Drag & Drop", croise les métriques et recrache des recommandations stratégiques et des fichiers d'exécution ("Bulk files") prêts à être uploadés sur Amazon.
*   **Promesse** : 100% de la donnée reste sur l'ordinateur du vendeur (Privacy First).

## 2. ARCHITECTURE TECHNIQUE & STACK RECOMMANDÉE
Pour garantir une installation simple et une exécution locale :
*   **Frontend / Desktop App** : Electron.js ou Tauri (pour la légèreté). Interface fluide, typée "SaaS moderne" mais tournant en local.
*   **Backend / Data Crunching** : Python (Pandas/NumPy) pour le traitement ultra-rapide des fichiers CSV/Excel d'Amazon.
*   **Moteur IA (Cerveau)** :
    *   *Option 1 (100% Local)* : Intégration avec Ollama pour faire tourner des modèles légers (Llama-3, Mistral) directement sur la machine du vendeur.
    *   *Option 2 (API)* : Système "Bring Your Own Key" (BYOK) où le vendeur rentre sa clé API OpenAI ou Anthropic s'il souhaite plus de puissance sans gérer d'IA locale.
*   **Base de données** : SQLite locale. Aucune donnée ne transite vers le cloud.

## 3. PARCOURS UTILISATEUR & INTERFACE (UX/UI)
Le logiciel ne doit pas ressembler à un tableur, mais à un "Docteur" qui pose un diagnostic.
*   **L'Écran d'Accueil "The Drop Zone"** : Un grand encart pour glisser-déposer les fichiers (STR, Business Reports, JSON de scraping).
*   **Le Dashboard Tricolore (Triage)** : Une fois les données digérées, l'UI se sépare en 3 colonnes d'action :
    *   🔴 **URGENCES (Bleeding)** : Pertes d'argent directes à couper, alertes de stock critique.
    *   🟠 **OPTIMISATIONS** : Ajustements d'enchères, suggestions de réécriture de la page (SEO).
    *   🟢 **OPPORTUNITÉS** : Nouveaux mots-clés trouvés, concurrents vulnérables à attaquer.
*   **Bouton "Export Execution"** : Génère automatiquement le fichier .xlsx au format "Bulk Operations" d'Amazon. Le vendeur n'a rien à coder ni à taper, juste à uploader le fichier généré dans Seller Central.

## 4. SPÉCIFICATIONS DES MODULES (CORE FEATURES)

### MODULE 1 : Ingestion & Nettoyage (Le Parseur)
*   **Fonctionnalité** : L'agent doit reconnaître automatiquement la structure des rapports standards d'Amazon (Search Term Report, Business Report, Search Query Performance) et les fichiers externes (JSON/CSV SmartScout, Jungle Scout).
*   **Règles de nettoyage** : Fusion automatique des données par ASIN, conversion des devises (si besoin), harmonisation des formats de dates, calcul des métriques manquantes (ex: ACOS = Dépense / Ventes).

### MODULE 2 : Le Gardien Financier (Unit Economics Engine)
*   **Input Vendeur** : Le vendeur renseigne manuellement son COGS (Coût de fabrication).
*   **Algo "Break-Even"** : L'app scrape les frais FBA dans les rapports et calcule automatiquement la Marge Brute et le Break-Even ACOS (Ex: 47%).
*   **Algo "Stop the Bleeding"** : L'IA scanne le STR. Tout mot-clé ayant : `[Dépense > Break-Even Margin] AND [Ventes = 0]` est mis dans la colonne 🔴 URGENCE avec un bouton "Générer fichier d'exclusion exacte".

### MODULE 3 : Le Sniper PPC (Moteur de Rentabilité)
*   **Algo "Harvesting" (Récolte)** : Tout terme de recherche client issu des campagnes Auto/Broad ayant : `[ACOS < Break-Even ACOS] AND [Commandes >= 1]` est mis dans la colonne 🟢 OPPORTUNITÉ.
    *   *Action proposée* : L'IA propose de l'ajouter en "Ciblage Exact" avec une enchère = CPC moyen historique + 10%.
*   **Algo "Conquesting"** : L'IA croise le fichier JSON des concurrents et le STR. Elle identifie les ASINs concurrents générant du trafic.
    *   *Action proposée* : L'IA suggère des ciblages produits (ASIN) avec des enchères calculées pour garantir la rentabilité, basées sur l'écart de prix entre notre produit et le concurrent.

### MODULE 4 : Le Sémanticien (Conversion & Copywriting)
*   **Analyse de Gap Sémantique** : L'IA compare les termes à haut volume du Search Query Performance avec les mots utilisés dans le titre du vendeur.
*   **Générateur LLM** : Via un prompt "système" pré-configuré dans le code (reprenant notre méthode de déclencheurs psychologiques : Zéro Sucre, Zinc, Parent Approved), l'IA propose une réécriture du Titre et des Bullet Points.
*   **Recommandation Visuelle** : Si un mot clé comme "Powder" ou "Scoop" est en forte croissance, l'IA affiche une recommandation texte : "Alerte Conversion : Assurez-vous que votre image principale montre la poudre et la dosette."

### MODULE 5 : Le Contrôleur de Stock (Dynamic Pricing)
*   **Algo "Runway"** : `Stock Actuel / Moyenne des Ventes des 7 derniers jours = Jours de stock restants (Runway)`.
*   **Système d'Alerte & Prix** :
    *   *Si Runway < 30 jours* : Alerte 🔴 URGENCE.
    *   *Action IA* : L'IA recommande une hausse de prix de 15 à 30% et la mise en pause des campagnes PPC de conquête pour préserver le stock et maximiser la marge nette unitaire (la fameuse "Stratégie de Freinage").

## 5. FORMATS DE SORTIE (DELIVERABLES DE L'APPLICATION)
L'outil ne doit pas juste donner des conseils, il doit mâcher le travail d'exécution.
*   **Fichiers Bulk (.xlsx)** : Fichiers générés exactement selon la matrice d'upload d'Amazon Advertising (Colonnes: Record Type, Campaign, Ad Group, Keyword, Match Type, Bid, State).
*   **Listing Copy (.txt / Markdown)** : Les textes prêts à être copiés dans le backend Seller Central (Titre, Bullets, Description, Generic Keywords/Search Terms).
*   **Rapport de Synthèse (PDF)** : Un résumé exécutif généré automatiquement (similaire à nos rapports pour "Sara" ou les "Investisseurs") avec l'évolution de l'ACOS et du CVR pour le reporting du vendeur.

## Phase 1
L'architecture doit être modulaire. Commencer par construire le Module 1 (Ingestion) et le Module 2 (Le Gardien Financier). C'est le "Core" qui apportera la valeur immédiate aux vendeurs en stoppant leurs pertes. L'IA générative (Module 4) viendra se brancher par-dessus une fois la data sécurisée et nettoyée. L'objectif de la V1 est d'avoir l'outil de "Fact-Checking" de rentabilité le plus rapide du marché.
