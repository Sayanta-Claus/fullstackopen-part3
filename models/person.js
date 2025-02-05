const mongoose= require('mongoose')


const url=process.env.MONGODB_URL
mongoose.set('strictQuery',false)

mongoose.connect(url).then(res => {
  console.log('connected to database')
}).catch(err => {
  console.log('error while connecting',err.message)
})


const personSchema=new mongoose.Schema({
  name:{
    type :String,
    minLength: 3,
    validate:{
      validator:function(v){
        return v.length>=3
      },
      message:props => `${props.value} is not a valid name! Atleast 3 characters are needed`
    }
  },
  number:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?:\d{2,3}-\d+)$/.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports=mongoose.model('Person',personSchema)
