import { InferSchemaType, model, Schema } from "mongoose";

var surveyModel=new Schema({
        title:{type:String,required:true},
        description:{type:String,required:true},
        createdBy:{type:Schema.Types.ObjectId,required:true},
        questions:[{
            text:{type:String,required:true},
            type:{type:String,required:true,enum:["text","text-box","radio","check-box"],default:"text"},
            options:[{type:String,required:true}]
        }],
        responses:[{
            submittedBy:{type:Schema.Types.ObjectId,required:true},
            answers:[[{type:String,required:true}]],
            submittedAt:{type:Date,required:true,default:Date.now},
        }],
        status:{type:String,required:true,enum:["open","close"],default:"close"},
    },{
        timestamps:true,
        versionKey:false,
        strict:false,
    }
)

type surveyModelType=InferSchemaType<typeof surveyModel>

export default model<surveyModelType>("surveyModel",surveyModel)