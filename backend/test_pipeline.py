import pandas as pd
from pathlib import Path
from src.ingestion.parser import AmazonReportParser
from src.economics.calculator import UnitEconomicsEngine

def run_test():
    print("=== Démarrage du Test Backend KEOXS CO-PILOT ===")

    # 1. Configuration du Gardien Financier (Module 2)
    # Exemple pour un produit vendu 29.99$
    sale_price = 29.99
    cogs = 6.50
    fba_fees = 9.50

    engine = UnitEconomicsEngine(sale_price=sale_price, cogs=cogs, fba_fees=fba_fees)
    summary = engine.get_financial_summary()
    print("\n--- Synthèse Financière ---")
    for k, v in summary.items():
        print(f"{k}: {v}")

    # 2. Simulation d'un Search Term Report (STR) (Module 1)
    print("\n--- Génération de données fictives (STR) ---")
    mock_data = {
        'Search Term': ['garlic press', 'kitchen gadgets', 'garlic mincer', 'blue garlic press', 'stainless press'],
        'Spend': ['$15.00', '$2.50', '$20.00', '$0.50', '$18.00'],
        'Sales': ['$0.00', '$29.99', '$59.98', '$0.00', '$0.00']
    }
    df_raw = pd.DataFrame(mock_data)
    
    # Sauvegarde temporaire pour tester le parseur
    test_file = Path("test_str.csv")
    df_raw.to_csv(test_file, index=False)

    # 3. Ingestion & Nettoyage
    print("\n--- Ingestion et Nettoyage ---")
    parser = AmazonReportParser()
    df_clean = parser.load_search_term_report(test_file)
    print(df_clean[['Search Term', 'Spend', 'Sales', 'Calculated_ACOS']])

    # 4. Détection du "Bleeding" (Urgences)
    print("\n--- Analyse des Pertes (Stop the Bleeding) ---")
    bleeding_df = engine.analyze_bleeding_keywords(df_clean)
    if bleeding_df.empty:
        print("Aucun mot-clé en perte critique détecté.")
    else:
        print(f"ALERTE : {len(bleeding_df)} mots-clés nécessitent une action immédiate !")
        print(bleeding_df[['Search Term', 'Spend', 'Action_Recommandee', 'Urgence']])

    # Nettoyage
    if test_file.exists():
        test_file.unlink()

if __name__ == "__main__":
    run_test()
