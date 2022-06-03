const express = require('express')
const cors = require('cors')
const { request } = require('express')
const app = express()
app.use(cors())

const PORT = 8000

const stuff = {}
const history = []

let bank = 1000
let timesPlayed = 0;
let timesWon = 0; 

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.get('/api/deposit/:amount',(request,response)=>{
    bank +=  Number(request.params.amount)
    response.json({
        "balance":bank
    })
})

app.get('/api/:betamount/:numbers',(request,response)=>{
    const betAmount = Number(request.params.betamount)
    const bets = Array.from(request.params.numbers.split(',')).map(item=>Number(item))
    console.log(betAmount,bets)
    let winningNumber;
    let profit
    winningNumber = spinWheel()
    profit = 0;
    if (bets.includes(winningNumber)){
        profit = (betAmount * 36) - (betAmount*bets.length)
        bank += profit
        timesPlayed+=1
        timesWon+=1
    }else{
        bank -= (betAmount*bets.length)
        timesPlayed += 1
    }
    response.json({
        "number": winningNumber,
        "balance":bank,
        "amountWon":profit,
        "timesPlayed":timesPlayed,
        "timesWon":timesWon,
        "numbersBet":bets.length
    })

})

function spinWheel(){
    let result = Math.ceil((Math.random()*38))
    history.unshift(result)
    console.log(history)
    return result

}

app.listen(process.env.PORT || PORT, ()=>{
    console.log('server is up')
})
