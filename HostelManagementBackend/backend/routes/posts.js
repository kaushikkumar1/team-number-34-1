const router= require('express').Router();
const verify= require('../verifytoken');
const User= require('../modles/User');
const Block= require('../modles/Student');

//TO GET THE DETAIL OF THE USER FROM THE TOKEN THROUGH VERIFY
router.get('/',verify, async(req,res)=>{
    
   console.log(req.user._id);
   const user= await User.findById(req.user._id);

    if(!user) return res.status(400).send("no user found");
    res.status(200).send(user);
})

//ADD A PARTICULAR BLOCK
router.post('/blocks',verify,async(req,res)=>{
    
    const owner = await Block.findOne({ownerMail:req.user.email,blockName:req.body.blockName});
    if(owner) return res.status(400).send({msg:"block already exist for your hostle"});

    const block =new Block({
        ownerMail:req.user.email,
        blockName:req.body.blockName,
        numberOfFloor:req.body.numberOfFloor,
        numberOfRoomInFloor:req.body.numberOfRoomInFloor,
        AirConditioning: req.body.AirConditioning,
        numberOfStudentInRoom: req.body.numberOfStudentInRoom
    }) 

    try{
        const savedUser= await block.save();
        res.status(200).send(savedUser);
    }catch(err){
        res.status(500).send(err);  
    }
})

//UPDATE THE BLOCK BY ADDING STUDENT IN THE PARTICULAR BLOCK
router.patch('/students',verify,async(req,res)=>{
    try{

    // check wether the block exist or not.
    const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!exist) return res.status(400).send({mes:"Block do not exist for you"});

    // check wether the student exist already.
    const studentExist=await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email,'student.email':req.body.email});
    if(studentExist) return res.status(401).send({mes:"Block with this student already exist"});

    //is Block exist and student is a new then add the the current block.
       const blocks=await Block.updateOne({blockName:req.body.blockName,ownerMail:req.user.email},
        {
            $push :{
                student :{
                    name:req.body.name,
                    email:req.body.email,
                    phoneNo:req.body.phoneNo,
                    college:req.body.college,
                    floor:req.body.floor,
                    room:req.body.room,
                    year:req.body.year,
                    block:req.body.blockName,
                    father:req.body.father,
                    mother:req.body.mother,
                    rollno: req.body.rollno,
                    selectdate:req.body.selectdate,
                    branch:req.body.branch,
                    address:req.body.address

                }
            }
        })
        res.status(200).send(blocks);
    }catch(err){
        res.status(500).send("some erro is caused");  
    }
})

//DELETE THE STUDENT FROM THE PARTICULAR BLOCK
router.delete('/students/:blockName/:email',verify,async (req,res)=>{
    try{
        //check block exist or not for the owner
        const exist =await Block.findOne({blockName:req.params.blockName,ownerMail:req.user.email});
        if(!exist) return res.status(401).send({mes:"Block do not exist for the owner"});

        // check if block with the owner and student exist or not not written
        
        await Block.updateOne({blockName:req.params.blockName,ownerMail:req.user.email},{
             $pull :{
                 student :{
                     email:req.params.email,
                    // phoneNo:req.body.phoneNo
                 }
             }
         },(err,model)=>{
            if(err){
                 console.log(err);
                 return res.status(400).send(err);
              }
              return res.status(200).send(model);
          })
     }catch(err){
         res.status(500).send({msg:"could not delete"});  
     }
})

//DELETE THE STUDENT AND UPDATE THE DETAILS
router.post('/students/update',verify,async (req,res)=>{
    try{

        //check block exist or not for the owner
        const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
        if(!exist) return res.status(401).send({mes:"Block do not exist for the owner"});

        // check if block with the owner and student exist or not not written
        
        await Block.updateOne({blockName:req.body.blockName,ownerMail:req.user.email},{
             $pull :{
                 student :{
                     email:req.body.email,
                    // phoneNo:req.body.phoneNo
                 }
             }
         },(err,model)=>{
            if(err){
                 console.log(err);
                 return res.status(400).send(err);
              }
          })

        //#################deleting student###########################
        //#################adding student with updated info###########

        const exist1 =await Block.findOne({blockName:req.body.blockNameU,ownerMail:req.user.email});
        if(!exist1) return res.status(400).send({mes:"Block do not exist for you"});

        // check wether the student exist already.
        const studentExist=await Block.findOne({blockName:req.body.blockNameU,ownerMail:req.user.email,'student.email':req.body.email});
        if(studentExist) return res.status(401).send({mes:"Block with this student already exist"});

        //is Block exist and student is a new then add the the current block.
        const blocks=await Block.updateOne({blockName:req.body.blockNameU,ownerMail:req.user.email},
            {
                $push :{
                    student :{
                        name:req.body.name,
                        email:req.body.email,
                        phoneNo:req.body.phoneNo,
                        college:req.body.college,
                        floor:req.body.floor,
                        room:req.body.room,
                        year:req.body.year,
                        block:req.body.blockName,
                        father:req.body.father,
                        mother:req.body.mother,
                        rollno: req.body.rollno,
                        selectdate:req.body.selectdate,
                        branch:req.body.branch,
                        address:req.body.address

                    }
                }
            })
            res.status(200).send(blocks);

    }catch(err){
      return res.status(500).send({error:err});
    }

})

module.exports =router;

