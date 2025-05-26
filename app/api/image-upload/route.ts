import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";

// Configuration
cloudinary.config({
  cloud_name: "dl4rdt9w0",
  api_key: "472512663971277",
  api_secret: "<your_api_secret>", // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any
}

export async function POST(request: NextRequest){
    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try{
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if(!file){
            return NextResponse.json({error: "File not found"}, {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await new Promise<CloudinaryUploadResult>(
            (resolve, reject)=>{
                cloudinary.uploader.upload_stream(
                    {folder: "next-cloudinary-uploads"},
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
            }
        )
    }catch(error){

    }
};
