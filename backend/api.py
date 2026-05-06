from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import shutil
import os
from pathlib import Path
from src.ingestion.parser import AmazonReportParser
from src.economics.calculator import UnitEconomicsEngine
from src.ai.brain import KeoxsBrain

app = FastAPI(title="Keoxs Co-Pilot API")

# Enable CORS for the Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class SetupConfig(BaseModel):
    apiKey: str
    aiModel: str = "gemini-2.5-flash"
    salePrice: float
    cogs: float
    fbaFees: float
    wastedSpendThreshold: int = 10

# Simulation de base de données (persistence locale)
CONFIG_FILE = Path("config.json")

def load_config():
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_config(config):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f)

config_db = load_config()

@app.post("/api/setup")
async def setup_agent(config: SetupConfig):
    """
    Endpoint appelé par le Setup Wizard pour configurer l'agent.
    """
    if not config.apiKey.startswith("AIza"): # Validation basique Google AI Studio Key
        raise HTTPException(status_code=400, detail="Clé API Google AI Studio invalide.")
    
    config_db["user_config"] = config.dict()
    save_config(config_db)
    
    return {
        "status": "success",
        "message": "Configuration sauvegardée avec succès.",
        "data": config_db["user_config"]
    }

class ModelsRequest(BaseModel):
    apiKey: str

@app.post("/api/models")
async def get_models(req: ModelsRequest):
    try:
        import google.generativeai as genai
        genai.configure(api_key=req.apiKey)
        # Filtre pour ne garder que les modèles de texte de la famille Gemini
        exclude_words = ['vision', 'embedding', 'audio', 'tts', 'image', 'robotics']
        models = [
            m.name.replace("models/", "") 
            for m in genai.list_models() 
            if 'gemini' in m.name and not any(word in m.name.lower() for word in exclude_words)
        ]
        return {"status": "success", "models": models}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Impossible de récupérer les modèles: {str(e)}")

@app.get("/api/status")
async def get_status():
    return {"status": "Agent Prêt", "configured": "user_config" in config_db}

from fastapi import FastAPI, UploadFile, File, HTTPException, Form

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), lang: str = Form("fr")):
    """
    Endpoint pour uploader et analyser un rapport Amazon.
    """
    if "user_config" not in config_db:
        raise HTTPException(status_code=400, detail="Veuillez d'abord configurer l'agent (Module 2).")

    # Création d'un dossier temporaire pour stocker le fichier
    upload_dir = Path("temp_uploads")
    upload_dir.mkdir(exist_ok=True)
    file_path = upload_dir / file.filename

    try:
        # Sauvegarde du fichier
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Ingestion & Nettoyage (Module 1)
        parser = AmazonReportParser()
        df_clean = parser.load_search_term_report(file_path)

        # 2. Analyse Complète (FLOWCHART KEOXS)
        config = config_db["user_config"]
        engine = UnitEconomicsEngine(
            sale_price=config["salePrice"],
            cogs=config["cogs"],
            fba_fees=config["fbaFees"],
            clicks_threshold=config.get("wastedSpendThreshold", 10)
        )

        analysis_results = engine.run_full_analysis(df_clean, lang=lang)
        
        # Préparation de la réponse
        results = {
            "summary": engine.get_financial_summary(),
            "bleeding": analysis_results["bleeding"][:50],
            "optimizations": analysis_results["optimizations"][:50],
            "opportunities": analysis_results["opportunities"][:50],
            "total_bleeding_count": len(analysis_results["bleeding"]),
            "total_optimization_count": len(analysis_results["optimizations"]),
            "total_opportunity_count": len(analysis_results["opportunities"]),
            "full_data": analysis_results["full_data"][:200],
            "debug_info": analysis_results.get("debug_info", {}),
            "filename": file.filename
        }

        return {
            "status": "success",
            "data": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement du fichier : {str(e)}")
    finally:
        # Suppression du fichier temporaire après traitement
        if file_path.exists():
            file_path.unlink()

class AIContextPayload(BaseModel):
    context: str
    analysis_data: dict
    lang: str = "fr"

@app.post("/api/ai-analysis")
async def ai_analysis(payload: AIContextPayload):
    if "user_config" not in config_db:
        raise HTTPException(status_code=400, detail="Configuration manquante. Configurez l'agent.")
    
    api_key = config_db["user_config"].get("apiKey")
    ai_model = config_db["user_config"].get("aiModel", "gemini-2.5-flash")
    if not api_key:
        raise HTTPException(status_code=400, detail="Clé API Google manquante.")

    try:
        brain = KeoxsBrain(api_key=api_key, model_name=ai_model)
        # On passe le contexte et les données JSON
        report = brain.generate_analysis(
            context_text=payload.context, 
            analysis_data=payload.analysis_data,
            lang=payload.lang
        )
        return {"status": "success", "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur du Cerveau IA : {str(e)}")

class ExportPayload(BaseModel):
    analysis_data: dict
    lang: str = "fr"

@app.post("/api/export-bulk")
async def export_bulk(payload: ExportPayload):
    try:
        from fastapi.responses import StreamingResponse
        import io
        import pandas as pd
        
        data = payload.analysis_data.get("full_data", [])
        if not data:
            raise HTTPException(status_code=400, detail="Aucune donnée à exporter.")
            
        df = pd.DataFrame(data)
        
        # Filtrer uniquement les lignes qui ont une action à réaliser (ignorer les Monitor)
        action_df = df[~df['action'].str.contains("Monitor|En attente", case=False, na=False)].copy()
        
        if action_df.empty:
            raise HTTPException(status_code=400, detail="Aucune action requise (tout est à Monitor).")
            
        # Préparation d'un fichier plat CSV
        # On renomme et ordonne les colonnes
        export_df = action_df[["campaign", "term", "match_type", "action", "suggested_bid", "clicks", "spend", "sales", "acos"]]
        export_df.columns = ["Campaign", "Keyword / Search Term", "Match Type", "Keoxs Action", "Suggested Bid", "Clicks", "Spend", "Sales", "ACOS (%)"]
        
        output = io.StringIO()
        export_df.to_csv(output, index=False, sep=";")
        output.seek(0)
        
        headers = {
            'Content-Disposition': 'attachment; filename="Keoxs_Bulk_Actions.csv"'
        }
        return StreamingResponse(output, headers=headers, media_type='text/csv')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'export : {str(e)}")
