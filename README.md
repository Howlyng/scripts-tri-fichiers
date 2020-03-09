# scripts-tri-fichiers
Scripts de tri d'une arborescence de fichier.

# Technologies utilisées
Node.js.

# Contexte

## importDateToFile.js, index.js
Dans un premier temps, on a disposition une base de données contenant des informations sur les différents clients d'une entreprise. D'autre part, on a une arborescence de fichiers, dont le nommage ne respecte pas de norme particulère.

Le but ici est de chercher dans les noms de l'arborescence de fichiers des informations pouvant concorder avec les informations disponibles via la base de données. Si un nom de fichier comporte une information (par exemple un nom de client, une combinaison nom+prénom, un ID de client, etc), on le déplace vers une nouvelle arborescence crée à partir de l'ID de client.

L'objectif final est de trier les fichiers par ID de client afin qu'ils soient uploadés vers une nouvelle base de données.

## sortsXLSX.js

L'objectif reste le même, mais on dispose cette fois-ci d'un fichier au format .xlsx  associant (entre autres) à chaque fichier un numéro de client.

Ainsi, on parcourt désormais le .xlsx, et pour chaque ligne on vérifie dans un premier temps si le fichier existe. Si c'est le casn on le déplace dans la nouvelle arborescence.
