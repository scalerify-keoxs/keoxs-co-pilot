import pandas as pd
import numpy as np

class UnitEconomicsEngine:
    """
    Module 2 : Le Gardien Financier (Unit Economics Engine)
    Calcule la rentabilité et identifie les pertes urgentes ("Bleeding").
    """

    def __init__(self, sale_price: float, cogs: float, fba_fees: float, clicks_threshold: int = 10):
        """
        Initialise le moteur avec les données financières du produit.
        """
        self.sale_price = sale_price
        self.cogs = cogs
        self.fba_fees = fba_fees
        self.clicks_threshold = clicks_threshold
        
        # Calcul de la marge brute et du Break-Even ACOS
        self.gross_profit = self.sale_price - self.cogs - self.fba_fees
        self.break_even_acos = (self.gross_profit / self.sale_price) * 100 if self.sale_price > 0 else 0

    def get_financial_summary(self) -> dict:
        return {
            "Sale Price": self.sale_price,
            "COGS": self.cogs,
            "FBA Fees": self.fba_fees,
            "Gross Profit": round(self.gross_profit, 2),
            "Break-Even ACOS (%)": round(self.break_even_acos, 2)
        }

    def run_full_analysis(self, str_df: pd.DataFrame, lang: str = "fr"):
        """
        Implémentation du FLOWCHART KEOXS (Algorithme Décisionnel Strict).
        """
        results = {
            "bleeding": [],      # 🔴 URGENCES
            "optimizations": [], # 🟠 OPTIMISATIONS
            "opportunities": [], # 🟢 OPPORTUNITÉS
            "full_data": [],     # Toutes les lignes
            "debug_info": {
                "columns_found": list(str_df.columns),
                "row_count": len(str_df)
            }
        }

        # Dictionnaire des actions traduites
        actions_i18n = {
            'fr': {
                'exclude': "EXCLURE : Ajoutez ce terme en 'Négatif Exact'.",
                'wasted': "Dépense inutile (Wasted Spend)",
                'boost': "SCALE BID (Exact) : Augmentez l'enchère de 10% pour gagner des parts de marché.",
                'profitable': "Terme rentable et déjà en Exact.",
                'harvest': "HARVEST (Broad/Auto) : Créez ce mot en 'Manuel Exact' (Enchère : {bid}€) et excluez-le en 'Négatif Exact'.",
                'new_conv': "Nouveau convertisseur rentable détecté.",
                'bridle': "BRIDER : Diminuez l'enchère de 20-30% pour stabiliser l'ACOS.",
                'unprofitable': "ACOS supérieur au Break-Even.",
                'test_low': "TESTER (Low Bid) : Créez en 'Manuel Exact' avec une enchère de sécurité ({bid}€).",
                'unprof_auto': "Convertisseur non-rentable en Auto.",
                'monitor': "Monitor",
                'wait': "En attente de données",
                'good': "Bonne performance",
                'ctr_killer': "EXCLURE / BRIDER : Faible CTR (Tueur de visibilité organique).",
                'wasted_ctr': "Impressions élevées (>1000) mais CTR très faible.",
                'low_cvr': "BRIDER : Trafic non qualifié (Faible Conversion).",
                'unqual_traffic': "CVR très faible par rapport à la moyenne du compte."
            },
            'en': {
                'exclude': "EXCLUDE: Add this term as 'Negative Exact' immediately.",
                'wasted': "Wasted Spend",
                'boost': "SCALE BID (Exact): Increase bid by 10%.",
                'profitable': "Profitable term already in Exact.",
                'harvest': "HARVEST (Broad/Auto): Create this keyword in 'Manual Exact' (Bid: {bid}€).",
                'new_conv': "New profitable converter detected.",
                'bridle': "CURB: Decrease bid by 20-30% to stabilize ACOS.",
                'unprofitable': "ACOS above Break-Even.",
                'test_low': "TEST (Low Bid): Create in 'Manual Exact' with a safety bid ({bid}€).",
                'unprof_auto': "Unprofitable converter from Auto.",
                'monitor': "Monitor",
                'wait': "Waiting for data",
                'good': "Good performance",
                'ctr_killer': "EXCLUDE / CURB: Low CTR (Organic visibility killer).",
                'wasted_ctr': "High impressions (>1000) but very low CTR.",
                'low_cvr': "CURB: Unqualified traffic (Low Conversion).",
                'unqual_traffic': "CVR very low compared to account average."
            },
            'es': {
                'exclude': "EXCLUIR: Agregue este término como 'Negativo Exacto'.",
                'wasted': "Gasto desperdiciado",
                'boost': "SCALE BID (Exacto): Aumente la puja un 10%.",
                'profitable': "Término rentable ya en Exacto.",
                'harvest': "COSECHAR (Broad/Auto): Cree esta palabra en 'Manual Exacto' (Puja: {bid}€).",
                'new_conv': "Nuevo convertidor rentable detectado.",
                'bridle': "FRENAR: Disminuya la puja un 20-30%.",
                'unprofitable': "ACOS por encima del Break-Even.",
                'test_low': "PROBAR (Low Bid): Crear en 'Manual Exacto' ({bid}€).",
                'unprof_auto': "Convertidor no rentable de Auto.",
                'monitor': "Monitorear",
                'wait': "Esperando datos",
                'good': "Buen rendimiento",
                'ctr_killer': "EXCLUIR / FRENAR: Bajo CTR (Asesino de visibilidad).",
                'wasted_ctr': "Altas impresiones (>1000) pero CTR muy bajo.",
                'low_cvr': "FRENAR: Tráfico no cualificado.",
                'unqual_traffic': "CVR muy bajo en comparación con el promedio."
            },
            'it': {
                'exclude': "ESCLUDI: Aggiungi questo termine come 'Negativo Esatto'.",
                'wasted': "Spesa sprecata",
                'boost': "SCALE BID (Esatta): Aumenta l'offerta del 10%.",
                'profitable': "Termine redditizio già in Esatta.",
                'harvest': "RACCOGLI (Broad/Auto): Crea questa parola in 'Manuale Esatta' ({bid}€).",
                'new_conv': "Nuovo convertitore redditizio rilevato.",
                'bridle': "FRENA: Diminuisci l'offerta del 20-30%.",
                'unprofitable': "ACOS superiore al Break-Even.",
                'test_low': "TESTA (Low Bid): Crea in 'Manuale Esatta' ({bid}€).",
                'unprof_auto': "Convertitore non redditizio da Auto.",
                'monitor': "Monitora",
                'wait': "In attesa di dati",
                'good': "Buona performance",
                'ctr_killer': "ESCLUDI / FRENA: Basso CTR.",
                'wasted_ctr': "Alte impressioni (>1000) ma CTR molto basso.",
                'low_cvr': "FRENA: Traffico non qualificato.",
                'unqual_traffic': "CVR molto basso rispetto alla media."
            },
            'de': {
                'exclude': "AUSSCHLIESSEN: Fügen Sie diesen Begriff als 'Negative Exact' ein.",
                'wasted': "Verschwendete Ausgaben",
                'boost': "SCALE BID (Exact): Erhöhen Sie das Gebot um 10%.",
                'profitable': "Profitabler Begriff bereits in Exact.",
                'harvest': "ERNTEN (Broad/Auto): Erstellen Sie dieses Keyword in 'Manual Exact' ({bid}€).",
                'new_conv': "Neuer profitabler Konverter erkannt.",
                'bridle': "DROSSELN: Senken Sie das Gebot um 20-30%.",
                'unprofitable': "ACOS über Break-Even.",
                'test_low': "TESTEN (Low Bid): Erstellen Sie in 'Manual Exact' ({bid}€).",
                'unprof_auto': "Unprofitabler Konverter aus Auto.",
                'monitor': "Überwachen",
                'wait': "Warten auf Daten",
                'good': "Gute Leistung",
                'ctr_killer': "AUSSCHLIESSEN: Niedrige CTR.",
                'wasted_ctr': "Hohe Impressionen (>1000), sehr niedrige CTR.",
                'low_cvr': "DROSSELN: Unqualifizierter Traffic.",
                'unqual_traffic': "CVR sehr niedrig im Vergleich zum Durchschnitt."
            }
        }

        # Fallback si langue non supportée
        t = actions_i18n.get(lang, actions_i18n['en'])

        print(f"--- ANALYSE KEOXS START ---")
        print(f"Lignes à analyser : {len(str_df)}")
        print(f"Seuil de clics : {self.clicks_threshold}")
        print(f"Break-even ACOS : {self.break_even_acos}%")

        # Calcul du CVR Global
        total_clicks = 0
        total_orders = 0
        for _, row in str_df.iterrows():
            total_clicks += row.get('Clicks', 0)
            total_orders += row.get('Orders', 0)
        global_cvr = (total_orders / total_clicks * 100) if total_clicks > 0 else 0
        print(f"Global CVR moyen : {round(global_cvr, 2)}%")

        for _, row in str_df.iterrows():
            term = row.get('Search Term')
            
            # Sécurité : Si le terme est vide ou NaN, on ignore la ligne
            if not term or pd.isna(term) or str(term).strip() == "":
                continue
                
            clicks = row.get('Clicks', 0)
            orders = row.get('Orders', 0)
            spend = row.get('Spend', 0)
            sales = row.get('Sales', 0)
            cpc = row.get('CPC', 0)
            impressions = row.get('Impressions', 0)
            match_type = str(row.get('Match Type', '')).upper()
            campaign = row.get('Campaign', 'N/A')
            
            acos = (spend / sales * 100) if sales > 0 else 0
            ctr = (clicks / impressions * 100) if impressions > 0 else 0
            cvr = (orders / clicks * 100) if clicks > 0 else 0

            # --- LOGIQUE POUR L'AUDIT COMPLET ---
            is_manual_exact = (match_type == 'EXACT')
            
            action_audit = t['monitor']
            reason_audit = t['wait']

            if orders == 0:
                if clicks > self.clicks_threshold:
                    action_audit = t['exclude']
                    reason_audit = t['wasted']
                elif impressions > 1500 and ctr < 0.15:
                    action_audit = t['ctr_killer']
                    reason_audit = t['wasted_ctr']
            else:
                if acos <= self.break_even_acos:
                    if is_manual_exact:
                        action_audit = t['boost']
                        reason_audit = t['profitable']
                    else:
                        action_audit = t['harvest'].replace('{bid}', str(round(cpc * 1.10, 2)))
                        reason_audit = t['new_conv']
                else:
                    if cvr < (global_cvr * 0.4): # CVR très faible par rapport à la moyenne
                        action_audit = t['low_cvr']
                        reason_audit = t['unqual_traffic']
                    else:
                        if is_manual_exact:
                            action_audit = t['bridle']
                            reason_audit = t['unprofitable']
                        else:
                            action_audit = t['test_low'].replace('{bid}', str(round(cpc * 0.70, 2)))
                            reason_audit = t['unprof_auto']

            # DEBUG LOG
            if term == "b08nwbrps8":
                print(f"DEBUG: term={term}, clicks={clicks}, orders={orders}, action={action_audit}")

            # Calcul du suggested_bid pour l'export (simplifié)
            suggested_bid = 0.0
            if "BOOST" in action_audit or "BOOSTER" in action_audit:
                suggested_bid = round(cpc * 1.10, 2)
            elif "CURB" in action_audit or "BRIDER" in action_audit:
                suggested_bid = round(cpc * 0.70, 2)
            elif "HARVEST" in action_audit or "RÉCOLTER" in action_audit:
                suggested_bid = round(cpc * 1.10, 2)
            elif "TEST" in action_audit or "TESTER" in action_audit:
                suggested_bid = round(cpc * 0.70, 2)
            elif "EXCLUDE" in action_audit or "EXCLURE" in action_audit:
                suggested_bid = 0.0 # Will be a Negative Keyword

            results["full_data"].append({
                "term": term,
                "campaign": campaign,
                "match_type": match_type,
                "clicks": clicks,
                "orders": int(orders),
                "spend": round(spend, 2),
                "sales": round(sales, 2),
                "acos": round(acos, 2),
                "action": action_audit,
                "reason": reason_audit,
                "suggested_bid": suggested_bid
            })

            # SI Clics = 0 : Ignore pour les colonnes de résumé
            if clicks == 0:
                continue
                
            # RÈGLE D'OR : Pas de décision sous 5 clics (sauf si ACOS très bas < 10%)
            if clicks < 5 and acos > 10:
                continue
            is_manual_exact = (match_type == 'EXACT')

            # --- LOGIQUE DÉCISIONNELLE ---
            
            # SI Clics > 0 ET Commandes = 0
            if orders == 0:
                if clicks > self.clicks_threshold:
                    results["bleeding"].append({
                        "term": term,
                        "clicks": clicks,
                        "spend": round(spend, 2),
                        "action": t['exclude'],
                        "reason": t['wasted']
                    })
                elif impressions > 1500 and ctr < 0.15:
                    results["bleeding"].append({
                        "term": term,
                        "clicks": clicks,
                        "spend": round(spend, 2),
                        "action": t['ctr_killer'],
                        "reason": t['wasted_ctr']
                    })
                continue

            # SI Commandes > 0 (Proven Converter)
            if orders > 0:
                # SI ACOS <= Break-Even (Profitable)
                if acos <= self.break_even_acos:
                    if is_manual_exact:
                        results["optimizations"].append({
                            "term": term,
                            "acos": round(acos, 2),
                            "orders": int(orders),
                            "action": t['boost'],
                            "reason": t['profitable']
                        })
                    else:
                        results["opportunities"].append({
                            "term": term,
                            "acos": round(acos, 2),
                            "orders": int(orders),
                            "suggested_bid": round(cpc * 1.10, 2),
                            "action": t['harvest'].replace('{bid}', str(round(cpc * 1.10, 2))),
                            "reason": t['new_conv']
                        })
                
                # SI ACOS > Break-Even (Unprofitable)
                else:
                    if cvr < (global_cvr * 0.4): # Trafic non qualifié
                        results["optimizations"].append({
                            "term": term,
                            "acos": round(acos, 2),
                            "orders": int(orders),
                            "action": t['low_cvr'],
                            "reason": t['unqual_traffic']
                        })
                    else:
                        if is_manual_exact:
                            results["optimizations"].append({
                                "term": term,
                                "acos": round(acos, 2),
                                "orders": int(orders),
                                "action": t['bridle'],
                                "reason": t['unprofitable']
                            })
                        else:
                            results["opportunities"].append({
                                "term": term,
                                "acos": round(acos, 2),
                                "orders": int(orders),
                                "suggested_bid": round(cpc * 0.70, 2),
                                "action": t['test_low'].replace('{bid}', str(round(cpc * 0.70, 2))),
                                "reason": t['unprof_auto']
                            })

        return results
