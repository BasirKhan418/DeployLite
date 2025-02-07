import { createSlice } from '@reduxjs/toolkit';

export interface AwsState {
    aws: {
        userid:string,
        email:string,
        awskey:string,
        awssecret:string,
        region:string,
        vpcid:string,
        subnetid1:string,
        subnetid2:string,
        subnetid3:string,
        securitygroupid:string,
        s3:Boolean,
        ec2:Boolean,
        fargate:Boolean,
        ecs:Boolean,
        ecr:Boolean,
        s3bucket:string,
    };
}

const initialState: AwsState = {
    aws: {
        userid:"",
        email:"",
        awskey:"",
        awssecret:"",
        region:"",
        vpcid:"",
        subnetid1:"",
        subnetid2:"",
        subnetid3:"",
        securitygroupid:"",
        s3bucket:"",
        s3:false,
        ec2:false,
        fargate:false,
        ecs:false,
        ecr:false,

    }
};

export const AwsSlice = createSlice({
    name: 'aws',
    initialState,
    reducers: {
        add: (state, action) => {
            // Magic
            // Immer will handle the mutation
            state.aws=action.payload
        },
    },
});

// Action creators are generated for each case reducer function
export const { add } = AwsSlice.actions;

export default AwsSlice.reducer;