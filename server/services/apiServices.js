module.exports = function (app) {
    var tenantModel = require("../models/tenantSchema");
    var basemapModel = require("../models/basemapSchema")
    var layerModel = require("../models/layerSchema");

    var transactionModel = require("../models/transactionSchema");
    //Get Tenants Information
    var tenantData, tenantBasemaps, tenantLayers, basemapData, layerData;

  
    app.get('/NGEM/:tenantId', function (req, res) {
        console.log("tenantId: "+req.params.tenantId);
        var tenantIdParams=req.params.tenantId;
      tenantModel.find({tenantId:{"$in":tenantIdParams}}).exec()
            .then(function (tenantResponse) {             
                tenantData = tenantResponse[0];               
                var result=[];
                if (tenantData) {                  
                    tenantLayers = tenantData.mapOptions.layers;
                    return layerModel.find({layerId: { "$in": tenantLayers }}).exec()
                    .then(function(data){
                        layerData = data;
                        return [tenantData,layerData]
                    })                   
                }

            })
            .then(function(result){
                var tempTenantData = result[0];
                tenantBasemaps = tempTenantData.mapOptions.basemaps;
                return basemapModel.find({basemapId:{"$in":tenantBasemaps}}).exec()
                .then(function(data){
                    basemapData = data;
                    result.push(basemapData);
                    return result;
                })
            })
            .then(function(result){
                var tempBaseData =[];
                tempBaseData=result[2];
                var basemapLayerIds=[];
                tempBaseData.find(function(obj){basemapLayerIds.push(obj.layerId)});                
                return layerModel.find({layerId:{"$in":basemapLayerIds}}).exec()
                .then(function(data){
                    var tempbasemapData = data;
                    result.push(tempbasemapData);                   
                    return result;
                })               
            })
          
            .then(function (result) {
               // console.log("final result");
               // console.log(result);
                var tenantDataFinal = result[0];
                var layerData1 = result[1];
               
                tenantDataFinal["layers"]=layerData1;
                var basemapData1 = result[2];
                var basemapLayers=result[3];               
                tenantDataFinal["basemaps"]=basemapData1;
                tenantDataFinal["basemapLayers"]=basemapLayers;               
                res.json(tenantDataFinal);
            }) 
            .then(undefined, function (err) {
                //Handle error
            })    
                   
  
    });


app.get('/', function(req, res){
    console.log("lastBlock");

    transactionModel.find({}).sort([['timeStamp','descending']]).exec()
            .then(function (tenantResponse) {             
                tenantData = tenantResponse;
                console.log(tenantData.length);
                var result=[];
                if (tenantData) {  
                    return res.json(tenantData);               
                }

            })
});

app.put('/bookmark/:txhash', function(req, res){
    console.log("lastBlock");
    let transHash = req.params.txhash;
    //let value = req.params.value;
    console.log(transHash);
    console.log(req.body);
    //let bookmarkValue ={"IsBookmarked":value};
    let bookmarkValue =req.body;
   transactionModel.findOneAndUpdate({hash:transHash},
            //{"IsBookmarked":true},
            bookmarkValue,
            {new: true},
            function(err,transactions){
                if(!err){
                        return res.json({
                                         status:'OK',
                                         transactions:transactions
                        })
                }
                else{
                        res.statusCode = 500;  
                        return res.json({  
                            error: 'Server error'  
                        });
                }  
            }); 

            
    });    
                                
    app.put('/blacklist/:txhash', function(req, res){
        console.log("lastBlock");
        let transHash = req.params.txhash;
        //let value = req.params.value;
        console.log(transHash);
        console.log(req.body);
        //let bookmarkValue ={"IsBookmarked":value};
        let bookmarkValue =req.body;
       transactionModel.findOneAndUpdate({hash:transHash},
                //{"IsBookmarked":true},
                bookmarkValue,
                {new: true},
                function(err,transactions){
                    if(!err){
                            return res.json({
                                             status:'OK',
                                             transactions:transactions
                            })
                    }
                    else{
                            res.statusCode = 500;  
                            return res.json({  
                                error: 'Server error'  
                            });
                    }  
                });
    })
  
app.get('/blacklistedTransactions', function(req, res){
    console.log("lastBlock");
    let transHash = req.params.txhash;
    console.log(transHash);
    transactionModel.find({'IsBlacklisted':true}).exec()
            .then(function (tenantResponse) {             
                tenantData = tenantResponse;
                console.log(tenantData.length);
                var result=[];
                if (tenantData) {
                    return res.json(tenantData);               
                }

            })
}); 
app.get('/bookmarkedTransactions', function(req, res){
    console.log("lastBlock");
    let transHash = req.params.txhash;
    console.log(transHash);
    transactionModel.find({'IsBookmarked':true}).exec()
            .then(function (tenantResponse) {             
                tenantData = tenantResponse;
                console.log(tenantData.length);
                var result=[];
                if (tenantData) {
                    return res.json(tenantData);               
                }

            })
}); 
}