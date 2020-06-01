const router= require('express').Router();
const verify= require('../verifytoken');
const User= require('../modles/User');
const Block= require('../modles/Student');
const paginatedFun=require('../pagination');

// ALL STUDENT LIST OF A BLOCK
router.get('/students',verify,async(req,res)=>{
    try{

    // check wether the block exist or not.
    const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!exist) return res.status(400).send({mes:"Block do not exist"});

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const stu=exist.student;
    stu.sort((a,b)=> a.room-b.room);

    //adding pagination to the student aaray
    const result=paginatedFun(stu,page,limit);

    // if block exist then send the limited students at the current page.
    res.status(200).send(result);

    }catch(err) {
        res.status(400).send(err);
    }
});

// LIST OF STUDENTS FROM A PARTICULAR COLLEGE
router.get('/college',verify, async (req,res) => {
    
    try{
    // check wether the block exist or not.
    const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!exist) return res.status(400).send({mes:"Block do not exist"});

    const block= await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email,'student.college':req.body.college});
    if(block) {
        var stuarray=[];   //empty student array
        const stu=block.student; //students from a block

        stu.forEach(element => {
            if(element.college==req.body.college)
            stuarray.push(element);
        });
        const paginatedArray=paginatedFun(stuarray,req.query.page,req.query.limit)
        return res.status(200).send(paginatedArray);  //returning the list of students from a particular college
    } 
    return res.status(400).send({msg:"This college do not exist"});
    }catch(err)
    {
     return res.status(400).send(err);
    }
})

// LIST OF STUDENTS FROM A PARTICULAR COLLEGE BESED OF YEAR
router.get('/college/year',verify, async (req,res) =>{  
    try{

    // check wether the block exist or not.
    const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!exist) return res.status(400).send({mes:"Block do not exist"});

    //check wether the college exist or not.
    const cllg =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email,'student.college':req.body.college});
    if(!cllg) return res.status(400).send({mes:"College do not exist"});

    const block= await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email,
        'student.college':req.body.college,'student.year':req.body.year});
    if(block) {
        var stuarray=[];   //empty student array
        const stu=block.student; //students from a block

        stu.forEach(element => {
            if(element.year==req.body.year && element.college==req.body.college)
            stuarray.push(element);
        });
        const paginatedArray=paginatedFun(stuarray,req.query.page,req.query.limit)
        return res.status(200).send(paginatedArray);  //returning the list of students from a particular college
    } 
    return res.status(400).send({msg:"Student with this year do not exist"});
    }catch(err)
    {
     return res.status(400).send(err);
    }
})

// LIST OF STUDENTS FROM THE PARTICULAR FLOOR IN A BLOCK
router.get('/floor',verify,async (req,res)=>{
    try{
    
    // check wether the block exist or not.
    const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!exist) return res.status(400).send({mes:"Block do not exist"});
    
    //check wether the college exist or not.
    const floor =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email,'student.floor':req.body.floor});
    if(!floor) return res.status(400).send({mes:"Student in this floor do not exist"});
    
    if(exist){
        var stuarray=[];   //empty student array
        const stu=exist.student; //students from a block

        stu.forEach(element => {
            if(element.floor==req.body.floor)
            stuarray.push(element);
        });
        res.status(200).send(stuarray);
    }
    }catch(err){
        return res.status(400).send(err);
    }

});

// STATS OF THE COLLEGE IN A BLOCK ( LIST OF COLLEGE WITH NUMBER OF STUDENT )
router.get('/college/stats',verify, async (req,res)=>{
    try{

    // check wether the block exist or not.
    const block =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!block) return res.status(400).send({mes:"Block do not exist"});

    var result={}
    const studentarray=block.student;
    
    studentarray.forEach(element => {
        if(result[element.college]==null)
            result[element.college]=1;
        else
            result[element.college]+=1;
    });

    res.status(200).send(result);
    }catch(err){
       return res.status(400).send({msg:err});
    }
});

// STATS OF THE COLLEGE IN A BLOCK ( NUMBER OF STUDENT BASED ON YEAR )
router.get('/year/stats',verify, async (req,res)=>{
    try{
    //check wether the block exist or not.
    const block =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
    if(!block) return res.status(400).send({mes:"Block do not exist"});

    var result={};
    const studentarray=block.student;
    
    studentarray.forEach(element => {
        if(result[element.year]==null) result[element.year]=1;
        else result[element.year]+=1;
    });

    res.status(200).send(result);

    } catch( err ) {
        return res.status(400).send({msg:err});
    }

})

//FIND STUDENT DETAILS BASED ON THE E-MAIL
router.get('/student/email',verify,async(req,res)=>{
    try{
        //check wether the block exist or not.
        const block =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
        if(!block) return res.status(400).send({mes:"Block do not exist"});

        //find the student in the block
        var f=1;
        var student=new Object();
        const stuarray=block.student;
        stuarray.forEach(element => {
             if(element.email==req.body.email){
             student=element;f=0;}
        });
        if(f==0)
        return res.status(200).send(student);

        //else no student found with the given email return could't find
        return res.status(400).send({msg:"cannot find student with this e-mail"})

    }catch(err) {
        return res.status(400).send(err);
    }

})

//CHANGE THE ROOM OF THE STUDENT
 router.delete('/student/change',verify,async(req,res)=>{
    try{

     //check wether the block exist or not.
     const block =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
     if(!block) return res.status(400).send({mes:"Block do not exist"});

     // check wether the student exist already.
     var f=1;
     var studentinfo=new Object();
     const stuarray=block.student;
     stuarray.forEach(element => {
          if(element.email==req.body.email){
            studentinfo=element;f=0;}
     });
     if(f==1)
     return res.status(200).send({error:"student not found"});
     
     studentinfo.room=req.body.room;
     studentinfo.floor=(req.body.room)%100;
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
     const blocks=await Block.updateOne({blockName:req.body.blockName,ownerMail:req.user.email},
        {
            $push :{
                student:studentinfo
            }
        })
        return res.status(200).send({msg:"sucessfully updated"})

    }catch(err){
     return res.status(400).send({error:err});
    }
})

//OWNER DETAILS
router.get('/user/userbio',verify,async(req,res)=>{
    try{
        const user =await User.findOne({email:req.user.email});
        if(!user)  return res.status(401).send({msg:"User does not exist"});
    
        return res.status(200).send(user);

    }catch(err) {
        return res.status(400).send(err);
    }
})

//SEND FLOOR WISE STUDENT DETAILS
router.get('/block/floor/detail',verify,async(req,res)=>{
    try{
        // check wether the block exist or not.
        const exist =await Block.findOne({blockName:req.body.blockName,ownerMail:req.user.email});
        if(!exist) return res.status(401).send({mes:"Block do not exist"});

       // const page = parseInt(req.query.page)
       // const limit = parseInt(req.query.limit)

        
        const stu=exist.student;
        stu.sort((a,b)=> a.room-b.room);

        for(var i=0;i<stu.length; i++){
             result[stu[i].floor]=stu[i]; 
        }

     console.log("kaushik");
        //adding pagination to the student aaray
       // const result=paginatedFun(stu,page,limit);

        // if block exist then send the limited students at the current page.
        res.status(200).send(stu);

  }catch(err) {
      res.status(400).send(err);
  }
});
module.exports =router;






//fee due
// X extra features 
