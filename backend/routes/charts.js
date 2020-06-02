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

module.exports =router;