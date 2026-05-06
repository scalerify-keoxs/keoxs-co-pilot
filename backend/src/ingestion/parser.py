import pandas as pd
from pathlib import Path
from typing import Union

class AmazonReportParser:
    """
    Module 1: Ingestion & Nettoyage (Le Parseur)
    Gère le chargement et le nettoyage des rapports standards d'Amazon (Search Term Report, Business Report, etc.)
    """

    @staticmethod
    def load_search_term_report(file_path: Union[str, Path]) -> pd.DataFrame:
        """
        Charge et nettoie un Search Term Report (STR).
        """
        file_path = Path(file_path)
        
        # Détection du format (CSV ou Excel)
        print(f"DEBUG: Chargement du fichier {file_path}")
        if file_path.suffix.lower() == '.csv':
            for sep in [',', ';', '\t']:
                try:
                    df = pd.read_csv(file_path, sep=sep, encoding='utf-8')
                    if any(c in str(df.columns).lower() for c in ['term', 'search', 'clic', 'spend', 'mot']):
                        print(f"DEBUG: CSV chargé avec séparateur '{sep}'")
                        break
                except:
                    try:
                        df = pd.read_csv(file_path, sep=sep, encoding='latin1')
                        if any(c in str(df.columns).lower() for c in ['term', 'search', 'clic', 'spend', 'mot']):
                            print(f"DEBUG: CSV chargé avec séparateur '{sep}' (latin1)")
                            break
                    except:
                        continue
        elif file_path.suffix.lower() in ['.xls', '.xlsx']:
            df = pd.read_excel(file_path, engine='openpyxl')
            print(f"DEBUG: Excel chargé avec openpyxl")
        else:
            raise ValueError("Format de fichier non supporté.")

        # Nettoyage des lignes vides
        header_row = 0
        found_header = False
        for i, row in df.iterrows():
            row_str = " ".join(row.astype(str)).lower()
            if any(c in row_str for c in ['search term', 'terme de recherche', 'customer search', 'mot-clé', 'mot-cle', 'targeting', 'keyword']):
                header_row = i
                found_header = True
                print(f"DEBUG: En-tête trouvé à la ligne {i}")
                df.columns = df.iloc[header_row]
                df = df.iloc[header_row+1:].reset_index(drop=True)
                break
        
        if not found_header:
            print("DEBUG: Aucun en-tête trouvé, utilisation de la ligne 0")

        # Normalisation
        print("DEBUG: Normalisation des colonnes...")
        df = AmazonReportParser._normalize_columns(df)
        print(f"DEBUG: Colonnes après normalisation: {list(df.columns)}")
        
        print("DEBUG: Nettoyage des devises...")
        df = AmazonReportParser._clean_currency_columns(df)
        
        print("DEBUG: Calcul des métriques...")
        df = AmazonReportParser._calculate_missing_metrics(df)
        
        return df

    @staticmethod
    def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
        """
        Mappe les colonnes internationales vers un standard interne de manière agressive.
        """
        # 1. Nettoyage radical des noms de colonnes : minuscules, sans espaces début/fin, 
        # et remplacement des espaces multiples/caractères spéciaux par un espace simple.
        df.columns = [str(col).strip().lower() for col in df.columns]
        
        # 2. Mapping en minuscules pour la correspondance internationale
        mapping = {
            # Termes de recherche (Search Terms)
            'customer search term': 'Search Term',
            'terme de recherche client': 'Search Term',
            'terme de recherche': 'Search Term',
            'término de búsqueda de clientes': 'Search Term',
            'término de búsqueda': 'Search Term',
            'termini di ricerca cliente': 'Search Term',
            'termini di ricerca': 'Search Term',
            'suchbegriff des kunden': 'Search Term',
            'suchbegriff': 'Search Term',
            'search term': 'Search Term',
            'mot-clé': 'Search Term',
            'mot-cle': 'Search Term',
            'terme de recherche': 'Search Term',
            'terme de la recherche du client': 'Search Term',
            'terme de recherche client': 'Search Term',
            'target': 'Search Term',
            
            # Dépenses (Spend)
            'spend': 'Spend',
            'dépense': 'Spend',
            'dépenses': 'Spend',
            'gasto': 'Spend',
            'gastos': 'Spend',
            'spesa': 'Spend',
            'spese': 'Spend',
            'ausgaben': 'Spend',
            'cost': 'Spend',
            'costo': 'Spend',
            'coste': 'Spend',
            
            # Ventes (Sales)
            '7 day total sales': 'Sales',
            'ventes totales sur 7 jours': 'Sales',
            'sales': 'Sales',
            'ventes': 'Sales',
            'total sales': 'Sales',
            'ventas': 'Sales',
            'ventas totales': 'Sales',
            'vendite': 'Sales',
            'vendite totali': 'Sales',
            '7-tage-gesamtumsatz': 'Sales',
            'umsatz': 'Sales',
            'gesamtumsatz': 'Sales',
            'revenue': 'Sales',
            
            # Commandes (Orders)
            '7 day total orders (#)': 'Orders',
            '7 day total orders': 'Orders',
            'orders': 'Orders',
            'commandes': 'Orders',
            'ordini': 'Orders',
            'pedidos': 'Orders',
            'bestellungen': 'Orders',
            'total orders': 'Orders',
            'totale ordini': 'Orders',
            'total de pedidos': 'Orders',
            'bestellungen insgesamt': 'Orders',
            
            # CPC
            'cost per click (cpc)': 'CPC',
            'cpc': 'CPC',
            'costo per clic (cpc)': 'CPC',
            'coste por clic (cpc)': 'CPC',
            
            # Metadata
            'match type': 'Match Type',
            'type de correspondance': 'Match Type',
            'correspondance': 'Match Type',
            'tipo di corrispondenza': 'Match Type',
            'tipo de coincidencia': 'Match Type',
            'match-typ': 'Match Type',
            'übereinstimmungstyp': 'Match Type',
            'tipo di match': 'Match Type',
            'kampagnenname': 'Campaign',
            
            # Impressions
            'impressions': 'Impressions',
            'impresiones': 'Impressions',
            'impressioni': 'Impressions',
            
            # Clics
            'clicks': 'Clicks',
            'clics': 'Clicks',
            'clic': 'Clicks'
        }
        
        new_columns = []
        for col in df.columns:
            # On cherche d'abord une correspondance exacte (plus robuste)
            target_found = col # Par défaut on garde le nom original
            
            # Priorité 1 : Correspondance exacte
            for key, target in mapping.items():
                if key == col:
                    target_found = target
                    break
            
            # Priorité 2 : Correspondance partielle intelligente
            if target_found == col:
                # Ordre de priorité pour éviter les faux positifs (ex: "SKU Sales" vs "Total Sales")
                search_order = ['Search Term', 'Spend', 'Sales', 'Orders', 'Clicks', 'CPC', 'Match Type', 'Campaign']
                for target_key in search_order:
                    # On cherche si l'une des clés du mapping pour ce target est dans le nom de la colonne
                    for key, target in mapping.items():
                        if target == target_key and key in col:
                            target_found = target
                            break
                    if target_found != col: break
            
            new_columns.append(target_found)
        
        # Suppression radicale des doublons de colonnes pour éviter les erreurs 'DataFrame' vs 'Series'
        df.columns = new_columns
        df = df.loc[:, ~df.columns.duplicated()]
        
        return df

    @staticmethod
    def _clean_currency_columns(df: pd.DataFrame) -> pd.DataFrame:
        """
        Nettoie les colonnes contenant des devises (ex: "$12.50" -> 12.50)
        """
        currency_cols = ['Spend', 'Sales', 'CPC']
        for col in currency_cols:
            if col in df.columns:
                # Sécurité : Si plusieurs colonnes ont le même nom, on prend la première
                if isinstance(df[col], pd.DataFrame):
                    data_series = df[col].iloc[:, 0]
                else:
                    data_series = df[col]

                if data_series.dtype == 'object':
                    # Supprime les symboles de devise, les espaces et gère la virgule européenne
                    val = data_series.astype(str).str.replace(r'[^\d,.]', '', regex=True)
                    val = val.str.replace(',', '.')
                    df[col] = pd.to_numeric(val, errors='coerce').fillna(0.0)
        
        # Nettoyage des colonnes entières (Clicks, Orders)
        int_cols = ['Clicks', 'Orders']
        for col in int_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
        
        return df

    @staticmethod
    def _calculate_missing_metrics(df: pd.DataFrame) -> pd.DataFrame:
        """
        Calcule les métriques manquantes comme l'ACOS si elles ne sont pas fournies.
        ACOS = Spend / Sales
        """
        spend_col = 'Spend' if 'Spend' in df.columns else 'Dépense' if 'Dépense' in df.columns else None
        sales_col = 'Sales' if 'Sales' in df.columns else 'Ventes' if 'Ventes' in df.columns else None
        
        if spend_col and sales_col:
            # Calcul de l'ACOS (en pourcentage)
            df['Calculated_ACOS'] = (df[spend_col] / df[sales_col].replace(0, pd.NA)) * 100
            df['Calculated_ACOS'] = df['Calculated_ACOS'].fillna(0.0)
            
        return df
