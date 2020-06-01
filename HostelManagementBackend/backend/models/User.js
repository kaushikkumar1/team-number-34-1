const mongoose=require('mongoose');

// SCHEMA OF THE USER ( HOSTEL OWNER )
const userSchema =new mongoose.Schema(
    {
        hostelname:{
            type: String,
            required:true
        },
        name :{
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        email:{
            type : String,
            required: true,
            min: 6,
            max: 255
        },
        phone:{            // added phone number afterwards
            type: String,
            required: true
        },
        city:{
            type: String
        },
        state:{
            type: String
        },
        password:{
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        date:{
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('User',userSchema);