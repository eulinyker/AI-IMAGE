import React, { useState } from 'react';
import MobileModal from './MobileModal';

interface RightPanelProps {
    generatedImage: string | null;
    isLoading: boolean;
    error: string | null;
    onEditCurrentImage: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ generatedImage, isLoading, error, onEditCurrentImage }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const downloadImage = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `ai-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImageClick = () => {
        if (window.innerWidth < 1024) { // lg breakpoint in Tailwind
            setIsModalOpen(true);
        }
    };

    const newImageFromModal = () => {
        setIsModalOpen(false);
        // A full implementation would likely call a function passed from App.tsx
        // to reset the state. For now, we just reload for simplicity.
        window.location.reload();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div id="loadingContainer" className="loading-container flex flex-col items-center justify-center h-full text-center">
                    <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                    <div className="loading-text text-xl text-gray-300">Gerando sua imagem...</div>
                    <p className="text-gray-400 mt-2">Isso pode levar alguns instantes.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
                    <div className="text-5xl mb-4">😢</div>
                    <h3 className="text-xl font-semibold">Ocorreu um erro</h3>
                    <p className="mt-2 text-gray-400">{error}</p>
                </div>
            );
        }

        if (generatedImage) {
            return (
                <div id="imageContainer" className="image-container w-full h-full relative group">
                    <img
                        id="generatedImage"
                        src={generatedImage}
                        alt="Imagem gerada por IA"
                        className="generated-image w-full h-full object-contain rounded-lg cursor-pointer lg:cursor-default"
                        onClick={handleImageClick}
                    />
                    <div className="image-actions absolute top-4 right-4 hidden lg:flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={onEditCurrentImage} title="Editar" className="action-btn bg-gray-900/70 text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <i className="fa-solid fa-pencil text-xl"></i>
                        </button>
                        <button onClick={downloadImage} title="Download" className="action-btn bg-gray-900/70 text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-green-600 transition-colors">
                             <i className="fa-solid fa-save text-xl"></i>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div id="resultPlaceholder" className="result-placeholder flex flex-col items-center justify-center h-full text-center text-gray-500">
                <div className="result-placeholder-icon text-7xl mb-4">🎨</div>
                <div className="text-2xl font-medium">Sua obra de arte aparecerá aqui</div>
                <p className="mt-2 text-gray-400">Descreva sua ideia no painel à esquerda para começar.</p>
            </div>
        );
    };

    return (
        <>
            <div className="right-panel lg:w-2/3 bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[50vh] lg:min-h-0">
                {renderContent()}
            </div>
            {isModalOpen && generatedImage && (
                <MobileModal
                    imageUrl={generatedImage}
                    onClose={() => setIsModalOpen(false)}
                    onDownload={downloadImage}
                    onEdit={onEditCurrentImage}
                    onNewImage={newImageFromModal}
                />
            )}
        </>
    );
};

export default RightPanel;
