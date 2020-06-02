const router= require('express').Router();
const verify= require('../verifytoken');
const User= require('../models/User');
const Block= require('../models/Student');

//BAR CHART FOR DASHBORD
router.get('/hostel', verify , async (req,res)=>{

    try{
        
        // check wether the block exist or not.
        const blocks =await Block.find({ownerMail:req.user.email});
        if(!blocks) return res.status(401).send({mes:"Block do not exist"});

        const len=blocks.length;
        // console.log(blocks)
        var   result={};

        result.blockName=[];
        result.totalNoOfStudent=[];
        result.currentNoOfStudent=[];

        for(var i=0;i<len;i++){
            result.blockName.push(blocks[i].blockName)
            var total=((blocks[i].numberOfFloor)*(blocks[i].numberOfRoomInFloor)*(blocks[i].numberOfStudentInRoom))
            result.totalNoOfStudent.push(total);
            result.currentNoOfStudent.push(blocks[i].student.length);
        }
       console.log(result);
        res.status(200).send(result);

    }catch(err){
        return res.status(200).send({error:err});
    }   

})

//LIST OF THE COLLEGE NAME
router.get('/college/name/:blockName',verify,async(req,res)=>{
    try{

        // check wether the block exist or not.
        const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
        if(!block) return res.status(401).send({mes:"Block do not exist"});

        const stu=block.student;
        const len=stu.length;
        var   result={};
        var finalresult=[];

        for(var i=0;i<len;i++){

            if(result[stu[i].college]==null) {
                result[stu[i].college]=1;
                finalresult.push(stu[i].college)
            }
        }
        
        res.status(200).send(finalresult);

    }catch(err){
        return res.status(200).send({error:err});
    }   
})

//LIST OF THE COLLEGE NAME
router.get('/college/name/detail/:blockName/:college',verify,async(req,res)=>{
    try{

        // check wether the block exist or not.
        const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
        if(!block) return res.status(401).send({mes:"Block do not exist"});

        const stu=block.student;
        const len=stu.length;
        var   result={};
        var finalresult=[];

        for(var i=0;i<len;i++){
            if(stu[i].college==req.params.college) {
                finalresult.push(stu[i])
            }
        }
        res.status(200).send(finalresult);

    }catch(err){
        return res.status(200).send({error:err});
    }   
})

//CHART FOR THE BLOCK
router.get('/block/chart/:blockName',verify,async (req,res)=>{
    try{

        // check wether the block exist or not.
        const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
        if(!block) return res.status(400).send({mes:"Block do not exist"});
    
        var roomList={};
    
        // room Object has three properties noOfstudent,sameClg & roomNo
        const stu=block.student;
    
        //sort the student array based on the room number
        await stu.sort((a,b)=> a.room-b.room);
        const len=stu.length;
        //to check student is there or not
        // if(len<1) return res.status(200).send({error:"no student found on the block"});
       
    
        for(var i=0 ; i<len ; i++) {
           if(roomList[stu[i].room]==null) roomList[stu[i].room]=1;
           else roomList[stu[i].room]+=1;
        }
        var finalResult={};
        finalResult.empty=0;
        finalResult.full=0;
        finalResult.partial=0;
        
        var result=[];
        var floor={}
        var i,j;
        for(i=0 ; i<block.numberOfFloor ; i++){
          floor.emptyroom=0;
          floor.emptyroomD=[];
          floor.fullroom=0;
          floor.fullroomD=[];
          floor.partialyfilledroom=0;
          floor.partialyfilledroomD=[];
          floor.floorno=i;
    
            for( j=i*100+1;j<=i*100+block.numberOfRoomInFloor;j++){
                if(roomList[j]==null) floor.emptyroom+=1,floor.emptyroomD.push(j),finalResult.empty+=1;
                else if(roomList[j]<block.numberOfStudentInRoom) floor.partialyfilledroom+=1,floor.partialyfilledroomD.push(j),finalResult.partial+=1;
                else floor.fullroom+=1,floor.fullroomD.push(j), finalResult.full+=1;
            }
            result.push(floor);
            floor={};
        }
        if(roomList) res.status(200).send(finalResult);
        else return res.status(400).send({msg:"no room found"});
    
        }catch(err){
           return res.status(400).send({error:err});
        }
        

})


//GET ALL STUDENT OF THE BLOCK
router.get('/all/student/:blockName',verify,async(req,res)=>{
    try{

        // check wether the block exist or not.
        const block =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
        if(!block) return res.status(400).send({mes:"Block do not exist"});
    
        var stu=block.student;
    
        //sort the student array based on the room number
        await stu.sort((a,b)=> a.room-b.room);

        res.status(200).send(stu);
    }catch(err){
        return res.status(500).send({error:err});
    }

})


module.exports =router;