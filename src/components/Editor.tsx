import * as fabric from 'fabric';
import { useCallback, useEffect, useRef, useState } from 'react';
import CreatePolaroidOverlay from '@/components/CreatePolaroidOverlay';
import type { DimensionsType } from '@/components/Dimensions';
import Settings from '@/components/Settings';
import KeyHints from '@/components/utils/KeyHints';

type EditorProps = {
    dimensions: DimensionsType;
};

function Editor({ dimensions }: EditorProps) {
    const [mainObject, setMainObject] = useState<fabric.Object>();
    const [isPolaroidModalOpen, setisPolaroidModalOpen] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const mainCanvasRef = useRef<fabric.Canvas | undefined>(undefined);

    const handleAddPolaroid = useCallback(
        (newPolaroid: string) => {
            fabric.FabricImage.fromURL(newPolaroid).then((img) => {
                const mainRectCenter = mainObject?.getCenterPoint();

                img.set({
                    left: mainRectCenter?.x ?? 200 - 200,
                    top: mainRectCenter?.y ?? 200 - 200,
                    borderColor: 'red',
                    cornerColor: 'red',
                    borderOpacityWhenMoving: 1,
                    shadow: {
                        color: 'rgba(0,0,0,0.6)',
                        blur: 20,
                        offsetX: 20,
                        offsetY: 20,
                        affectStroke: true,
                    },
                });

                // disable non uniform scaling controls
                img.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                });

                mainCanvasRef.current?.add(img);
            });
            setisPolaroidModalOpen(false);
        },
        [mainObject?.getCenterPoint],
    );

    const handleSelect = useCallback(
        (event: fabric.TPointerEvent & { selected: fabric.FabricObject[]; deselected: fabric.FabricObject[] }) => {
            event.selected.forEach((obj: fabric.FabricObject) => {
                mainCanvasRef.current?.bringObjectToFront(obj);
            });
            mainCanvasRef.current?.renderAll();
        },
        [],
    );

    const handleDownloadClick = useCallback(() => {
        if (!mainCanvasRef.current) {
            return;
        }

        // save viewport
        const prevViewport = mainCanvasRef.current.viewportTransform;
        // reset transforms and zooms just for the export
        mainCanvasRef.current.viewportTransform = [1, 0, 0, 1, 0, 0];

        // export as png
        const link = document.createElement('a');
        link.download = 'polaroid-wallpaper.png';
        link.href = mainCanvasRef.current.toDataURL({
            multiplier: 1,
            format: 'png',
            ...dimensions,
            left: mainObject?.left,
            top: mainObject?.top,
        });
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // restore viewport
        mainCanvasRef.current.viewportTransform = prevViewport;
    }, [mainObject, dimensions]);

    useEffect(() => {
        const newMainCanvas = new fabric.Canvas('main', {
            width: window.innerWidth,
            height: window.innerHeight,
            renderOnAddRemove: true,
        });

        newMainCanvas.on('mouse:wheel', (opt) => {
            // handle zoom
            const delta = opt.e.deltaY;
            let zoom = newMainCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) {
                zoom = 20;
            }
            if (zoom < 0.01) {
                zoom = 0.01;
            }
            newMainCanvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        newMainCanvas.on('mouse:down', (options) => {
            // handle canvas dragging
            const event = options.e as MouseEvent;
            if (!event.altKey) {
                return;
            }

            setIsDragging(true);
            newMainCanvas.selection = false;
            lastPos.current = { x: event.clientX, y: event.clientY };
        });

        newMainCanvas.on('mouse:move', (options) => {
            // handle canvas dragging
            if (!isDragging) {
                return;
            }

            const e = options.e as MouseEvent;
            const vpt = newMainCanvas.viewportTransform;
            vpt[4] += e.clientX - lastPos.current.x;
            vpt[5] += e.clientY - lastPos.current.y;
            newMainCanvas.requestRenderAll();
            lastPos.current = { x: e.clientX, y: e.clientY };
        });

        newMainCanvas.on('mouse:up', () => {
            // handle canvas dragging
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            newMainCanvas.setViewportTransform(newMainCanvas.viewportTransform);
            setIsDragging(false);
            newMainCanvas.selection = true;
        });

        newMainCanvas.on('selection:created', handleSelect);
        newMainCanvas.on('selection:updated', handleSelect);

        document.addEventListener('keydown', (event) => {
            // delete active object on delete press
            if (!event.isComposing && event.code === 'Delete') {
                const activeObject = newMainCanvas.getActiveObject();
                if (activeObject && activeObject !== mainObject) {
                    newMainCanvas.remove(activeObject);
                }
            }
        });

        window.onresize = () => {
            // handle canvas resize
            newMainCanvas.setWidth(window.innerWidth);
            newMainCanvas.setHeight(window.innerHeight);
        };

        mainCanvasRef.current = newMainCanvas;

        // destroy fabric on unmount
        return () => {
            mainCanvasRef.current?.dispose();
            mainCanvasRef.current = undefined;
        };
    }, [handleSelect, mainObject, isDragging]);

    useEffect(() => {
        if (!backgroundImage) {
            const rect = new fabric.Rect({
                ...dimensions,
                backgroundColor: 'black',
                selectable: false,
                hasControls: false,
                hoverCursor: 'auto',
            });

            setMainObject(rect);

            return;
        }

        const url = URL.createObjectURL(backgroundImage);

        fabric.FabricImage.fromURL(url).then((img) => {
            // scale to correct size
            img.scaleX = dimensions.width / (img.width ?? 1);
            img.scaleY = dimensions.height / (img.height ?? 1);

            img.set({
                selectable: false,
                hasControls: false,
                hoverCursor: 'auto',
            });

            setMainObject(img);

            URL.revokeObjectURL(url);
        });
    }, [dimensions, backgroundImage]);

    useEffect(() => {
        if (!mainCanvasRef.current || !mainObject) {
            return;
        }

        mainCanvasRef.current.add(mainObject);
        mainCanvasRef.current.centerObject(mainObject);
        mainCanvasRef.current.sendObjectToBack(mainObject);

        // cleanup
        return () => {
            if (mainObject) {
                mainCanvasRef.current?.remove(mainObject);
            }
        };
    }, [mainObject]);

    return (
        <div className="h-screen">
            <div className="grow overflow-hidden">
                <canvas id="main" />
            </div>

            <Settings
                className="fixed right-5 bottom-5 z-10"
                onAddPolaroidClick={() => setisPolaroidModalOpen(true)}
                backgroundColor={backgroundColor}
                setBackgroundColor={(newColor) => {
                    setBackgroundColor(newColor);
                    mainObject?.set('fill', newColor);
                    mainCanvasRef.current?.renderAll();
                }}
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
                onDownloadClick={() => handleDownloadClick()}
            />

            <KeyHints className="absolute left-10 bottom-5" />

            <CreatePolaroidOverlay
                isOpen={isPolaroidModalOpen}
                onCancelClick={() => setisPolaroidModalOpen(false)}
                onCreateClick={(newPolaroid) => handleAddPolaroid(newPolaroid)}
            />
        </div>
    );
}

export default Editor;
