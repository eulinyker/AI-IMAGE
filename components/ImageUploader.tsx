import React, { useRef, useState, useEffect } from 'react';

interface ImageUploaderProps {
    id: string;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    text: string;
    subtext?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, imageFile, setImageFile, text, subtext }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(imageFile);

        return () => {
            reader.onloadend = null;
        };
    }, [imageFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div 
            className="upload-area w-full bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg p-4 flex items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-gray-600/50 transition-colors duration-200 relative aspect-video"
            onClick={handleClick}
        >
            <input
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
            />
            {previewUrl ? (
                <>
                    <img src={previewUrl} alt="Preview" className="image-preview absolute inset-0 w-full h-full object-contain rounded-lg" />
                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold z-10 hover:bg-red-700 transition-colors">&times;</button>
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="text-3xl text-gray-400 mb-2">📁</div>
                    <span className="font-semibold text-gray-200">{text}</span>
                    {subtext && <p className="upload-text text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
