/* On récupère les datas d'un DB sous forme de fichier. */

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var fs = require('fs');


const config = {
    userName : 'risk',
    password : 'risk',
    server : 'MSI',
    options :{
        port : '6666',
        instancename : 'SQLExpress',
        database : 'solva'
    }
};

var connection = new Connection(config);
connection.on('connect', err => {
    if (err) {
        console.log('Connection failed');
    }
    else {
        var result = [];

        // Requête SQL
        request = new Request('SELECT ent_id, ent_type, ent_nom, ent_nom2, ent_prenom, ent_numero, pol_refContrat, sin_num_dossier FROM (Entreprise JOIN Police ON ent_id = Entreprise_ent_id) FULL JOIN Sinistre ON pol_id = Police_pol_id', (err, rowCount) => {
            if (err) {
                console.log('Request failed');
            }
            else {
                console.log(rowCount + ' line(s) found');
            }
            fs.writeFile('./data', JSON.stringify(result), err => {
                console.log(err||'Saved');
            });
            connection.close();
        });

        request.on('row', columns => {
            var client = {};
            client.ent_id = columns[0].value;
            client.ent_type = columns[1].value;
            client.ent_nom = columns[2].value;
            client.ent_nom2 = columns[3].value;
            client.ent_prenom = columns[4].value;
            client.ent_numero = columns[5].value;
            client.pol_refContrat = (columns[6].value).trim();
            client.sin_num_dossier = columns[7].value;
            result.push(client);
        });

        connection.execSql(request);
    }
    
});

