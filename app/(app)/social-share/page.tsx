"use client";

import { CldImage } from "next-cloudinary";
import React, { useEffect, useState, useRef } from "react";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare(){
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(()=>{
    if(uploadedImage){
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try{
      const response = await fetch("/api/image-upload", {
        method: "POST", body: formData
      });
      if(!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      setUploadedImage(data.publicId);
    }
    catch(error){
      console.log(error);
      alert("Failed to upload image"); 
    }finally{
      setIsUploading(false);
    }
  }

  const handleDownload = () =>{
    if(!imageRef.current) return;

    fetch(imageRef.current.src)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png";
      document.body.appendChild(link);
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
  }

  return <div>SocialShare</div>;
};

