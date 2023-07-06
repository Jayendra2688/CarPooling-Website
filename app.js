const express = require("express");
const bodyParser = require("body-parser");
const checkIIITA = require(__dirname+"/checkIIITA.js");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb://127.0.0.1/symbiosisDB");



const app = express();



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

const membersSchema = new mongoose.Schema({
    name : String,
    collageId : String,
    emaiId : String,
    phoneNum: String,
    hostel : String,
    password: String
})

const Member = mongoose.model("Member",membersSchema);

const mem_default = new Member({
      name  : "mem_default",
      collageId : "iit2021000",
      emaiId : "iit2021000@iiita.ac.in",
      phoneNum : 9090123123,
      hostel : "BH5",
      password : "123"
       
})

// mem_default.save();
const listSchema = new mongoose.Schema({
    listName : String,
    members : [membersSchema]
})

const List = mongoose.model("List",listSchema);

const cabList = new List({
    listName : "cab" ,
    members : [mem_default]

})
const foodList = new List({
    listName : "food" ,
    members : [mem_default]

})
const cricketList = new List({
    listName : "cricket" ,
    members : [mem_default]

})
const footballList = new List({
    listName :  "football",
    members : [mem_default]

})
const basketballList = new List({
    listName :  "basketball",
    members : [mem_default]

})

const badmintionList = new List({
    listName :  "badmintion",
    members : [mem_default]

})

const volleyballList = new List({
    listName : "volleyball",
    members : [mem_default]

})

const arr = [cabList,foodList,cricketList,footballList,basketballList,badmintionList,volleyballList];

// List.insertMany(arr)
// .then(function(res){
//     console.log(res);
// })
// .catch(function(err){
//     console.log(err);
// })


app.get("/",function(req,res){
   res.render("index");

})

app.get("/Mainpage/:id",function(req,res){
  
    res.render("mainPage",{
        Id : req.params.id
    })

})
app.get("/sectionpage/:id/:section",function(req,res){
    
    const section = req.params.section;
    console.log(section);
    const Id = req.params.id;

    if(section=="games"){
       
        res.render("gamesMainpage",
        {
            id:Id
        });

    }else{

        List.findOne({listName : section})
        .then(function(result){
            if(result){
                console.log("hi");
                console.log(result);
                res.render("list",
                {listName : _.startCase(result.listName),
                members : result.members,
                id : req.params.id}
                );
            }else{
                console.log("List not found");
                res.redirect("/");
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }
})
app.get("/games/:game/:id",function(req,res){
      List.findOne({listName : req.params.game})
      .then(function(result){
        console.log(result);
        res.render("list",
        {listName : _.startCase(result.listName),
        members : result.members,
        id : req.params.id}
        );
      })
      .catch(function(err){
        console.log(err);
    })

})
app.post("/:sign",function(req,res){
    
    if(req.params.sign=="register"){
        
        console.log(req.body);
        const gname = req.body.name;

        const gcollageId = req.body.collageId;

        const gemail = req.body.emailId;

        const gpn = req.body.collageId;

        const ghostel = req.body.hostel;

        const gpassword = req.body.password;

        const gconfirm = req.body.confirm;

        const member = new Member({
            name : gname,
            collageId : gcollageId,
            emaiId : gemail,
            phoneNum : gpn,
            hostel:ghostel,
            password:gpassword
        })
        console.log(gcollageId);
        console.log(gemail);
        if(checkIIITA.checkIdAndEmail(gcollageId,gemail)){

            if(checkIIITA.checkEmail(gemail)){

                if(checkIIITA.checkPassword(gpassword,gconfirm)){

                    Member.findOne({collageId : gcollageId})
                    .then(function(result){
                         if(result){
                            res.render("errors",{
                                message : "User exists!"
                            })
                         }else{
                            console.log("new Member added!");
                            member.save();
                            res.redirect("/Mainpage/"+member._id);
                         }
                    })
                    .catch(function(err){
                        console.log(err);
                    })

                }else{
                    res.render("errors",{
                        message : "Check confirm password"
                    })
                }

            }else{
                
                res.render("errors",{
                    message : "not a valid Email,failed"
                })
            }

        }else{
            res.render("errors",{
                message : "Miss match between collageId and email,failed."
            })
        }
    }else if(req.params.sign === "login"){

        const gemailId = req.body.emailid;
        
        const gpassword = req.body.password;
         
        Member.findOne({emaiId : gemailId})
        .then(function(result){
            if(result){
                
                if(result.password==gpassword){

                    console.log("login is success");

                    res.redirect("/Mainpage/"+result._id);

                }else{
                    res.render("errors",{
                        message : "Password incorrect"
                    })
                }

            }else{
                res.render("errors",{
                    message : "user not exists"
                })
            }
        })
    }

})
app.post("/checkid/:list", function(req, res) {
    const memberID = req.body.addsub;
    const givenlist = _.lowerCase(req.params.list);
  console.log("******************************check");
  console.log(memberID + "ja");
    List.findOne({listName: givenlist})
      .then(function(result) {
        if (result) {
            console.log("*****");
            let exists =false;
            result.members.forEach(function(member) {
                console.log(member._id.toString(), memberID);
            if(member._id.toString() === memberID){
                console.log("member exists!"); 
                exists = true;
            }
            
          });
          console.log("exists:", exists);
          res.send({exists: exists});
        } else {
          console.log("List not found");
          res.send({exists: false});
        }
      })
      .catch(function(err) {
        console.log(err);
        res.send({exists: false});
      });
  });
  
app.post("/addid/:list",function(req,res){
    console.log("hello adding");
    const id = req.body.addsub;
    const givenlist = _.lowerCase(req.params.list);
    
    List.findOne({listName : givenlist})
    .then(function(list){
        if(list){
            Member.findOne({_id : id})
            .then(function(mem){
                if(mem){
                    list.members.push(mem);
                    list.save();
                }else{
                    console.log("mem not found");
                }
            })
            .catch(function(err){
                console.log(err);
            })
                    
           if(givenlist=="food" || givenlist=="cab")
           res.redirect("/sectionpage/"+id+"/"+givenlist);
           else
           res.redirect("/games/"+givenlist +"/"+ id);
          
        }else{
            console.log("list not found");
        }
    })
    .catch(function(err){
        console.log(err);
    })
  
})
app.post("/deleteid/:list",function(req,res){
    console.log("hello deleteing");
    const id = req.body.addsub;
    const givenlist = _.lowerCase(req.params.list);
    List.findOneAndUpdate({listName : givenlist},{$pull : {members : {_id : id}}})
    .then(function(result){
        console.log(result);

    })
    .catch(function(err){
        console.log(err);
    })
})

app.listen(3000,function(req,res){
    console.log("sever is running on port number 3000");
})