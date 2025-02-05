const express = require('express')
require('dotenv').config()
const app=express()
const morgan=require('morgan')
const Person=require('./models/person')
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
    });
    // we are using the host parameter
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

const daycodes=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const months=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']
const generateID=()=>{
    return Math.floor(Math.random()*1000)
}


app.get('/',(req,res)=>{
    console.log("Home page")
})

app.get('/api/persons',(req,res)=>{
    Person.find({}).then(result=>{
            res.json(result)
        })
})

app.get('/api/persons/:id',(req,res)=>{
    const id=req.params.id;
    Person.findById(id).then(person=>{
        res.json(person)
    })
})

app.delete('/api/persons/:id',(req,res,next)=>{
    const id=req.params.id;
   Person.findByIdAndDelete(id).then(result=>{
    res.status(204).end()
   }).catch(err=>next(error))
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
    // if (persons.find((p) => p.name === body.name)) {
    //         return res.status(400).json({
    //         error: 'Name must be unique'
    //         });
    //          }
    const person= new Person({
        name:body.name,
        number:body.number
    })
    person.save().then(newP=>{
        res.json(newP)
    })
    
})


app.put('/api/persons/:id',(req,res,next)=>{
    const id=req.params.id;
    const body=req.body
    const person={
        name:body.name,
        number:body.number,
    }
    Person.findByIdAndUpdate(id,person,{new:true}).then(updatedP=>{
        res.json(updatedP)
    }).catch(err=>next(err))
})





const errorHandler= (error,req,res,next)=>{
    console.error(error.message)
    if(error.name==='CastError'){
        return res.status(400).send({
            error:'malformatted id'
        })
    }
    next(error)
}
app.use(errorHandler)




// app.get('/info',(req,res)=>{
//    const date= new Date();
//     const string = `${daycodes[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT${date.getTimezoneOffset()}`
//     res.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${string}</p>`)
// })


const PORT= process.env.PORT||3001
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})





// "build:ui":"rm -rf dist && cd ../fullstackopen/part2/phonebook && npm run build && cp -r dist ../../../fullstackopen-part3",
    // "deploy:full":"npm run build:ui && git add . && git commit -m uibuild && git push"