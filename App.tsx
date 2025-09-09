import React, { useState, useCallback } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { generateImage, editImage, composeImages } from './services/geminiService';
import type { Mode, CreateFunction, EditFunction } from './types';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [mode, setMode] = useState<Mode>('create');
    const [createFunction, setCreateFunction] = useState<CreateFunction>('free');
    const [editFunction, setEditFunction] = useState<EditFunction>('add-remove');
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const resetStateForNewGeneration = () => {
        setGeneratedImage(null);
        setError(null);
    };

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        resetStateForNewGeneration();

        try {
            let resultImage: string | null = null;
            if (mode === 'create') {
                if (!prompt) {
                    setError('Por favor, descreva a imagem que você deseja criar.');
                    setIsLoading(false);
                    return;
                }
                resultImage = await generateImage(prompt, createFunction);
            } else { // mode === 'edit'
                if (!prompt) {
                    setError('Por favor, descreva a edição que você deseja fazer.');
                    setIsLoading(false);
                    return;
                }
                if (editFunction === 'compose') {
                    if (!image1 || !image2) {
                        setError('Por favor, selecione duas imagens para unir.');
                        setIsLoading(false);
                        return;
                    }
                    resultImage = await composeImages(prompt, image1, image2);
                } else {
                    if (!image1) {
                        setError('Por favor, selecione uma imagem para editar.');
                        setIsLoading(false);
                        return;
                    }
                    resultImage = await editImage(prompt, image1, editFunction);
                }
            }
            setGeneratedImage(resultImage);
        } catch (err: any) {
            console.error(err);
            setError(`Ocorreu um erro: ${err.message || 'Tente novamente.'}`);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, mode, createFunction, editFunction, image1, image2]);

    const handleEditCurrentImage = () => {
        if (!generatedImage) return;
        // This is a simplified version. A real app might convert the base64 back to a File object.
        // For this example, we'll just switch to edit mode.
        setMode('edit');
        setEditFunction('retouch');
        setGeneratedImage(null); // Clear the result to start a new edit
        alert('Modo de edição ativado. Por favor, faça o upload da imagem novamente para editar.');
    };

    return (
        <div className="container mx-auto p-4 min-h-screen font-sans flex flex-col lg:flex-row gap-4">
            <LeftPanel
                prompt={prompt}
                setPrompt={setPrompt}
                mode={mode}
                setMode={setMode}
                createFunction={createFunction}
                setCreateFunction={setCreateFunction}
                editFunction={editFunction}
                setEditFunction={setEditFunction}
                image1={image1}
                setImage1={setImage1}
                image2={image2}
                setImage2={setImage2}
                onGenerate={handleGenerate}
                isLoading={isLoading}
            />
            <RightPanel
                generatedImage={generatedImage}
                isLoading={isLoading}
                error={error}
                onEditCurrentImage={handleEditCurrentImage}
            />
        </div>
    );
};

export default App;
