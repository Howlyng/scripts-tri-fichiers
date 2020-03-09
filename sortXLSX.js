/* On a à disposition une arboresence de fichiers répertoriée dans un .xlsx, qui associe chaque fichier à un numéro de client. */
/* Pour chaque ligne du .xlsx, on déplace le fichier corrrespondant dans une nouvelle arborescence de fichiers créée à partir (entre autres) de l'ID du client. */

var xlsx = require('xlsx');
var fs = require('fs');
var mkdirp = require('mkdirp');



var path = process.argv[2]; // Path spécifié pour concevoir l'arborescence de fichiers.
var dataID = JSON.parse(fs.readFileSync('./dataID', 'utf8')); 
newr = [];
dataID.map((value, index) => {
    newr[value.ent_numero] = value;
})
var workbook = xlsx.readFileSync('../Geide.xlsx');
var sheet_name_list = workbook.SheetNames;
var dataXLSX = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); // On parse le .xlsx fourni
for (var line in dataXLSX) { // Pour chaque ligne dans le .xlsx, on récupère le numéro de client et on tente de déplacer le fichier associé
    var num_client = dataXLSX[line]['num_client'];
    console.log(dataXLSX[line]['document'], newr[num_client].ent_id, newr[num_client].ent_type);
    moveFile(dataXLSX[line]['document'], newr[num_client].ent_id, newr[num_client].ent_type);

}


function moveFile(file, id, type) {
    var filepath = path + file;
    var folderPath = path + '/RESSOURCE/' + type + '/' + id + '/';
    if (!fs.existsSync(filepath)) { // Si le fichier n'existe pas dans l'arborescence fournie
        if (!fs.existsSync(folderPath + file)){ // Si le fichier n'existe pas dans la nouvelle arborescence
            fs.appendFileSync('./notFound', file + ' --- '); // On met à jour la liste des fichiers non trouvés dans l'arborescence de fichiers fournie
        }
        else{
            console.log('Already sorted.'); // Le fichier est déjà trié
        }
    } else {
        if (!(fs.existsSync(folderPath + file))) { // Si le fichier n'existe pas dans la nouvelle arborescence
            mkdirp.sync(folderPath); // On crée le répertoire (ne fait rien s'il existe déjà)
            fs.renameSync(filepath, folderPath + file); // On déplace le fichier
            console.log(file + ' moved successfully.');
        }

    }
}

// TODO :
// 1. Importer les id depuis la DB
// 2. Parcourir les lignes du tableau
// 3. Récupérer l'id dans le tableau
// 4. Trouver la correspondance
// 5. Chercher le répertoire correspondant
// 5-bis. Créer le répertoire s'il n'existe pas
// 6. Déplacer le fichier correspondant

