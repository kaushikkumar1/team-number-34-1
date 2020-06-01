const mongoose=require('mongoose');

// SCHEMA OF THE BLOCK CONTAING THE STUDENT ARRAY
const BlockInfo =new mongoose.Schema(
    {
        ownerMail :{
            type:String,
            required:true
        },
        blockName :{
            type: String,
            required: true,
            max: 255
        },
        numberOfFloor:{
            type : Number,
            required: true,
            max: 100
        },
        numberOfStudentInRoom:{
            type: Number,
            required: true
        },
        AirConditioning:{
            type:Boolean
        },
        numberOfRoomInFloor:{
            type: Number,
            required: true,
            max: 99
        },
        student:{
            type:[ {
                name :{
                    type: String,
                    required: true,
                    min: 6,
                    max: 255
                },
                email:{
                    type: String,
                    required: true,
                    min: 6,
                    max: 255
                },
                father:{
                    type: String
                },
                mother:{
                    type: String
                },
                phoneNo:{
                    type: String,
                    required: true,
                },
                college:{
                    type: String,
                    required: true,
                    min: 2,
                    max: 255
                },
                year:{
                    type: Number,
                    required:true,
                    max:5
                },
                rollno:{
                    type:String,
                    required:true
                },
                selectdate:{
                     type:Date
                },
                branch:{
                    type: String
                },
                block:{
                    type: String
                },
                floor:{
                    type: Number
                },
                address:{
                    type: String
                },
                room:{
                    type: Number
                },
            }]
        },
        date:{
            type: Date,
            default: Date.now
        }
    }
)
module.exports = mongoose.model('Block',BlockInfo);




