const mongoose= require('mongoose')

if(process.argv.length<3){
  console.log('give password atleast')
  process.exit(1)
}


if(process.argv.length===4){
  console.log('insuffcient number of arguments')
  process.exit(1)
}

const password=process.argv[2]
const url=`mongodb+srv://sayantan251204:${password}@phonebook.q2wk4.mongodb.net/person?retryWrites=true&w=majority&appName=phonebook`
mongoose.set('strictQuery',false)
mongoose.connect(url)



const personSchema=new mongoose.Schema({
  name:String,
  number:Number,
})

const Person=mongoose.model('Person',personSchema)

if(process.argv.length===5){

  const person=new Person({
    name:process.argv[3],
    number:process.argv[4]
  })

  person.save().then(res => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}


else if(process.argv.length===3){
  console.log('phonebook')
  Person.find({}).then(res => {
    res.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })

}








