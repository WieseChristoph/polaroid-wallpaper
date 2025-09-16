import * as fabric from 'fabric';
import { useCallback, useEffect, useRef } from 'react';
import polaroidImage from '@/assets/polaroid.png';

const POLAROID_WIDTH = 440;
const POLAROID_HEIGHT = 537;

type CreatePolaroidOverlayProps = {
    isOpen: boolean;
    onCreateClick: (polaroidDataUrl: string) => void;
    onCancelClick: () => void;
};

function CreatePolaroidOverlay({ isOpen, onCreateClick, onCancelClick }: CreatePolaroidOverlayProps) {
    const polaroidCanvasRef = useRef<fabric.Canvas>(null);
    const currentImageRef = useRef<fabric.Object>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleAddImage = useCallback((file: File | null) => {
        if (!file) {
            return;
        }

        const url = URL.createObjectURL(file);

        fabric.FabricImage.fromURL(url).then((img) => {
            // Remove previous image
            if (currentImageRef.current) {
                polaroidCanvasRef.current?.remove(currentImageRef.current);
            }

            // Scale to polaroid size
            img.scaleToWidth(POLAROID_WIDTH);
            img.scaleToHeight(POLAROID_HEIGHT);

            // Customize control styling
            img.borderColor = 'red';
            img.cornerColor = 'red';
            img.borderOpacityWhenMoving = 1;

            polaroidCanvasRef.current?.add(img);
            polaroidCanvasRef.current?.sendObjectToBack(img);
            polaroidCanvasRef.current?.renderAll();
            currentImageRef.current = img;

            // Optional: revoke object URL after image is loaded
            URL.revokeObjectURL(url);
        });
    }, []);

    const handleCreateClick = useCallback(() => {
        if (!polaroidCanvasRef.current) {
            return '';
        }

        // reset polaroid image
        polaroidCanvasRef.current.overlayImage?.set('opacity', 1);
        // convert to data url
        const dataUrl = polaroidCanvasRef.current.toDataURL({
            format: 'png',
            multiplier: 1,
        });

        // reset image
        if (currentImageRef.current) {
            polaroidCanvasRef.current.remove(currentImageRef.current);
            currentImageRef.current = null;
        }

        // reset input field
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }

        return dataUrl;
    }, []);

    useEffect(() => {
        const newPCanvas = new fabric.Canvas('polaroid', {
            width: POLAROID_WIDTH,
            height: POLAROID_HEIGHT,
            controlsAboveOverlay: true,
        });

        fabric.FabricImage.fromURL(polaroidImage).then((img) => {
            img.evented = false;
            newPCanvas.overlayImage = img;
            newPCanvas.renderAll();
        });

        polaroidCanvasRef.current = newPCanvas;

        // destroy fabric on unmount
        return () => {
            polaroidCanvasRef.current?.dispose();
            polaroidCanvasRef.current = null;
        };
    }, []);

    return (
        <div className={`transition-all + ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            {/* blurred black background */}
            <div
                className="fixed inset-0 bg-black/60"
                aria-hidden="true"
            />
            {/* modal */}
            <div className="z-50 fixed inset-0 grid place-items-center overflow-y-auto p-4">
                <div className="rounded bg-neutral-800 p-4">
                    <h1 className="border-b border-white px-4 pb-2 text-3xl font-semibold">
                        Neues Polaroid hinzufügen
                    </h1>
                    <main className="p-10 flex flex-col items-center gap-4">
                        <canvas id="polaroid" />

                        <div className="flex flex-col gap-5 mt-5 w-full items-center">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="imageUpload"
                                    className="text-lg"
                                >
                                    Bild Auswählen:
                                </label>
                                <input
                                    id="imageUpload"
                                    className="block w-full text-sm rounded-lg border cursor-pointer focus:outline-none bg-neutral-800 border-gray-600 placeholder-gray-400"
                                    aria-describedby="file_input_help"
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => handleAddImage(e.target.files?.item(0) ?? null)}
                                />
                                <p
                                    className="mt-1 text-sm text-gray-300"
                                    id="file_input_help"
                                >
                                    PNG or JPG.
                                </p>
                            </div>
                            <div className="flex flex-row gap-5">
                                <button
                                    className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-2"
                                    onClick={() => onCreateClick(handleCreateClick())}
                                >
                                    Hinzufügen
                                </button>
                                <button
                                    className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 shadow-lg shadow-red-500/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-2"
                                    onClick={() => onCancelClick()}
                                >
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default CreatePolaroidOverlay;
