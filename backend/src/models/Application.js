import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true, 
    } ,
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Job',
        required : true
    },
    status : {
        type : String,
        enum : ['Applied', 'Reviewed', 'Rejected', 'Accepted'],
        default : 'Applied'
    },
    appliedAt : {
        type : Date,
        default : Date.now()
    },
    resumeUrl: {
    type: String,
  }

});

const Application = mongoose.model('Application', applicationSchema);

export default Application;