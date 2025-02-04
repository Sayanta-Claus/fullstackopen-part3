const express = require('express')
const app=express()
const morgan=require('morgan')
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
    });
    // we are using the host parameter
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const daycodes=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const months=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']
const generateID=()=>{
    return Math.floor(Math.random()*1000)
}


app.get('/',(req,res)=>{
    console.log("Home page")
})

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
    const id=req.params.id;
    const person = persons.find((p)=>p.id===id)
    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id=req.params.id;
    persons=persons.filter((p)=>{
        return p.id !== id
    })
    res.status(204).end()
})

app.post('/api/persons',(req,res)=>{
    const body=req.body;
    if(!body.name){
        return res.status(400).json({
            error:'name missing'
        })
    }
    if(!body.number){
        return res.status(400).json({
            error:'number missing'
        })
    }
    if (persons.find((p) => p.name === body.name)) {
            return res.status(400).json({
            error: 'Name must be unique'
            });
             }
    const person= {
        id:generateID(),
        name:body.name,
        number:body.number
    }
    persons=persons.concat(person)
    res.json(person)
})


app.get('/info',(req,res)=>{
   const date= new Date();
    const string = `${daycodes[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT${date.getTimezoneOffset()}`
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${string}</p>`)
})


const PORT= process.env.PORT||3001
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})