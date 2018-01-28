const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('c9','root',"",{
	dialect : 'mysql'

})

const Project= sequelize.define('project', {
  name : Sequelize.STRING
    
})

const Note = sequelize.define('note', {
  project_name : Sequelize.STRING,
	content : Sequelize.TEXT,
	  user : Sequelize.STRING
})

Project.hasMany(Note,{foreignKey:'projectId'});
Note.belongsTo(Project,{foreignKey:'projectId'});


const app = express()
app.use(bodyParser.json())



app.get('/create', (req, res) => {
	sequelize.sync({force : true})
		.then(() => res.status(201).send('tables created'))
		.catch(() => res.status(500).send('general error'))	
})

app.get('/projects', (req, res) => {
	Project.findAll()
		.then((results) => {
			res.status(200).json(results)
		})
		.catch(() => res.status(500).send('general error'))			
})

app.post('/projects', (req, res) => {
	Project.create(req.body)
		.then(() => {
			res.status(201).send('created')
		})
		.catch(() => res.status(500).send('general error'))
})

app.get('/projects/:id', (req, res) => {
	Project.findById(req.params.id)
		.then((result) => {
			if (result){
				res.status(200).json(result)
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.catch(() => res.status(500).send('error'))
})

app.put('/projects/:id', (req, res) => {
	Project.findById(req.params.id)
		.then((result) => {
			if (result){
				return result.update(req.body)
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then(() => {
			res.status(201).send('modified')
		})
		.catch(() => res.status(500).send('error'))
})

app.delete('/projects/:id', (req, res) => {
	Project.findById(req.params.id)
		.then((result) => {
			if (result){
				return result.destroy()
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then(() => {
			res.status(201).send('removed')
		})
		.catch(() => res.status(500).send('error'))
})

app.get('/projects/:pid/notes', (req, res) => {
	Project.findById(req.params.pid)
		.then((result) => {
			if (result){
				return result.getNotes();  
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then((results) => {
			res.status(200).json(results)
		})
		.catch(() => res.status(500).send('error'))
})




app.get('/projects/:pid/notes/:nid', (req, res) => {
	Project.findById(req.params.pid)
		.then((result) => {
			if (result){
				return result.getNotes({where : {id : req.params.nid}})
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then((result) => {
			if (result){
				res.status(200).json(result)
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.catch(() => res.status(500).send('error'))	
})

app.post('/projects/:pid/notes', (req, res) => {
	Project.findById(req.params.pid)
		.then((result) => {
			if (result){
				let note = req.body
				note.projectId = result.id
				return Note.create(note)
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then(() => {
			res.status(201).json('created')
		})
		.catch((er) => res.status(500).send('error'))
})


app.put('/projects/:pid/notes/:nid', (req, res) => {
	Note.findById(req.params.nid)
		.then((notes) => {
			if (notes){
				return notes.update(req.body)
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then(() => {
			res.status(201).send('modified')
		})
		.catch(() => res.status(500).send('error'))
})

app.delete('/projects/:pid/notes/:nid', (req, res) => {
	Note.findById(req.params.nid)
		.then((notes) => {
			if (notes){
				return notes.destroy()
			}
			else{
				res.status(404).send('not found')	
			}
		})
		.then(() => {
			res.status(201).send('removed')
		})
		.catch(() => res.status(500).send('error'))
})



app.listen(8080)