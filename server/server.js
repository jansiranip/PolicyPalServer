var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser');
const dbconfig  = require('../config');
var Promise=require('promise');
var cors=require('cors');
var Web3 = require('web3');
var axios = require('axios');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var router=express.Router();
var Transactions = require('./models/transactionSchema');



var mongoose=require('mongoose')
mongoose.Promise=global.Promise;

var str="";





const address = '0xfedae5642668f8636a11987ff386bfd215f942ee';
const serviceUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&page=1&offset=10&sort=asc`;
let web3 = new Web3();
console.log('No Web3 Detected... using HTTP Provider');
web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/PF866njwnchxjDmF9lpy'));

// Wrapper for Web3 callback
promisify = inner =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        }));

let result =[];
let lastBlock ="" ;
async function getBlocks(startBlock="", endBlock=""){
    let results =[];
    if(startBlock =="" && endBlock ==""){
        const startBlockPromise = await axios.get(serviceUrl);
        const endBlockPromise = promisify(cb => web3.eth.getBlockNumber(cb));
        results = await Promise.all([startBlockPromise, endBlockPromise]);
        if(results.length > 0){
            const startBlock = results[0].data.result[0].blockNumber;
            const endBlock = results[1];
            
        }
    return results;
    }
}
// Request
async function retrieveBlocks() {
    //const startBlockPromise = await axios.get(serviceUrl);
    //const endBlockPromise = promisify(cb => web3.eth.getBlockNumber(cb));

    //const results = await Promise.all([startBlockPromise, endBlockPromise]);
    const results = await getBlocks();
    if(results.length > 0){
        const startBlock = results[0].data.result[0].blockNumber;
        const endBlock = results[1];

        console.log(results);
        const tempBlock = parseInt(startBlock) + 20;
        const serviceURL = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc`;
        axios.get(serviceURL)
            .then((response) => {
                //console.log(response.data);
                //res.json(response);
                result = response.data.result;
                //console.log(result);
                result.forEach(transaction => {
                    var transactions = new Transactions({
                        blockHash:transaction.blockHash,
                        blockNumber:transaction.blockNumber,
                        confirmations:transaction.confirmations,
                        contractAddress:transaction.contractAddress,
                        cumulativeGasUsed:transaction.cumulativeGasUsed,
                        from:transaction.from,
                        gas:transaction.gas,
                        gasPrice:transaction.gasPrice,
                        gasUsed:transaction.gasUsed,
                        hash:transaction.hash,
                        input:transaction.input,
                        isError:transaction.isError,
                        nonce:transaction.nonce,
                        timeStamp:transaction.timeStamp,
                        to:transaction.to,
                        transactionIndex:transaction.transactionIndex,
                        txreceipt_status:transaction.txreceipt_status,
                        value:transaction.value,
                        IsBookmarked:false,
                        IsBlacklisted:false,
                    });
                    lastBlock = transaction.blockNumber;
                    Transactions.find({hash:transaction.hash}).exec()
                    .then(function(txData){
                        let txData1 = txData;
                        console.log(txData1.length);
                        if(txData1.length>0){
                            console.log("document exists");
                        }
                        else{
                            transactions.save(function(err, transactions) {  
                                console.log("NEWEWWWWWq1");
                                 if (!err) {  
                                     console.log(transactions);
                                 } else {  
                                     //res.statusCode = 500;  
                                     console.log("error"); 
                                 }  
                             }); 
                        }
                    });
                   
                 
                });
                return response.data.result;
            //thi.renderControls(response.data);
            })
            .catch((e) => {
                console.log('Failed to Connecting to server and Fetch Data');
                console.log(e);
            });
    }
    else {
        console.log("Unable to get block Numbers");
    }
    
};
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require('./services/apiServices')(app);

mongoose.connect(dbconfig.mongodb.defaultUri,{config:{autoIndex:false}});

var database=mongoose.connection;

console.log("Fetching Transactions");
//await retrieveBlocks();


//setInterval(getBlocks,60000);

database.on('error',console.error.bind(console,'connectin error'));
let result1= database.once('open', retrieveBlocks);
//console.log(result);
    console.log("connect to DB ar: "+dbconfig.mongodb.defaultUri+" successfully");
    //var transactionsList = [];

 

//var port = 5000;
app.listen(dbconfig.expressPort, function(error) {
    if (error) throw error;
    console.log("Express server listening on port", dbconfig.expressPort);


});