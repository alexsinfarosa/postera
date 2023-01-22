from fastapi import FastAPI, Response
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
    data = []
    with open("/Users/alex/code/webdev_interview_challenge-master/backend/app/routes.json", 'r+') as f:
        data = json.load(f)

    def make_node(name):
        return {'name': name, 'children': []}

    tree = {'name': 'root', 'children': []}
    for i, route in enumerate(data, start=1):
        reactions = route['reactions']
        if len(reactions) == 1:
            node = {
                'name': reactions[0]['target'],
                'attributes': {'id': i, 'name': reactions[0]['name'], 'score': route['score'], 'molecules': route['molecules'], 'disconnections': route['disconnections'], 'reaction': reactions[0]},
                'children': list(map(make_node, reactions[0]['sources']))
            }
            tree['children'].append(node)
        else:
            for reactionI in reactions:
                parent = {}
                for reactionJ in reactions:
                    if reactionI['target'] in reactionJ['sources']:
                        found = reactionJ
                        if found:
                            parent = {
                                'name': found['target'],
                                'attributes': {'id': i, 'name': found['name'], 'score': route['score'], 'molecules': route['molecules'], 'disconnections': route['disconnections'], 'reaction': found},
                                'children': list(map(make_node, found['sources']))
                            }
                            for child in parent['children']:
                                if child['name'] == reactionI['target']:
                                    child['attributes'] = {'name': reactionI['name'], 'molecules': route['molecules'],'reaction': reactionI}
                                    child['children'] = list(map(make_node, reactionI['sources']))
                        tree['children'].append(parent)
    return tree

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
    # TODO: return svg image
    return {
        "data": Response(content=molecule, media_type="image/svg+xml"),
    }

@app.get("/routes", tags=["routes"])
async def get_routes() -> dict:
    routes = make_routes()
    return {
        "data": routes,
    }
