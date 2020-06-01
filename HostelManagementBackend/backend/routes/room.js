const router= require('express').Router();
const verify= require('../verifytoken');
const User= require('../models/User');
const Block= require('../models/Student');
const paginatedFun=require('../pagination');

//GET BLOCK WHICH ARE NOT FILLED
router.get('/choose/block', verify , async (req,res)=>{
    try{
    var blocklist=[];
    const blocks=await Block.find({ownerMail:req.user.email});
    if(!blocks) return res.status(401).send({error:"no blocks with this owner found"});

    //itrate over the block and add the empty one to the blockList
    var blockname;
    var studentarray;
    var blocksize;
    blocks.forEach(element => {
        blockname= element.blockName;
        blocksize= parseInt(element.numberOfStudentInRoom)*parseInt(element.numberOfRoomInFloor)*parseInt(element.numberOfFloor);
        studentarray= element.student;
        if(studentarray.length<blocksize)
            blocklist.push(blockname);
    });
    if(blocklist.length==0)
    return res.status(400).send({msg:"no empty block"});
    return res.status(200).send(blocklist);
    }catch(err) {
        return res.send(500).send(err);
    }

})

//SEND ALL THE BLOCK OF USER
router.get('/choose/block/all', verify , async (req,res)=>{
    try{
    var blocklist=[];
    const blocks=await Block.find({ownerMail:req.user.email});
    if(!blocks) return res.status(401).send({error:"no blocks with this owner found"});

    //itrate over the block and add the empty one to the blockList
    var blockname;
    var studentarray;
    var blocksize;
    blocks.forEach(element => {
        blockname= element.blockName;
            blocklist.push(blockname);
    });
    return res.status(200).send(blocklist);
    }catch(err) {
        return res.send(500).send(err);
    }

})

//GET FLOOR WHICH ARE NOT FILLED 
router.get('/choose/block/floor/:blockName',verify, async (req,res)=>{
    try{
    
    // check wether the block exist or not.
    const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
    if(!block) return res.status(401).send({mes:"Block do not exist"});

    var floorList=[];
    const stu=block.student;
    var result={};

    //find all the floors in block which are not filled
    const floorsize=parseInt(block.numberOfRoomInFloor)*parseInt(block.numberOfStudentInRoom);
    const nofloor=parseInt(block.numberOfRoomInFloor);

        stu.forEach(element => {
            if(result[element.floor]==null) result[element.floor]=1;
            else result[element.floor]+=1;
        });

        for(var i=1;i<=nofloor;i++){
            if(result[i]==null) floorList.push(i);
            else if(result[i]<floorsize) floorList.push(i);
        }
        return res.status(200).send(floorList);
    }catch(err){
        return res.status(500).send(err);
    }
} )

//GET ROOM WHICH ARE NOT FILLED
router.get('/choose/block/floor/room/:blockName/:floor',verify, async (req,res)=>{
    try{
    
    // check wether the block exist or not.
    const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
    if(!block) return res.status(401).send({mes:"Block do not exist"});

    var roomList=[];
    const stu=block.student;
    var result={};

    //find all the room in the floor which are not filled
    const studentarray=block.student;
    const floorNumber=req.params.floor;
    const roomsize=parseInt(block.numberOfStudentInRoom);
    const noOfroom=parseInt(block.numberOfRoomInFloor);

        stu.forEach(element => {
            if(result[element.room]==null && element.floor==floorNumber) result[element.room]=1;
            else if(element.floor==floorNumber) result[element.room]+=1;
        });

        var i=100*floorNumber+1;
        var j=100*floorNumber+noOfroom;

        for(i ; i<=j ; i++ ) {
            if(result[i]==null) roomList.push(i);
            else if(result[i]<roomsize) roomList.push(i);
        }
      
        return res.status(200).send(roomList);
    }catch(err){
        return res.status(500).send(err);
    }
} )

//REALLOCATE AND EDIT STUDENT DETAIL
router.get('/detail/:blockName/:email', verify , async (req , res)=>{

    try{
    
        // check wether the block exist or not.
        const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
        if(!block) return res.status(401).send({mes:"Block do not exist"});
    

        const stu=block.student;
        var result;
        stu.forEach(element => {
            if(element.email==req.params.email){
                result=element;
                return element;
            }
            
        });
        if(result)
        return res.status(200).send(result);
        return res.status(401).send({error:"student not found"})

    }catch(err){
        res.status(500).send({error:err})

    }
})

//TO SEND THE LIST OF THE ROOM WHICH IS FILLED ,PARTIALY FILLED AND EMPTY
router.get('/choose', verify , async (req,res)=> {
    try{

    // check wether the block exist or not.
    const block =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!block) return res.status(400).send({mes:"Block do not exist"});

    var roomList=[];

    // room Object has three properties noOfstudent,sameClg & roomNo
    var room=new Object();
    const stu=block.student;

    //sort the student array based on the room number
    await stu.sort((a,b)=> a.room-b.room);
    const len=stu.length;

    if(len<1) return res.status(200).send({error:"no student found on the block"});
    else {
        room.noOfstudent=1;
        if(stu[0].college==req.body.college) room.sameClg=1;
        else room.sameClg=0;
        room.roomNo=stu[0].room;
    }

    for(var i=1 ; i<len ; i++) {
        if(stu[i].room==room.roomNo) {
            room.noOfstudent+=1;
            if(stu[i].college==req.body.college) room.sameClg+=1;
         }
        else {  
            if(room.noOfstudent<5 && room.sameClg!=0) roomList.push(room);
            room={};
            room.noOfstudent=1;
            if(stu[i].college==req.body.college) room.sameClg=1;
            else room.sameClg=0;
            room.roomNo=stu[i].room;
        }
    }
    if(room.noOfstudent<5 && room.sameClg!=0) roomList.push(room);
   
    if(roomList.length>0) res.status(200).send(roomList);
    else return res.status(400).send({msg:"no room with same college name found"});

    }catch(err){
       return res.status(400).send({error:err});
    }
    
})


//GET THE PARTICULAR ROOM DETAILS ON BLOCK
//router.get('/block/detail',)

module.exports =router;