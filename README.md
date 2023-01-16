# Webdev Interview Challenge

## Overview
At PostEra, one of our core technologies is automated
[retrosynthesis](https://en.wikipedia.org/wiki/Retrosynthetic_analysis), where
we combine ML with graph algorithms to find recipes for making complex
molecules from simpler, commercially available molecules.  These recipes are
called "synthetic routes" or "routes", and there can be many such routes, with
varying starting available molecules, reactions, risk, and cost.

We are interested in finding the best one among these routes, and this
challenge involves creating a UI to help a human chemist find the best route.
When a chemist is choosing a route, they are concerned with how many steps the
route involves, how risky each individual step is, how many intermediate
compounds they can reuse across multiple compounds they are trying to
synthesize, and an long list of other factors.

For this challenge, we will be looking at real route data from our [COVID
Moonshot](https://postera.ai/covid) drug discovery campaign.

## Cheminformatics 101
Molecules are represented in code as [SMILES
strings](https://www.daylight.com/dayhtml_tutorials/languages/smiles/index.html).
Here's an example of the SMILES for
[caffeine](https://en.wikipedia.org/wiki/Caffeine):
`CN1C=NC2=C1C(=O)N(C(=O)N2C)C`.  Don't worry about understanding the format for
now.

A retrosynthesis route is a directed bipartite graph of molecule nodes (M) and
reaction nodes (R).  Edges going from a M1 node and into a R node represent
reaction pathways that produce the M1 molecule as a product, and edges going
from a R node and into a M2 node indicate that the M2 molecule is a reactant
for that reaction.  For our purposes here, a reaction can accept multiple
reactants and produces exactly 1 product.

## Server Installation
We have a simple server implementation with FastAPI backend and React frontend.
To install dependencies:
1. Install the `conda` package/environment manager from
https://docs.conda.io/projects/conda/en/latest/user-guide/install/.  This is
necessary for the rdkit dependency (pip isn't currently supported - see
https://github.com/rdkit/rdkit/issues/1812).
2. Use `conda` to create a new environment: `conda create --name postera
python=3.8`
3. Activate the environment: `conda activate postera`
4. Install the python packages:
```
conda install --file conda-packages.txt
pip --no-cache-dir install -r requirements.txt
```
5. Install javascript dependencies:
- in frontend directory, call: `npm install`

## Run server
Inside of the conda environment, call the following in two separate terminals:
1. in the backend directory: `python main.py`
2. in the frontend directory: `npm run start`

## Instructions
What we would like to see:

1. Create a nested tree representation of the route data to be called by the
`/routes` endpoint. You will need it in a format usable by the 
[react-d3-tree package](https://www.npmjs.com/package/react-d3-tree).
- You will need to use the `reactions` information in the `routes.json` file
to nest the sources by their target, where the parents are the `target` values,
and the children are the `sources` lists.
- Only display one route at a time by doing one of the following:
A. Always return all route data to the frontend, and let user select which
route to be displayed
B. Have user select which route to be displayed and then only query that route
from the backend

2. Display routes to the user with the react-d3-tree package
(demo [here](https://bkrem.github.io/react-d3-tree/)).
- Each molecule should be represented as a node, initially labeled with their
SMILES representation

3. Add images to the molecule nodes
- The `/molecule` endpoint (with some work) will serves SVG images that can be used

4. Add some features to the routes
There are alot of cool things we can think about adding to this representation
of the routes. Try to implement one of the following features:
- When you hover over a molecule, add the reaction name to make that
molecule
- When hover over any molecule, display its respective information from the
`molecules` information in the route
- Come up with a plan (don't need to implement it fully) about how we could
display information about routes which is overlapping, i.e. if two routes have
some of the same molecules, or some of the same reactions/reaction names,
how could we present this information to the user?

We'll ask you to give us a tour of what you've built and share with us how you
technically approached the problem.
