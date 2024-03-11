import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

let port = 3000
const user = "testuser"
const password = "PasswordTestUser"

const app = express()

app.use(cors())


async function ConnectDb() {
    try {
        await mongoose.connect(`mongodb+srv://${user}:${password}@pavan.2adjlyw.mongodb.net/test?retryWrites=true&w=majority&appName=pavan`)

        console.log('connected to database');
    }
    catch (err) {
        console.log(err?.message);
    }
}

ConnectDb()

// schema for todo application

const todoSchema = new mongoose.Schema({
    name:{type:String,required:true},
    completed:{type:Boolean,default:false}
},{timestamps:true})

// creating the collection

const todoModel = mongoose.model('todo',todoSchema)
app.use(express.json())

app.post('/',async (req,res) => {
    try {

        console.log('test connection');
        const response = await todoModel.create(req?.body)

        res.send(response)
    }
    catch (err) {
        res.send({message:err?.message})
    }
})

app.post('/update',async (req,res) => {
    try {

        const response = await todoModel.findOneAndUpdate({_id:req?.body?._id},{...req?.body},{new:true})

        res.send(response)
    }
    catch (err) {
        res.send(err?.message)
    }
})

app.get('/', async (req,res) => {
   try {
        const response = await todoModel.find()
        res.send(response)
   }
   catch (err) {
    res.send({message:err?.message})
}
})

app.patch('/toggle/:id',async (req,res) => {
    try {

        const id = req?.params?.id

        const find = await todoModel.findOne({_id:id})

        const response = await todoModel.findOneAndUpdate({_id:id},{completed:!find?.completed},{new:true})


     
        res.send(response)


    }
    catch (err) {
        res.send({message:err?.message})
    }
})


app.patch('/delete/:id',async (req,res) => {
    try  {

        const response = await todoModel?.deleteOne({_id:req?.params?.id})

        res.send(response)
    }
    catch (err) {
        res.send(err?.message)
    }
})



app.listen(port,() => {console.log(`server is listing in http://localhost:${port}`);})
