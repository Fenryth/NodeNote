//instanciation de l'API
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const cors = require('cors')

//instanciation de JWT
const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt;
const secret = 'ofMana'
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}
const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, next) {
    const user = getUserByIdentifiant(payload.user.identifiant)
    if (user) {
        next(null, user)
    } else {
        next(null, false)
    }
})
passport.use(jwtStrategy)


app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.json())
app.options('*',cors())

//Création des variables d'import
var requireEvent = require('./src/events')
var requireInsrit = require('./src/accounts')


//Récupération des données
var lesEvents = requireEvent.getLesEvents()
var lesInscrits = requireInsrit.getInscrits()

//Création des routes

app.get('/events/',passport.authenticate('jwt',{session: false}), function (req, res) {
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token,secret)
    let eventsByUser = trierListEvent().filter((unEvent)=>{
        return unEvent.user === decoded.user.identifiant
    })
    res.send(eventsByUser)
})

app.post('/events/',passport.authenticate('jwt',{session: false}),urlEncodedParser,function(req,res){
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token,secret)
    const newEvent = {
        idEvent:getNextIDEvent(),
        nomEvent: req.body.nomEvent,
        dateDebut: new Date(req.body.dateDebut).toUTCString(),
        dateFin: new Date(req.body.dateFin).toUTCString(),
        descrEvent:req.body.descrEvent,
        user: decoded.user.identifiant
    }
    lesEvents.push(newEvent)
    res.status(201).json({newEvent: newEvent})
})

app.delete('/events/:id',passport.authenticate('jwt',{session: false}),urlEncodedParser,function(req,res){
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token,secret)
    if( getEventById(+req.params.id).user === decoded.user.identifiant )
    {
        lesEvents = lesEvents.filter((currentEvent)=> currentEvent.idEvent !== +req.params.id)
        let eventsByUser = trierListEvent().filter((unEvent)=>{
            return unEvent.user === decoded.user.identifiant
        })
        res.status(200).json({ listEvent: eventsByUser})
    }
    else{
        res.status(403).json({error:"Vous n'avez pas le droit de gerer cette ressource"})
    }
})


app.post('/inscr/',urlEncodedParser,function(req,res){
    if(!getUserByCredential(req.body.identifiant,req.body.pswInscr))
    {
        res.send('ajout de l inscrit '+ req.body.nomInscr)
        lesInscrits.push({
            idInscr: getNextIDInscrt(),
            nomInscr: req.body.nomInscrit,
            prenomInscr: req.body.prenomInscr,
            identifiant:req.body.identifiant,
            pswInscr: req.body.pswInscr
        })
    }
    else
    {
        res.status(403).json({newEvent: "La personne existe déjà"})
    }

})


app.get('/events/:id',passport.authenticate('jwt',{session: false}),urlEncodedParser,function(req,res){
    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token,secret)
    let leEvent = getEventById(+req.params.id)
    if(leEvent)
    {
        if( leEvent.user === decoded.user.identifiant )
            res.json(leEvent)
        else
            res.status(403).json({error:"Vous n'avez pas le droit de gerer cette ressource"})
    }
    res.status(404).json({ error: 'Evenement non trouvé'})

})


app.post('/login',function(req,res) {
    let leUser = getUserByCredential(req.body.user,req.body.pswInscr)
    if (!leUser) {
        return  res.status(401).json({ error: 'Combinaison identifiant/mdp non valide'})
    }
    else
    {
        let userLessMdP = {
            ...leUser,
        }
        delete userLessMdP.pswInscr
        const userJwt = jwt.sign({ user: userLessMdP }, secret)
        res.status(200).json( {token:userJwt})
    }
})


app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

function getEventById(unIdEvent)
{
    return lesEvents.find((event) => event.idEvent === unIdEvent)
}


function getUserByCredential(unIdentifiant,unMdp)
{
    let laPersonne = null
    for(unInscr of lesInscrits)
    {
        if(unInscr.identifiant == unIdentifiant && unInscr.pswInscr == unMdp)
        {
            laPersonne = unInscr
            break
        }
    }
    return laPersonne
}

function getNextIDEvent()
{
    let lesEventsTriee = [ ...lesEvents].sort((prev,next)=>{
        return prev.idEvent > next.idEvent
    })

    return lesEventsTriee[lesEventsTriee.length-1].idEvent +1
}

function getNextIDInscrt()
{
    let lesInscrTriee = [ ...lesInscrits].sort((prev,next)=>{
        return prev.idInscr > next.idInscr
    })

    return lesInscrTriee[lesInscrTriee.length-1].idEvent +1
}

function trierListEvent()
{
    return [ ...lesEvents].sort((prev,next)=>{
        return new Date(prev.dateDebut) > new Date(next.dateDebut)
    })
}

function getUserByIdentifiant(unIdentifiant){

    let laPersonne = null
    for(unInscr of lesInscrits)
    {
        if(unInscr.identifiant == unIdentifiant)
        {
            laPersonne = unInscr
            break
        }
    }

    return laPersonne
}