import React from 'react';
import type { Mode, CreateFunction, EditFunction } from '../types';
import FunctionCard from './FunctionCard';
import ImageUploader from './ImageUploader';

interface LeftPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    createFunction: CreateFunction;
    setCreateFunction: (func: CreateFunction) => void;
    editFunction: EditFunction;
    setEditFunction: (func: EditFunction) => void;
    image1: File | null;
    setImage1: (file: File | null) => void;
    image2: File | null;
    setImage2: (file: File | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    prompt,
    setPrompt,
    mode,
    setMode,
    createFunction,
    setCreateFunction,
    editFunction,
    setEditFunction,
    image1,
    setImage1,
    image2,
    setImage2,
    onGenerate,
    isLoading,
}) => {

    const showTwoImagesSection = mode === 'edit' && editFunction === 'compose';
    const showSingleImageSection = mode === 'edit' && editFunction !== 'compose';

    const handleModeChange = (newMode: Mode) => {
      setMode(newMode);
      setImage1(null);
      setImage2(null);
    }
    
    return (
        <div className="left-panel lg:w-1/3 bg-gray-800 rounded-lg p-6 flex flex-col gap-6 h-full">
            <header>
                <h1 className="panel-title text-3xl font-bold text-white">🎨 AI Image Studio</h1>
                <p className="panel-subtitle text-gray-400">Gerador profissional de imagens</p>
            </header>

            <div className="prompt-section">
                <div className="section-title text-lg font-semibold mb-2 text-gray-200">💭 Descreva sua ideia</div>
                <textarea
                    id="prompt"
                    className="prompt-input w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 h-28 resize-none"
                    placeholder="Descreva a imagem que você deseja criar..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>

            <div className="mode-toggle flex bg-gray-700 rounded-full p-1">
                <button
                    className={`mode-btn w-1/2 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${mode === 'create' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    data-mode="create"
                    onClick={() => handleModeChange('create')}
                >
                    Criar
                </button>
                <button
                    className={`mode-btn w-1/2 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${mode === 'edit' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    data-mode="edit"
                    onClick={() => handleModeChange('edit')}
                >
                    Editar
                </button>
            </div>

            {mode === 'create' && (
                <div id="createFunctions" className="functions-section">
                    <div className="functions-grid grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <FunctionCard icon="✨" name="Prompt" isActive={createFunction === 'free'} onClick={() => setCreateFunction('free')} />
                        <FunctionCard icon="🏷️" name="Adesivos" isActive={createFunction === 'sticker'} onClick={() => setCreateFunction('sticker')} />
                        <FunctionCard icon="📝" name="Logo" isActive={createFunction === 'text'} onClick={() => setCreateFunction('text')} />
                        <FunctionCard icon="💭" name="HQ" isActive={createFunction === 'comic'} onClick={() => setCreateFunction('comic')} />
                        <FunctionCard icon="📺" name="Thumbnail" isActive={createFunction === 'thumbnail'} onClick={() => setCreateFunction('thumbnail')} />
                        <FunctionCard icon="🧊" name="Objeto 3D" isActive={createFunction === 'object3d'} onClick={() => setCreateFunction('object3d')} />
                    </div>
                </div>
            )}
            
            {mode === 'edit' && (
                <div id="editFunctions" className="functions-section">
                    <div className="functions-grid grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <FunctionCard icon="➕" name="Adicionar" isActive={editFunction === 'add-remove'} onClick={() => setEditFunction('add-remove')} />
                        <FunctionCard icon="🎯" name="Retoque" isActive={editFunction === 'retouch'} onClick={() => setEditFunction('retouch')} />
                        <FunctionCard icon="🎨" name="Estilo" isActive={editFunction === 'style'} onClick={() => setEditFunction('style')} />
                        <FunctionCard icon="🖼️" name="Unir" isActive={editFunction === 'compose'} onClick={() => setEditFunction('compose')} />
                    </div>
                </div>
            )}
            
            <div className="dynamic-content flex-grow flex flex-col gap-4">
                {showTwoImagesSection && (
                    <div id="twoImagesSection" className="functions-section flex flex-col gap-4">
                       <h3 className="section-title text-lg font-semibold text-gray-200">📸 Duas Imagens Necessárias</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                           <ImageUploader id="imageUpload1" imageFile={image1} setImageFile={setImage1} text="Primeira Imagem" />
                           <ImageUploader id="imageUpload2" imageFile={image2} setImageFile={setImage2} text="Segunda Imagem" />
                        </div>
                    </div>
                )}
                {showSingleImageSection && (
                     <ImageUploader id="imageUpload" imageFile={image1} setImageFile={setImage1} text="Clique ou arraste uma imagem" subtext="PNG, JPG, WebP (máx. 10MB)" />
                )}
            </div>

            <button
                id="generateBtn"
                className="generate-btn w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onGenerate}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="spinner animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <span className="btn-text text-lg">🚀 Gerar Imagem</span>
                )}
            </button>
        </div>
    );
};

export default LeftPanel;