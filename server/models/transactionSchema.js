
const mongoose=require('mongoose');
let Schema=mongoose.Schema;

let transactionSchema=new Schema({
    blockHash:{type:String},
    blockNumber:{type:String},
    confirmations:{type:String},
    contractAddress:{type:String},
    cumulativeGasUsed:{type:String},
    from:{type:String},
    gas:{type:String},
    gasPrice:{type:String},
    gasUsed:{type:String},
    hash:{
        type:String, 
        unique:true
    },
    input:{type:String},
    isError:{type:String},
    nonce:{type:String},
    timeStamp:{type:Number},
    to:{type:String},
    transactionIndex:{type:String},
    txreceipt_status:{type:String},
    value:{type:String},
    IsBookmarked:{type:Boolean},
    IsBlacklisted:{type:Boolean},
})

module.exports=mongoose.model('Transactions',transactionSchema,'Transactions');