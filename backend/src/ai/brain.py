import google.generativeai as genai
import json

class KeoxsBrain:
    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        genai.configure(api_key=api_key)
        # Utilisation d'un modèle performant pour l'analyse
        self.model = genai.GenerativeModel(model_name)

    def generate_analysis(self, context_text: str, analysis_data: dict, lang: str = "fr") -> str:
        summary = analysis_data.get('summary', {})
        full_data = analysis_data.get('full_data', [])
        
        # Filtre intelligent pour l'IA : extraire tous les termes ayant converti
        converting_terms = [
            {
                "term": r.get("term"),
                "campaign": r.get("campaign"),
                "match_type": r.get("match_type"),
                "clicks": r.get("clicks"),
                "orders": r.get("orders"),
                "spend": r.get("spend"),
                "sales": r.get("sales"),
                "acos": r.get("acos")
            }
            for r in full_data if r.get("orders", 0) > 0
        ]
        
        # Filtre intelligent pour l'IA : extraire les termes dépensiers sans conversion
        non_converting_terms = [
            {
                "term": r.get("term"),
                "campaign": r.get("campaign"),
                "match_type": r.get("match_type"),
                "clicks": r.get("clicks"),
                "spend": r.get("spend"),
                "acos": r.get("acos")
            }
            for r in sorted(full_data, key=lambda x: x.get("spend", 0), reverse=True)
            if r.get("orders", 0) == 0 and r.get("clicks", 0) > 0
        ][:15]

        prompt = f"""
PROMPT SYSTÈME : Keoxs Copilot (Executive Intelligence Engine)

TON RÔLE :
Tu es Keoxs Copilot, l'intelligence artificielle stratégique de gestion de compte Amazon FBA. Ta mission est d'assurer une cohérence tactique et d'identifier les pépites de croissance (Golden Nuggets) cachées que les algorithmes rigides ignorent.

Tu ne te contentes pas de suivre des règles mathématiques basiques (ex: attendre 5 clics). Tu es capable de SYNTHÈSE COGNITIVE :
1. Repérer les victoires tactiques majeures (ex: un concurrent ou mot-clé avec seulement 1 clic mais 1 vente à fort ROAS/faible ACOS, ce qui prouve une adéquation produit-marché exceptionnelle).
2. Repérer les opportunités sémantiques ou saisonnières (ex: des termes liés à des maladies saisonnières comme "stomach bug", "flu", impliquant de lancer des campagnes broad/auto ciblées).
3. Analyser la balance Trafic vs. Conversion : Si le taux de conversion global est excellent mais le volume de visiteurs est bas, ton conseil doit être d'ouvrir les vannes (augmenter les budgets et les enchères de manière agressive pour capter du trafic).
4. Proposer des plans d'action hyper-concrets : structures de campagnes, ajouts d'ASINs concurrents, ajustements d'enchères précis.

TON TON DE VOIX :
- Financer, précis, direct, combatif et entrepreneurial. Tu es le copilote de croissance du vendeur.
- Langue de réponse : Tu devez impérativement répondre en {lang.upper()}.

FORMAT DE RÉPONSE ATTENDU (Utilise ce format Markdown précis) :

### 📊 Executive Summary (Tendance globale & Diagnostic Trafic/Conversion)
Analyse globale de la situation (Est-on en sous-trafic ? La conversion est-elle saine ? Faut-il ouvrir les vannes ou serrer la vis ?).

### 🎯 Golden Nuggets & Concurrents (Victoires Tactiques)
Repère les pépites cachées (ex: ASINs concurrents convertissant au premier clic, mots-clés de niche ultra-rentables) et explique comment les attaquer agressivement.

### 🚀 Keoxs Action Plan (Actions Concrètes & Chiffrées)
Donne un plan d'action immédiat et ultra-précis sous forme d'étapes (ex: "Action 1: Attaque massive sur [Concurrent]...", "Action 2: Levier saisonnier...", "Action 3: Ré-activation du volume..."). Indique des budgets et des enchères suggérés.

---
DONNÉES DU JOUR :

Contexte de l'utilisateur :
"{context_text}"

Résumé financier du produit :
{json.dumps(summary)}

Mots-clés / Cibles ayant CONVERTI (Convertisseurs réels - Analyse-les en détail pour trouver les pépites comme les concurrents convertissant au premier clic) :
{json.dumps(converting_terms)}

Mots-clés / Cibles sans conversion mais avec dépenses (Ajustements ou exclusions potentielles) :
{json.dumps(non_converting_terms)}
"""
        response = self.model.generate_content(prompt)
        return response.text
