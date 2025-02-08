// app/api/github-extract/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GitHubCodeExtractor } from '@/utils/repo-extractor/Repo-extractor';
import CryptoJS from 'crypto-js';
import ConnectDb from '../../../../middleware/connectdb';
import CheckAuth from '@/actions/CheckAuth';
export async function POST(req: NextRequest) {
  try {
    // await ConnectDb();
    // let result = CheckAuth()
    // if(!result.result){
    //     return NextResponse.json({message:"You are not authenticated. Please login to continue",success:false,login:false})
    // }
    // let user = await User.findOne({email:result.email})
    const { repoUrl, authToken } = await req.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    const extractor = new GitHubCodeExtractor(authToken);
    const repoData = await extractor.extractRepositoryCode(repoUrl);

    return NextResponse.json(repoData);
  } catch (error) {
    console.error('Error processing repository:', error);
    return NextResponse.json(
      { error: 'Failed to process repository' },
      { status: 500 }
    );
  }
}