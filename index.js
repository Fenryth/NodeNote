const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const lesEvents = [
		{
  			nomEvent: "Sortie Half-Life 3",
  			dateDebut: new Date('25/08/1998').valueOf(),
  			dateFin: new Date('26/08/1998').valueOf(),
			descrEvent:"[....] -Gordon Freeman",
  			user: "bg"
  		},
  		{
  			nomEvent: "Suppression de Yasuo",
  			dateDebut: new Date('02/02/1978').valueOf(),
  			dateFin: new Date('03/02/1978').valueOf(),
            descrEvent:"ASAGI, IL MET DES TONGUES",
  			user: "MangerDodo"
  		},
  		{
  			nomEvent: "Yannick adore le Java",
  			dateDebut: new Date ('26/04/1995').valueOf(),
  			dateFin: new Date ('26/04/2095').valueOf(),
            descrEvent:"I fap on java every weeks",
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

app.get('/test', function (req, res) {
    var laDate = new Date('01/01/1999')
    var timeStampSecond = Math.floor(laDate / 1000);
    res.send(lesInscrits)
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



app.post('/events/',urlEncodedParser,function(req,res){
	res.json(getEventsByUser(req.body.user))
})


app.post('/event/add/',urlEncodedParser,function(req,res){
	res.send('ajout de l event '+ req.body.nomEvent)
	lesEvents.push({
			nomEvent: req.body.nomEvent,
  			dateDebut: new Date(req.body.dateDebut).valueOf(),
  			dateFin: new Date(req.body.dateFin).valueOf(),
        	descrEvent:req.body.descrEvent,
  			user: req.body.user
	})

	console.log(lesEvents)
})

app.post('/events/find/',urlEncodedParser,function(req,res){
    res.json(getEventByName(req.body.user,req.body.eventName))
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})


function getEventsByUser(unUser)
{
	const lesEventsUser = []
	for(unEvent of lesEvents){
		if(unEvent.user == unUser){
			lesEventsUser.push(unEvent)
		}
	}
	return lesEventsUser
}

function getEventByName(unUser,nameEvent)
{
	const lesEventsUser = getEventsByUser(unUser)
	const selectedEvents = []
	for(unEvent of lesEventsUser)
	{
		if(unEvent.nomEvent == nameEvent)
			selectedEvents.push(unEvent)
	}
	return selectedEvents
}


//middleware express cors (recup et app.use cors)