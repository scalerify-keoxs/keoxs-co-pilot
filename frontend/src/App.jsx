import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

const translations = {
  en: {
    title: "Keoxs Co-Pilot",
    subtitle: "1-Click Amazon PPC Audit & Optimization",
    configTitle: "Configuration",
    apiKeyLabel: "Google AI Studio API Key",
    apiKeyHelp: "Your key remains 100% local.",
    apiKeyPlaceholder: "AIzaSy...",
    salePriceLabel: "Average Sale Price ($)",
    cogsLabel: "Average COGS ($)",
    fbaFeesLabel: "FBA Fees ($)",
    wastedSpendLabel: "Wasted Spend Threshold (Clicks)",
    wastedSpendHelp: "Default: 10. Decisions are stricter above this threshold.",
    aiModelLabel: "Select AI Model (LLM)",
    fetchModelsBtn: "🔄 Fetch Models",
    bidLabel: "Bid Action:",
    reasonLabel: "Reason:",
    aiTab: "AI Brain",
    aiContextLabel: "Historical Context:",
    aiContextPlaceholder: "E.g. We are in the scaling phase. We increased bids last week. Max CVR is 12%.",
    aiBtn: "Generate Strategic Plan",
    aiProcessing: "The AI is analyzing the strategy...",
    startButton: "Start Co-Pilot",
    configInProgress: "Configuration in progress...",
    configSuccess: "Configuration successful!",
    errorPrefix: "Error: ",
    backendError: "Local backend connection error.",
    dropZoneTitle: "Drop Zone 🚀",
    dropZoneSubtitle: "Agent is ready. Drag and drop your Amazon files here to start the diagnostic.",
    dropZoneText: "Drag your reports (.csv, .xlsx) here",
    languageSelect: "Language",
    bleedingTitle: "URGENCIES 🔴",
    bleedingSubtitle: "Money bleeding detected",
    optimTitle: "OPTIMIZATIONS 🟠",
    optimSubtitle: "Performance tweaks",
    opportTitle: "OPPORTUNITIES 🟢",
    opportSubtitle: "Growth potential",
    processing: "Analyzing data...",
    actionLabel: "Action",
    spendLabel: "Spend",
    salesLabel: "Sales",
    suggestedBid: "Suggested Bid:",
    ordersLabel: "Orders:",
    acosLabel: "Current ACOS:",
    harvestAction: "Harvest (Exact Match)",
    noOpport: "Search for your golden nuggets!",
    modifyConfig: "Modify Configuration",
    resetConfig: "Reset & Logout",
    newAnalysis: "New Analysis",
    fullDataTitle: "Full Data Audit",
    campaignLabel: "Campaign",
    clicksLabel: "Clicks",
    acosLabel: "ACOS",
    ordersLabel: "Orders",
    summaryTab: "ToDo List",
    fullDataTab: "Full Audit",
    aiHistoryHelp: "The history of your last {count} analyses will be automatically injected to help the AI.",
    noUrgencies: "No urgencies detected.",
    noAdjustments: "No bid adjustments required.",
    goldenNugget: "GOLDEN NUGGET 💎",
    noAuditDataError: "⚠️ ERROR: No audit data received from server.",
    exportingBtn: "⏳ Exporting...",
    exportBtn: "📥 Export Bulk Actions",
    termHeader: "Term",
    campaignHeader: "Campaign",
    clicksHeader: "Clicks",
    ordersHeader: "Orders",
    spendHeader: "Spend",
    salesHeader: "Sales",
    acosHeader: "ACOS",
    actionHeader: "Action",
    exportPdfBtn: "Export PDF Report"
  },
  fr: {
    title: "Keoxs Co-Pilot",
    subtitle: "Audit & Optimisation Amazon PPC en 1 Clic",
    configTitle: "Configuration",
    apiKeyLabel: "Clé API Google AI Studio",
    apiKeyHelp: "Votre clé reste 100% en local.",
    apiKeyPlaceholder: "AIzaSy...",
    salePriceLabel: "Prix de vente moyen ($)",
    cogsLabel: "COGS moyen ($)",
    fbaFeesLabel: "Frais FBA ($)",
    wastedSpendLabel: "Seuil de gaspillage (Clics)",
    wastedSpendHelp: "Par défaut : 10 clics sans vente = Exclusion.",
    aiModelLabel: "Sélectionnez le Modèle IA (LLM)",
    fetchModelsBtn: "🔄 Charger les modèles",
    bidLabel: "Action Enchère :",
    reasonLabel: "Raison :",
    aiTab: "Cerveau IA",
    aiContextLabel: "Contexte Historique :",
    aiContextPlaceholder: "Ex: Nous sommes en phase de scaling. Bids augmentés la semaine dernière...",
    aiBtn: "Générer le Plan Stratégique",
    aiProcessing: "L'IA analyse la stratégie...",
    startButton: "Démarrer le Co-Pilot",
    configInProgress: "Configuration en cours...",
    configSuccess: "Configuration réussie !",
    errorPrefix: "Erreur : ",
    backendError: "Erreur de connexion au backend local.",
    dropZoneTitle: "Drop Zone 🚀",
    dropZoneSubtitle: "L'agent est prêt. Glissez vos fichiers Amazon ici pour lancer le diagnostic.",
    dropZoneText: "Glissez vos rapports (.csv, .xlsx) ici",
    languageSelect: "Langue",
    bleedingTitle: "URGENCES 🔴",
    bleedingSubtitle: "Pertes d'argent détectées",
    optimTitle: "OPTIMISATIONS 🟠",
    optimSubtitle: "Améliorations de performance",
    opportTitle: "OPPORTUNITÉS 🟢",
    opportSubtitle: "Potentiel de croissance",
    processing: "Analyse des données...",
    actionLabel: "Action",
    spendLabel: "Dépenses",
    salesLabel: "Ventes",
    suggestedBid: "Enchère conseillée :",
    ordersLabel: "Commandes :",
    acosLabel: "ACOS actuel :",
    harvestAction: "Récolter (Ciblage Exact)",
    noOpport: "En attente de vos pépites !",
    modifyConfig: "Modifier la configuration",
    resetConfig: "Réinitialiser l'agent",
    newAnalysis: "Nouvelle Analyse",
    fullDataTitle: "Audit Complet des Données",
    campaignLabel: "Campagne",
    clicksLabel: "Clics",
    acosLabel: "ACOS",
    ordersLabel: "Commandes",
    summaryTab: "Actions",
    fullDataTab: "Audit Complet",
    aiHistoryHelp: "L'historique de vos {count} dernières analyses sera automatiquement injecté pour aider l'IA.",
    noUrgencies: "Aucune urgence détectée.",
    noAdjustments: "Aucun ajustement d'enchère requis.",
    goldenNugget: "PÉPITE 💎",
    noAuditDataError: "⚠️ ERREUR : Aucune donnée d'audit reçue du serveur.",
    exportingBtn: "⏳ Exportation...",
    exportBtn: "📥 Exporter les Actions",
    termHeader: "Terme",
    campaignHeader: "Campagne",
    clicksHeader: "Clics",
    ordersHeader: "Commandes",
    spendHeader: "Dépenses",
    salesHeader: "Ventes",
    acosHeader: "ACOS",
    actionHeader: "Action",
    exportPdfBtn: "Exporter le rapport PDF"
  },
  it: {
    title: "Keoxs Co-Pilot",
    subtitle: "Audit e ottimizzazione Amazon PPC in 1 clic",
    configTitle: "Configurazione",
    apiKeyLabel: "Chiave API Google AI Studio",
    apiKeyHelp: "La tua chiave rimane locale al 100%.",
    apiKeyPlaceholder: "AIzaSy...",
    salePriceLabel: "Prezzo di vendita medio ($)",
    cogsLabel: "COGS medio ($)",
    fbaFeesLabel: "Commissioni FBA ($)",
    startButton: "Avvia Co-Pilot",
    configInProgress: "Configurazione in corso...",
    configSuccess: "Configurazione completata!",
    errorPrefix: "Errore: ",
    backendError: "Errore di connessione al backend locale.",
    dropZoneTitle: "Drop Zone 🚀",
    dropZoneSubtitle: "L'agente è pronto. Trascina qui i tuoi file Amazon per avviare la diagnostica.",
    dropZoneText: "Trascina qui i tuoi rapporti (.csv, .xlsx)",
    languageSelect: "Lingua",
    bleedingTitle: "URGENZE 🔴",
    bleedingSubtitle: "Perdite di denaro rilevate",
    optimTitle: "OTTIMIZZAZIONI 🟠",
    optimSubtitle: "Miglioramenti delle prestazioni",
    opportTitle: "OPPORTUNITÀ 🟢",
    opportSubtitle: "Potenziale di crescita",
    processing: "Analisi dei dati...",
    actionLabel: "Azione",
    spendLabel: "Spesa",
    salesLabel: "Vendite",
    suggestedBid: "Offerta consigliata:",
    ordersLabel: "Ordini:",
    acosLabel: "ACOS attuale:",
    harvestAction: "Raccogli (Corrispondenza Esatta)",
    noOpport: "Cerca le tue pepite d'oro!",
    modifyConfig: "Modifica configurazione",
    resetConfig: "Reset & Logout",
    newAnalysis: "Nuova Analisi",
    fullDataTitle: "Audit Completo dei Dati",
    campaignLabel: "Campagna",
    clicksLabel: "Clic",
    summaryTab: "Azioni",
    fullDataTab: "Audit Completo",
    wastedSpendLabel: "Soglia di spreco (Clic)",
    wastedSpendHelp: "Default: 10. Le decisioni sono più rigorose oltre questa soglia.",
    aiModelLabel: "Seleziona Modello IA (LLM)",
    fetchModelsBtn: "🔄 Carica modelli",
    reasonLabel: "Ragione:",
    aiTab: "Cervello IA",
    aiContextLabel: "Contesto storico:",
    aiContextPlaceholder: "Es: Siamo in fase di scaling...",
    aiBtn: "Genera piano strategico",
    aiProcessing: "L'IA sta analizzando la strategia...",
    aiHistoryHelp: "La cronologia delle tue ultime {count} analisi sarà iniettata automaticamente per aiutare l'IA.",
    noUrgencies: "Nessuna urgenza rilevata.",
    noAdjustments: "Nessuna regolazione dell'offerta richiesta.",
    goldenNugget: "PEPITA 💎",
    noAuditDataError: "⚠️ ERRORE: Nessun dato di audit ricevuto dal server.",
    exportingBtn: "⏳ Esportazione...",
    exportBtn: "📥 Esporta Azioni",
    termHeader: "Termine",
    campaignHeader: "Campagna",
    clicksHeader: "Clic",
    ordersHeader: "Ordini",
    spendHeader: "Spesa",
    salesHeader: "Vendite",
    acosHeader: "ACOS",
    actionHeader: "Azione",
    exportPdfBtn: "Esporta rapporto PDF"
  },
  es: {
    title: "Keoxs Co-Pilot",
    subtitle: "Auditoría y optimización de Amazon PPC en 1 clic",
    configTitle: "Configuración",
    apiKeyLabel: "Clave API de Google AI Studio",
    apiKeyHelp: "Su clave permanece 100% local.",
    apiKeyPlaceholder: "AIzaSy...",
    salePriceLabel: "Precio de venta medio ($)",
    cogsLabel: "COGS medio ($)",
    fbaFeesLabel: "Tarifas FBA ($)",
    startButton: "Iniciar Co-Pilot",
    configInProgress: "Configuración en curso...",
    configSuccess: "¡Configuración exitosa!",
    errorPrefix: "Error: ",
    backendError: "Error de conexión al backend local.",
    dropZoneTitle: "Drop Zone 🚀",
    dropZoneSubtitle: "El agente está listo. Arrastre sus archivos de Amazon aquí para iniciar el diagnóstico.",
    dropZoneText: "Arrastre sus informes (.csv, .xlsx) aquí",
    languageSelect: "Idioma",
    bleedingTitle: "URGENCIAS 🔴",
    bleedingSubtitle: "Pérdidas de dinero detectadas",
    optimTitle: "OPTIMIZACIONES 🟠",
    optimSubtitle: "Ajustes de rendimiento",
    opportTitle: "OPPORTUNIDADES 🟢",
    opportSubtitle: "Potencial de crecimiento",
    processing: "Analizando datos...",
    actionLabel: "Acción",
    spendLabel: "Gasto",
    salesLabel: "Ventas",
    suggestedBid: "Puja sugerida:",
    ordersLabel: "Pedidos:",
    acosLabel: "ACOS actual:",
    harvestAction: "Cosechar (Coincidencia Exacta)",
    noOpport: "¡Busca tus pepitas de oro!",
    modifyConfig: "Modificar configuración",
    resetConfig: "Reiniciar & Salir",
    newAnalysis: "Nuevo Análisis",
    fullDataTitle: "Auditoría Completa de Datos",
    campaignLabel: "Campaña",
    clicksLabel: "Clics",
    summaryTab: "Acciones",
    fullDataTab: "Auditoría Completa",
    wastedSpendLabel: "Umbral de gasto desperdiciado (Clics)",
    wastedSpendHelp: "Por defecto: 10. Las decisiones son más estrictas por encima de este umbral.",
    aiModelLabel: "Seleccionar Modelo IA (LLM)",
    fetchModelsBtn: "🔄 Cargar modelos",
    reasonLabel: "Razón:",
    aiTab: "Cerebro IA",
    aiContextLabel: "Contexto histórico:",
    aiContextPlaceholder: "Ej: Estamos en fase de escalado...",
    aiBtn: "Generar Plan Estratégico",
    aiProcessing: "La IA está analizando la estrategia...",
    aiHistoryHelp: "El historial de sus últimas {count} análisis se inyectará automáticamente para ayudar a la IA.",
    noUrgencies: "No se han detectado urgencias.",
    noAdjustments: "No se requieren ajustes de puja.",
    goldenNugget: "PEPITA DE ORO 💎",
    noAuditDataError: "⚠️ ERROR: No se recibieron datos de auditoría del servidor.",
    exportingBtn: "⏳ Exportando...",
    exportBtn: "📥 Exportar Acciones",
    termHeader: "Término",
    campaignHeader: "Campaña",
    clicksHeader: "Clics",
    ordersHeader: "Pedidos",
    spendHeader: "Gasto",
    salesHeader: "Ventas",
    acosHeader: "ACOS",
    actionHeader: "Acción",
    exportPdfBtn: "Exportar informe PDF"
  },
  de: {
    title: "Keoxs Co-Pilot",
    subtitle: "Amazon PPC Audit & Optimierung mit 1 Klick",
    configTitle: "Konfiguration",
    apiKeyLabel: "Google AI Studio API-Schlüssel",
    apiKeyHelp: "Ihr Schlüssel bleibt zu 100% lokal.",
    apiKeyPlaceholder: "AIzaSy...",
    salePriceLabel: "Durchschnittlicher Verkaufspreis ($)",
    cogsLabel: "Durchschnittliche COGS ($)",
    fbaFeesLabel: "FBA-Gebühren ($)",
    startButton: "Co-Pilot starten",
    configInProgress: "Konfiguration läuft...",
    configSuccess: "Konfiguration erfolgreich!",
    errorPrefix: "Fehler: ",
    backendError: "Verbindungsfehler zum lokalen Backend.",
    dropZoneTitle: "Drop Zone 🚀",
    dropZoneSubtitle: "Agent ist bereit. Ziehen Sie Ihre Amazon-Dateien hierher, um die Diagnose zu starten.",
    dropZoneText: "Ziehen Sie Ihre Berichte (.csv, .xlsx) hierher",
    languageSelect: "Sprache",
    bleedingTitle: "DRINGLICHKEITEN 🔴",
    bleedingSubtitle: "Geldverlust erkannt",
    optimTitle: "OPTIMIERUNGEN 🟠",
    optimSubtitle: "Leistungsanpassungen",
    opportTitle: "CHANCEN 🟢",
    opportSubtitle: "Wachstumspotenzial",
    processing: "Daten werden analysiert...",
    actionLabel: "Aktion",
    spendLabel: "Ausgaben",
    salesLabel: "Umsatz",
    suggestedBid: "Empfohlenes Gebot:",
    ordersLabel: "Bestellungen:",
    acosLabel: "Aktueller ACOS:",
    harvestAction: "Ernten (Exact Match)",
    noOpport: "Suche nach deinen Goldstücken!",
    modifyConfig: "Konfiguration ändern",
    resetConfig: "Zurücksetzen & Abmelden",
    newAnalysis: "Neue Analyse",
    fullDataTitle: "Vollständiges Daten-Audit",
    campaignLabel: "Kampagne",
    clicksLabel: "Klicks",
    summaryTab: "Aufgaben",
    fullDataTab: "Vollständiges Audit",
    wastedSpendLabel: "Verschwendungsschwelle (Klicks)",
    wastedSpendHelp: "Standard: 10. Entscheidungen sind über dieser Schwelle strenger.",
    aiModelLabel: "KI-Modell auswählen (LLM)",
    fetchModelsBtn: "🔄 Modelle laden",
    reasonLabel: "Grund:",
    aiTab: "KI-Gehirn",
    aiContextLabel: "Historischer Kontext:",
    aiContextPlaceholder: "Z.B. Wir befinden uns in der Skalierungsphase...",
    aiBtn: "Strategischen Plan erstellen",
    aiProcessing: "KI analysiert die Strategie...",
    aiHistoryHelp: "Der Verlauf Ihrer letzten {count} Analysen wird automatisch injiziert, um der KI zu helfen.",
    noUrgencies: "Keine Dringlichkeiten erkannt.",
    noAdjustments: "Keine Gebotsanpassungen erforderlich.",
    goldenNugget: "GOLDSTÜCK 💎",
    noAuditDataError: "⚠️ FEHLER: Keine Audit-Daten vom Server erhalten.",
    exportingBtn: "⏳ Exportieren...",
    exportBtn: "📥 Aktionen exportieren",
    termHeader: "Suchbegriff",
    campaignHeader: "Kampagne",
    clicksHeader: "Klicks",
    ordersHeader: "Bestellungen",
    spendHeader: "Ausgaben",
    salesHeader: "Umsatz",
    acosHeader: "ACOS",
    actionHeader: "Aktion",
    exportPdfBtn: "PDF-Bericht exportieren"
  }
};

function App() {
  const getBrowserLang = () => {
    const lang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'fr', 'it', 'es', 'de'];
    return supportedLangs.includes(lang) ? lang : 'en';
  };

  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const fileInputRef = useRef(null);

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const exportToPdf = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    const reportHtml = document.querySelector('.markdown-report')?.innerHTML || '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Keoxs Co-Pilot - AI Strategic Plan</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              padding: 40px;
              color: #111827;
              line-height: 1.6;
              background: #ffffff;
            }
            h1, h2, h3, h4 {
              color: #111827;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 700;
            }
            h3 {
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-top: 2em;
            }
            p {
              margin-bottom: 1em;
            }
            ul, ol {
              margin-bottom: 1em;
              padding-left: 20px;
            }
            li {
              margin-bottom: 0.5em;
            }
            strong {
              color: #111827;
              font-weight: 600;
            }
            .header {
              border-bottom: 3px solid #10b981;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #111827;
            }
            .meta {
              font-size: 12px;
              color: #6b7280;
              text-align: right;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
              font-size: 11px;
              color: #9ca3af;
              text-align: center;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">KEOXS CO-PILOT</div>
              <div style="font-size: 14px; color: #10b981; font-weight: 600;">AI STRATEGIC PLAN</div>
            </div>
            <div class="meta">
              <div>Date: ${new Date().toLocaleDateString()}</div>
              <div>Generated by Keoxs Intelligence</div>
            </div>
          </div>
          <div>
            ${reportHtml}
          </div>
          <div class="footer">
            Keoxs Co-Pilot &copy; ${new Date().getFullYear()} - Powered by Scalerify. Confidential & Strategic Document.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setStatus(t.processing);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('lang', lang);

    try {
      const response = await fetch('http://localhost:8001/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Données reçues du backend:", result.data);
        setResults(result.data);
        
        // Mise à jour de l'historique (10 derniers)
        setHistory(prev => {
          const newItem = {
            id: Date.now(),
            date: new Date().toLocaleString(lang),
            filename: result.data.filename || file.name,
            data: result.data
          };
          // Garde les 10 derniers, évite les doublons stricts sur le nom si on veut (ici on garde tout l'historique récent)
          const newHistory = [newItem, ...prev].slice(0, 10);
          try {
            localStorage.setItem('keoxs_history', JSON.stringify(newHistory));
          } catch (e) {
            console.warn("Storage quota exceeded, keeping fewer history items");
            try {
              localStorage.setItem('keoxs_history', JSON.stringify(newHistory.slice(0, 3)));
            } catch (e2) {}
          }
          return newHistory;
        });

        setIsProcessing(false);
      } else {
        setStatus(`${t.errorPrefix}${result.detail}`);
        setIsProcessing(false);
      }
    } catch (error) {
      setStatus(t.backendError);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  useEffect(() => {
    setLang(getBrowserLang());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const t = translations[lang];

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('keoxs_config');
    return saved ? JSON.parse(saved) : {
      apiKey: '',
      salePrice: '',
      cogs: '',
      fbaFees: ''
    };
  });
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('keoxs_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('keoxs_history', JSON.stringify(newHistory));
  };

  const [aiContext, setAiContext] = useState("");
  const [aiReport, setAiReport] = useState(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showHistoryPage, setShowHistoryPage] = useState(false);

  const [availableModels, setAvailableModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const fetchModels = async () => {
    if (!formData.apiKey) return;
    setIsLoadingModels(true);
    try {
      const res = await fetch('http://localhost:8001/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: formData.apiKey })
      });
      const data = await res.json();
      if (res.ok && data.models) {
        setAvailableModels(data.models);
        // Si le modèle actuel n'est pas dans la liste, on prend le premier
        if (data.models.length > 0 && !data.models.includes(formData.aiModel)) {
          setFormData(prev => ({...prev, aiModel: data.models[0]}));
        }
      }
    } catch(e) {}
    setIsLoadingModels(false);
  };

  const requestAiAnalysis = async () => {
    setIsAiProcessing(true);
    setAiReport(null);

    // Auto-compilation of history
    let historySummary = "";
    if (history.length > 0) {
      historySummary = history.slice(0, 5).map(item => {
        const d = item.data;
        return `- Date: ${item.date} | Fichier: ${item.filename} | Urgences: ${d.total_bleeding_count} | Optims: ${d.total_optimization_count} | Opportunités: ${d.total_opportunity_count}`;
      }).join('\n');
    }

    const fullContext = aiContext.trim() 
      ? `Contexte utilisateur: ${aiContext}\n\nHistorique des 5 dernières analyses (Auto-injecté):\n${historySummary}`
      : `Historique des 5 dernières analyses (Auto-injecté):\n${historySummary}`;

    try {
      const response = await fetch('http://localhost:8001/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: fullContext,
          analysis_data: results,
          lang: lang
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setAiReport(result.report);
      } else {
        setAiReport(`${t.errorPrefix}${result.detail}`);
      }
    } catch (e) {
      setAiReport(t.backendError);
    }
    setIsAiProcessing(false);
  };

  const [isExporting, setIsExporting] = useState(false);

  const exportBulk = async (dataToExport) => {
    setIsExporting(true);
    try {
      const response = await fetch('http://localhost:8001/api/export-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis_data: dataToExport || results, lang: lang })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Keoxs_Bulk_Actions.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.detail}`);
      }
    } catch (e) {
      alert("Erreur de connexion au serveur pour l'export.");
    }
    setIsExporting(false);
  };

  const resetConfig = () => {
    localStorage.removeItem('keoxs_config');
    setIsSuccess(false);
    setResults(null);
    setFormData({
      apiKey: '',
      salePrice: '',
      cogs: '',
      fbaFees: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setStatus(t.configInProgress);

    try {
      const response = await fetch('http://localhost:8001/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: formData.apiKey,
          aiModel: formData.aiModel,
          salePrice: parseFloat(formData.salePrice),
          cogs: parseFloat(formData.cogs),
          fbaFees: parseFloat(formData.fbaFees),
          wastedSpendThreshold: parseInt(formData.wastedSpendThreshold) || 10
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(t.configSuccess);
        setIsSuccess(true);
        localStorage.setItem('keoxs_config', JSON.stringify(formData));
      } else {
        setStatus(`${t.errorPrefix}${data.detail}`);
      }
    } catch (error) {
      setStatus(t.backendError);
    }
  };

  // Auto-setup si config existante
  useEffect(() => {
    if (formData.apiKey && !isSuccess) {
      handleSubmit();
    }
  }, []);

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="layout" style={{ flex: 1, minHeight: 'auto' }}>
      <div className="top-controls">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="language-selector">
          {isSuccess && (
            <>
              {(!showHistoryPage || results) && (
                <button 
                  className="btn-secondary" 
                  onClick={() => { setResults(null); setShowHistoryPage(true); }} 
                  style={{ marginRight: '10px' }}
                  title="Ouvrir le gestionnaire d'historique complet"
                >
                  📖 {lang === 'fr' ? 'Historique' : lang === 'en' ? 'History' : lang === 'es' ? 'Historial' : lang === 'it' ? 'Cronologia' : 'Verlauf'}
                </button>
              )}
              
              {(results || showHistoryPage) && (
                <button 
                  className="btn-secondary success-outline" 
                  onClick={() => { setResults(null); setShowHistoryPage(false); }}
                >
                  🚀 {t.newAnalysis}
                </button>
              )}
            </>
          )}
          {isSuccess && (
            <button className="btn-secondary" onClick={() => setIsSuccess(false)}>
              {t.modifyConfig}
            </button>
          )}
          <select value={lang} onChange={handleLangChange}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div className={`left-panel ${isSuccess ? 'full-width' : ''} ${results ? 'dashboard-active' : ''}`}>
        <div className={`hero-content ${results ? 'full-width' : ''}`}>
          <h1>{t.title}</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--accent)', marginTop: '-10px', marginBottom: '15px', fontWeight: 'bold' }}>
            An open source solution by <a href="https://scalerify.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Scalerify.com</a>
          </p>
          <p>{t.subtitle}</p>
          
          {isSuccess && !results && !showHistoryPage && (
            <div className="dropzone-card">
              <h2>{t.dropZoneTitle}</h2>
              <p>{t.dropZoneSubtitle}</p>
              
              {status && (
                 <div className={`status-message ${status.includes(t.errorPrefix) || status === t.backendError || status === t.processing ? 'info' : 'success'}`} style={{ marginBottom: '20px' }}>
                   {status}
                 </div>
              )}

              <div 
                className={`dropzone ${isProcessing ? 'processing' : ''}`} 
                onClick={handleDropzoneClick} 
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragOver}
                onDrop={handleDrop}
                style={{ cursor: isProcessing ? 'wait' : 'pointer' }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".csv, .xlsx"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
                <span>{isProcessing ? t.processing : t.dropZoneText}</span>
              </div>
            </div>
          )}

          {isSuccess && showHistoryPage && !results && (
            <div className="history-page-container animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <h2>📖 {lang === 'fr' ? 'Gestionnaire d\'historique' : 'History Manager'}</h2>
                 {history.length > 0 && (
                   <button className="btn-secondary" onClick={() => {
                     if(window.confirm(lang === 'fr' ? 'Tout supprimer ?' : 'Delete all?')) {
                       setHistory([]);
                       localStorage.setItem('keoxs_history', JSON.stringify([]));
                     }
                   }} style={{ color: '#ff4444', borderColor: '#ff4444' }}>
                     🗑️ {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
                   </button>
                 )}
               </div>
               
               {history.length === 0 ? (
                 <p className="placeholder-text">{lang === 'fr' ? 'Aucun historique disponible.' : 'No history available.'}</p>
               ) : (
                 <div className="history-list">
                   {history.map(item => (
                     <div key={item.id} className="history-item" onClick={() => { setResults(item.data); setShowHistoryPage(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                       <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                         <div className="history-info">
                           <span className="history-filename">📄 {item.filename}</span>
                           <span className="history-date">{item.date}</span>
                         </div>
                         <div className="history-badges">
                           <span className="badge red" title="Urgences">{item.data.total_bleeding_count}</span>
                           <span className="badge orange" title="Optimisations">{item.data.total_optimization_count}</span>
                           <span className="badge green" title="Opportunités">{item.data.total_opportunity_count}</span>
                         </div>
                       </div>
                       <div style={{ display: 'flex' }}>
                         <button 
                           onClick={(e) => { e.stopPropagation(); exportBulk(item.data); }}
                           style={{ 
                             background: 'none', border: 'none', cursor: 'pointer', 
                             marginLeft: '15px', fontSize: '1.2rem', 
                             padding: '5px', opacity: '0.6', transition: 'opacity 0.2s' 
                           }}
                           onMouseEnter={(e) => e.target.style.opacity = '1'}
                           onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                           title="Exporter cette analyse en CSV"
                         >
                           📥
                         </button>
                         <button 
                           onClick={(e) => deleteHistoryItem(item.id, e)}
                           style={{ 
                             background: 'none', border: 'none', cursor: 'pointer', 
                             marginLeft: '5px', color: '#ff4444', fontSize: '1.2rem', 
                             padding: '5px', opacity: '0.6', transition: 'opacity 0.2s' 
                           }}
                           onMouseEnter={(e) => e.target.style.opacity = '1'}
                           onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                           title="Supprimer cette analyse"
                         >
                           🗑️
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {isSuccess && !results && !showHistoryPage && history.length > 0 && (
            <div className="history-container animate-fade-in" style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  {lang === 'fr' ? 'Dernières analyses' : 
                   lang === 'en' ? 'Recent analyses' : 
                   lang === 'es' ? 'Análisis recientes' : 
                   lang === 'it' ? 'Analisi recenti' : 'Letzte Analysen'}
                </h3>
                <button 
                  onClick={() => setShowHistoryPage(true)} 
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                >
                  {lang === 'fr' ? 'Voir tout' : 'View all'}
                </button>
              </div>
              <div className="history-list">
                {history.slice(0, 3).map(item => (
                  <div key={item.id} className="history-item" onClick={() => setResults(item.data)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="history-info">
                        <span className="history-filename">📄 {item.filename}</span>
                        <span className="history-date">{item.date}</span>
                      </div>
                      <div className="history-badges">
                        <span className="badge red" title="Urgences">{item.data.total_bleeding_count}</span>
                        <span className="badge orange" title="Optimisations">{item.data.total_optimization_count}</span>
                        <span className="badge green" title="Opportunités">{item.data.total_opportunity_count}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); exportBulk(item.data); }}
                        style={{ 
                          background: 'none', border: 'none', cursor: 'pointer', 
                          marginLeft: '15px', fontSize: '1.2rem', 
                          padding: '5px', opacity: '0.6', transition: 'opacity 0.2s' 
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                        title="Exporter cette analyse en CSV"
                      >
                        📥
                      </button>
                      <button 
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        style={{ 
                          background: 'none', border: 'none', cursor: 'pointer', 
                          marginLeft: '5px', color: '#ff4444', fontSize: '1.2rem', 
                          padding: '5px', opacity: '0.6', transition: 'opacity 0.2s' 
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                        onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                        title="Supprimer cette analyse"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results && (
            <div className="tab-switcher-container animate-fade-in">
              <div className="tab-switcher large">
                <button 
                  className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  {t.summaryTab}
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'full' ? 'active' : ''}`}
                  onClick={() => setActiveTab('full')}
                >
                  {t.fullDataTab}
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai')}
                  style={{ color: activeTab === 'ai' ? 'white' : 'var(--accent)' }}
                >
                  ✨ {t.aiTab}
                </button>
              </div>
            </div>
          )}

          {results && activeTab === 'ai' && (
            <div className="ai-brain-container animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>{t.aiContextLabel}</h3>
                <textarea 
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder={t.aiContextPlaceholder + " (Optionnel)"}
                  rows={4}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: 'var(--bg-color)', 
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>⚡ Powered by Google Gemini. Please do not share sensitive data.</span>
                </div>
                {history.length > 0 && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px', fontStyle: 'italic' }}>
                    {t.aiHistoryHelp.replace("{count}", Math.min(history.length, 5))}
                  </p>
                )}
                <button 
                  className="btn-primary" 
                  onClick={requestAiAnalysis} 
                  disabled={isAiProcessing}
                  style={{ width: '100%', position: 'relative' }}
                >
                  {isAiProcessing ? t.aiProcessing : t.aiBtn}
                </button>
              </div>

              <div className="card" style={{ 
                background: 'rgba(16, 163, 127, 0.05)', 
                border: '1px dashed rgba(16, 163, 127, 0.25)', 
                borderRadius: '8px',
                padding: '15px 20px',
                marginBottom: '20px',
                fontSize: '13px',
                lineHeight: '1.5',
                color: 'var(--text-secondary)'
              }}>
                💼 Your TACoS is severely eating into your net margins. Are you planning an exit or struggling with cash flow? Request a free Turnaround Audit from our enterprise partner: <a href="https://scalerify.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'underline' }}>Scalerify.</a>
              </div>

              {isAiProcessing && (
                <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="ai-spinner"></div>
                  <p style={{ color: 'var(--accent)', marginTop: '20px', fontWeight: 'bold' }}>{t.aiProcessing}</p>
                </div>
              )}

              {aiReport && !isAiProcessing && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={exportToPdf} 
                      style={{ 
                        background: 'var(--accent)', 
                        color: 'white', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '10px 18px', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      📄 {t.exportPdfBtn}
                    </button>
                  </div>
                  <div className="card markdown-report animate-fade-in" style={{ lineHeight: '1.6' }}>
                    <ReactMarkdown>{aiReport}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          )}

          {results && activeTab === 'summary' && (            <div className="dashboard-grid">
              <div className="dashboard-column bleeding">
                <div className="column-header">
                  <h3>{t.bleedingTitle}</h3>
                  <p>{t.bleedingSubtitle}</p>
                </div>
                <div className="card-list">
                  {results.bleeding.map((item, idx) => (
                    <div key={idx} className="analysis-card error">
                      <div className="card-main">
                        <strong>{item.term}</strong>
                        <span className="badge-error">URGENT 🔴</span>
                      </div>
                        <div className="card-details">
                          <div className="metric-row">
                            <span>{t.clicksLabel}: {item.clicks}</span>
                            <span>{t.spendLabel}: ${(item.spend || 0).toFixed(2)}</span>
                          </div>
                          <div className="instruction-box">
                            <span className="instruction-label">{t.actionLabel}</span>
                            <p className="instruction-text">{item.action}</p>
                          </div>
                          <small className="reason-text">{t.reasonLabel} {item.reason}</small>
                        </div>
                    </div>
                  ))}
                  {results.bleeding.length === 0 && (
                    <div className="empty-diagnostic">
                      <p className="empty-msg">{t.noUrgencies}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="dashboard-column optimization">
                <div className="column-header">
                  <h3>{t.optimTitle}</h3>
                  <p>{t.optimSubtitle}</p>
                </div>
                <div className="card-list">
                  {results.optimizations && results.optimizations.length > 0 ? (
                    results.optimizations.map((opt, idx) => (
                      <div key={idx} className="analysis-card warning">
                        <div className="card-main">
                          <strong>{opt.term}</strong>
                          <span className="badge-warning">OPTIM 🟠</span>
                        </div>
                        <div className="card-details">
                          <div className="metric-row">
                            <span>{t.acosLabel} {(opt.acos || 0).toFixed(2)}%</span>
                            <span>{t.ordersLabel} {opt.orders || 0}</span>
                          </div>
                          <div className="instruction-box">
                            <span className="instruction-label">{t.actionLabel}</span>
                            <p className="instruction-text">{opt.action}</p>
                          </div>
                          <small className="reason-text">{t.reasonLabel} {opt.reason}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="placeholder-text">{t.noAdjustments}</p>
                  )}
                </div>
              </div>

              <div className="dashboard-column opportunity">
                <div className="column-header">
                  <h3>{t.opportTitle}</h3>
                  <p>{t.opportSubtitle}</p>
                </div>
                <div className="card-list">
                  {results.opportunities && results.opportunities.length > 0 ? (
                    results.opportunities.map((opp, idx) => (
                      <div key={idx} className="analysis-card success">
                        <div className="card-main">
                          <strong>{opp.term}</strong>
                          <span className="badge-success">{t.goldenNugget}</span>
                        </div>
                        <div className="card-details">
                          <div className="metric-row">
                            <span>{t.acosLabel} {(opp.acos || 0).toFixed(2)}%</span>
                            <span>{t.ordersLabel} {opp.orders || 0}</span>
                          </div>
                          <div className="instruction-box">
                            <span className="instruction-label">{t.actionLabel}</span>
                            <p className="instruction-text">{opp.action}</p>
                          </div>
                          <small className="reason-text">{t.reasonLabel} {opp.reason}</small>
                        </div>
                        <button className="btn-action success">{t.harvestAction}</button>
                      </div>
                    ))
                  ) : (
                    <p className="placeholder-text">{t.noOpport}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {results && activeTab === 'full' && (
            <div className="full-data-section animate-fade-in">
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2>{t.fullDataTitle}</h2>
                  <span className="file-tag">📄 {results.filename}</span>
                </div>
                <button className="btn-secondary" onClick={() => exportBulk(results)} disabled={isExporting} style={{ background: 'var(--accent)', color: 'white', border: 'none' }}>
                  {isExporting ? t.exportingBtn : t.exportBtn}
                </button>
              </div>
              
              {!results.full_data || results.full_data.length === 0 ? (
                <div className="empty-diagnostic">
                  <p className="error-msg">{t.noAuditDataError}</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t.termHeader}</th>
                        <th>{t.campaignHeader}</th>
                        <th>{t.clicksHeader}</th>
                        <th>{t.ordersHeader}</th>
                        <th>{t.spendHeader}</th>
                        <th>{t.salesHeader}</th>
                        <th>{t.acosHeader}</th>
                        <th>{t.actionHeader}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.full_data.map((row, idx) => (
                        <tr key={idx} className={row.clicks === 0 ? 'inactive-row' : ''}>
                          <td className="term-cell">{row.term || 'N/A'}</td>
                          <td className="campaign-cell">{row.campaign || 'N/A'}</td>
                          <td>{row.clicks || 0}</td>
                          <td>{row.orders || 0}</td>
                          <td>${(row.spend || 0).toFixed(2)}</td>
                          <td>${(row.sales || 0).toFixed(2)}</td>
                          <td className={row.acos > 0 ? 'highlight-acos' : ''}>{(row.acos || 0).toFixed(2)}%</td>
                          <td>
                            <span className={`action-badge ${(row.action || 'monitor').toLowerCase()}`}>
                              {row.action || 'Monitor'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isSuccess && (
        <div className="right-panel">
          <div className="form-container" style={{ position: 'relative' }}>
            {localStorage.getItem('keoxs_config') && (
              <button 
                type="button"
                onClick={() => setIsSuccess(true)}
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '20px', 
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                title="Fermer"
              >
                ✕
              </button>
            )}
            <h2>{t.configTitle}</h2>
            <form onSubmit={handleSubmit} className="setup-form">
              <div className="form-group">
                <label>{t.apiKeyLabel}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="password"
                    name="apiKey"
                    placeholder={t.apiKeyPlaceholder}
                    value={formData.apiKey}
                    onChange={handleChange}
                    required
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={fetchModels} 
                    disabled={isLoadingModels || !formData.apiKey}
                    style={{ padding: '0 15px', whiteSpace: 'nowrap' }}
                  >
                    {isLoadingModels ? "..." : t.fetchModelsBtn}
                  </button>
                </div>
                <small>{t.apiKeyHelp}</small>
              </div>

              <div className="form-group animate-fade-in">
                <label>{t.aiModelLabel}</label>
                <select name="aiModel" value={formData.aiModel || "gemini-2.5-flash"} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                  {availableModels.length > 0 
                    ? availableModels.map(m => <option key={m} value={m}>{m}</option>)
                    : <option value={formData.aiModel || "gemini-2.5-flash"}>{formData.aiModel || "gemini-2.5-flash"}</option>
                  }
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.salePriceLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    name="salePrice"
                    placeholder="29.99"
                    value={formData.salePrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t.cogsLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cogs"
                    placeholder="6.50"
                    value={formData.cogs}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t.fbaFeesLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    name="fbaFees"
                    placeholder="9.50"
                    value={formData.fbaFees}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t.wastedSpendLabel}</label>
                <input
                  type="number"
                  name="wastedSpendThreshold"
                  placeholder="10"
                  value={formData.wastedSpendThreshold}
                  onChange={handleChange}
                  required
                />
                <small>{t.wastedSpendHelp}</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">{t.startButton}</button>
                <button type="button" className="btn-reset" onClick={resetConfig}>{t.resetConfig}</button>
              </div>
              
              {status && !isSuccess && (
                 <div className={`status-message ${status.includes(t.errorPrefix) || status === t.backendError ? 'error' : 'success'}`}>
                   {status}
                 </div>
              )}
            </form>
          </div>
        </div>
      )}
      </div>

      <footer className="app-footer" style={{ 
        width: '100%', 
        padding: '20px 40px', 
        borderTop: '1px solid var(--border)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        background: 'var(--bg-color)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>An open source solution by <a href="https://scalerify.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Scalerify.com</a></span>
          <span>Built by <a href="https://www.linkedin.com/in/david-daddi-tkoi/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>David DADDI</a></span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="https://github.com/scalerify-keoxs/keoxs-co-pilot/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color='var(--accent)'} onMouseLeave={(e) => e.target.style.color='var(--text-secondary)'}>MIT License</a>
          <a href="https://keoxs.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color='var(--accent)'} onMouseLeave={(e) => e.target.style.color='var(--text-secondary)'}>Documentation</a>
          <a href="https://keoxs.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color='var(--accent)'} onMouseLeave={(e) => e.target.style.color='var(--text-secondary)'}>Community</a>
          <a href="https://keoxs.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color='var(--accent)'} onMouseLeave={(e) => e.target.style.color='var(--text-secondary)'}>Contact</a>
          <a href="https://github.com/scalerify-keoxs/keoxs-co-pilot/issues/new" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>🐞 Report a Bug</a>
        </div>
      </footer>

    </div>
  );
}

export default App;
