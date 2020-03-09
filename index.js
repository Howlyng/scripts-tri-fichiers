/* On parcourt une arborescence de fichiers afin de trouver des correspondances entre les noms de fichiers et les entrées contenues dans un fichier data. */
/* Data est obtenu en utilisant importDataToFile.js */

"use strict";
var fs = require('fs');
var mkdirp = require('mkdirp');
var mv = require('mv');
var path = process.argv[2];
var nbResult = 0;
var nbItem = 0;

if (!path) {
    console.log('Filepath needed.')
} else {
    if (fs.access(path, (err) => {
            if (!err) {
                fs.readdir(path, (err, items) => {
                    if (items.length == 0) {
                        console.log('Directory is empty.')
                    } else {
                        fs.readFile('./data', 'utf8', (err, data) => {
                            var result;
                            if (err) console.log(err)
                            else {
                                result = JSON.parse(data);
                            }


                            for (var item in items) {
                                nbItem++;
                                var nameSplitted = items[item].split('-');
                                var nameCleansed = nameSplitted.slice(5, nameSplitted.length);
                                for (var name in nameCleansed) {
                                    var itemFound = null;
                                    var nbNom = 0;
                                    var foundByName = false;
                                    for (var res in result) {
                                        /*** pol_refContrat ***/
                                        if (itemFound == null &&                                            
                                            nameCleansed[name].length >= result[res]['pol_refContrat'].length &&
                                            nameCleansed[name].includes(result[res]['pol_refContrat']) &&
                                            result[res]['pol_refContrat'].length >= 7) {
                                            console.log(nameCleansed[name] + ' : ' + result[res]['pol_refContrat']);
                                            console.log('TRI POLICE');
                                            itemFound = result[res];
                                        }
                                        /*** sin_num_dossier ***/
                                        else if (itemFound == null &&
                                            result[res]['sin_num_dossier'] != null &&
                                            nameCleansed[name].length >= result[res]['sin_num_dossier'].length &&
                                            nameCleansed[name].includes(result[res]['sin_num_dossier']) &&
                                            result[res]['sin_num_dossier'].length >= 6) {
                                            console.log(nameCleansed[name] + ' : ' + result[res]['sin_num_dossier']);
                                            console.log('TRI SINISTRE');
                                            itemFound = result[res];
                                        }
                                        /*** ent_nom + ent_prenom ***/
                                        else if (itemFound == null &&
                                            result[res]['ent_prenom'] != null &&
                                            result[res]['ent_prenom'] !== '' &&
                                            (nameCleansed[name].toUpperCase()).includes(result[res]['ent_nom'].toUpperCase()) &&
                                            (nameCleansed[name].toUpperCase()).includes(result[res]['ent_prenom'].toUpperCase())) {
                                            console.log(nameCleansed[name] + ' : ' + result[res]['ent_nom'] + ' ' + result[res]['ent_prenom']);
                                            console.log('TRI NOM + PRENOM');
                                            itemFound = result[res];

                                        }
                                        /*** ent_nom ***/
                                        else if (result[res]['ent_nom'] !== '' &&
                                            (result[res]['ent_prenom'] == null ||
                                            result[res]['ent_prenom'] == '') &&
                                            nameCleansed[name].length >= result[res]['ent_nom'].length &&
                                            (nameCleansed[name].toUpperCase()).includes(result[res]['ent_nom'].toUpperCase()) &&
                                            result[res]['ent_nom'].length >= 7) {
                                            console.log(nameCleansed[name] + ' : ' + result[res]['ent_nom']);
                                            console.log('TRI NOM');
                                            itemFound = result[res];
                                            nbNom++;
                                            foundByName = true;
                                        }

                                        if (itemFound != null && !foundByName) {
                                            var folderPath = path + '\\RESSOURCE\\' + itemFound['ent_type'] + '\\' + itemFound['ent_numero'] + '\\';
                                            sortFile(folderPath, items[item]);
                                            itemFound = null;
                                        }
                                    }
                                    // /*** ent_nom ***/
                                    if (nbNom == 1 && foundByName) {
                                        var folderPath = path + '\\RESSOURCE\\' + itemFound['ent_type'] + '\\' + itemFound['ent_numero'] + '\\';
                                        sortFile(folderPath, items[item]);
                                        itemFound = null;
                                        console.log('TEST - TRUE');
                                    } else if (nbNom != 1) {
                                        console.log('TEST - FALSE');
                                        itemFound = null;
                                    }
                                }
                            }
                            console.log('Total files : ' + nbItem);
                            console.log('Files sorted : ' + nbResult);
                        });
                    }
                })
            } else {
                console.log('Wrong filepath name.');
                process.exit(1);
            }
        }));
}

function sortFile(folderPath, file) {
    if (!(fs.existsSync(folderPath + file))) {
        mkdirp.sync(folderPath);
        fs.copyFileSync(path + '\\' + file, folderPath + file);
        nbResult++;
        console.log('------');
        console.log(nbResult);
        console.log('------');
    }
}
