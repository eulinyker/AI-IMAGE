import React from 'react';

interface MobileModalProps {
    imageUrl: string;
    onClose: () => void;
    onDownload: () => void;
    onEdit: () => void;
    onNewImage: () => void;
}

const MobileModal: React.FC<MobileModalProps> = ({ imageUrl, onClose, onDownload, onEdit, onNewImage }) => {
    return (
        <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="modal-content w-full max-w-lg flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <img id="modalImage" src={imageUrl} alt="Generated AI" className="modal-image w-full rounded-lg" />
                    <button onClick={onClose} className="absolute top-2 right-2 bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg">&times;</button>
                </div>
                <div className="modal-actions grid grid-cols-3 gap-3">
                    <button onClick={onEdit} className="modal-btn edit bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                        <i className="fa-solid fa-pencil mb-1"></i>
                        <span className="text-sm">Editar</span>
                    </button>
                    <button onClick={onDownload} className="modal-btn download bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                        <i className="fa-solid fa-save mb-1"></i>
                        <span className="text-sm">Salvar</span>
                    </button>
                    <button onClick={onNewImage} className="modal-btn new bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg flex flex-col items-center justify-center transition-colors">
                        <i className="fa-solid fa-star mb-1"></i>
                        <span className="text-sm">Nova</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileModal;
