from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import rdkit.Chem as Chem
import rdkit.Chem.Draw

import json


app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000",
]
# If using VSCode + windows, try using your IP 
# instead (see frontent terminal)
#origins = [
#    "http://X.X.X.X:3000",
#    "X.X.X.X:3000"
#]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



def make_routes():
    # TODO: use this method to return routes as a tree data structure.
    # routes are found in the routes.json file
    routes = []
    with open("/Users/alex/code/webdev_interview_challenge-master/backend/app/routes.json", 'r+') as f:
        routes = json.load(f)
    return routes

def draw_molecule(smiles: str):
    mol = Chem.MolFromSmiles(smiles)
    img = Chem.Draw.MolsToGridImage([mol], molsPerRow=1, useSVG=True)
    return img

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {
        "message": "Welcome to your app.",
    }

@app.get("/molecule", tags=["molecule"])
async def get_molecule(smiles: str) -> dict:
    molecule = draw_molecule(smiles)
    print(molecule)
    # TODO: return svg image
    return {
        "data": molecule,
    }

@app.get("/routes", tags=["routes"])
async def get_routes() -> dict:
    routes = make_routes()
    return {
        "data": routes,
    }
