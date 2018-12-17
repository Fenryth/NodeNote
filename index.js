const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const lesEvents = [
		{
  			nomEvent: "Sortie Half-Life 3",
  			dateDebut: 2,
  			dateFin: 3,
  			user: "bg"
  		},
  		{
  			nomEvent: "Suppression de Yasuo",
  			dateDebut: 2,
  			dateFin: 3,
  			user: "MangerDodo"
  		},
  		{
  			nomEvent: "Yannick adore le Java",
  			dateDebut: 2,
  			dateFin: 3,
  			user: "YannickSushi"
  		}
];
const lesInscrits = [
	{
		nomInscr: "Herrero",
		prenomInscr: "Yannick",
		identifiant:"YannickSushi",
		pswInscr: "ILoveJava"
	},
	{
		nomInscr: "Phun-Vong",
		prenomInscr: "Morgane",
		identifiant:"MangerDodo",
		pswInscr: "coucou"
	},
	{
		nomInscr: "jvhouèmeuthousseux",
		prenomInscr: "Benjamin",
		identifiant: "bg",
		pswInscr: "miaou"
	}
];


app.get('/', function (req, res) {
  res.send('Bienvenue sur le calendrier')
})

app.get('/inscription',function(req,res){
	res.send('page d inscription')
})

app.post('/inscr/add/',urlEncodedParser,function(req,res){
	res.send('ajout de l inscrit '+ req.body.nomInscr)
	lesInscrits.push({
		nomInscr: req.body.nomInscr,
		prenomInscr: req.body.prenomInscr,
		identifiant:req.body.identifiant,
		pswInscr: req.body.pswInscr
	})
})


app.post('/event/add/',urlEncodedParser,function(req,res){
	res.send('ajout de l event '+ req.body.nom)
	lesEvents.push({
			nomEvent: req.body.nomEvent,
  			dateDebut: req.body.dateDebut,
  			dateFin: req.body.dateFin,
  			user: req.body.user
	})

	console.log(lesEvents)
})

app.post('/event/find/',urlEncodedParser,function(req,res){
		
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

function getEventsByUser(unUser)
{
	const lesEventUser = []
	for(unEvent of lesEvents)
	{
		//TODO
	}
}


//middleware express cors (recup et app.use cors)