import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import CreatePolaroid from "../components/CreatePolaroid";
import Settings from "../components/Settings";
import KeyHints from "../components/KeyHints";

function Editor({ width = 1920, height = 1080 }) {
	const [isPolaroidModalOpen, setisPolaroidModalOpen] = useState(false);

	const mainCanvasRef = useRef<fabric.Canvas>();
	const mainRectRef = useRef<fabric.Object>();

	function handleAddPolaroid(newPolaroid: string) {
		fabric.Image.fromURL(newPolaroid, (img) => {
			const mainRectCenter = mainRectRef.current?.getCenterPoint();
			// set image position
			img.left = mainRectCenter?.x ?? 200 - 200;
			img.top = mainRectCenter?.y ?? 200 - 200;
			// disable non uniform scaling controls
			img.setControlsVisibility({
				mt: false,
				mb: false,
				ml: false,
				mr: false,
			});
			// change control style
			img.borderColor = "red";
			img.cornerColor = "red";
			img.borderOpacityWhenMoving = 1;

			mainCanvasRef.current?.add(img);
		});
		setisPolaroidModalOpen(false);
	}

	function handleSelect(opt: fabric.IEvent) {
		// bring objects to front on select
		opt.selected?.forEach((obj) => obj.bringToFront());
		mainCanvasRef.current?.renderAll();
	}

	function handleDownloadClick() {
		if (!mainCanvasRef.current) return;

		// save viewport
		const prevViewport = mainCanvasRef.current.viewportTransform;
		// reset transforms and zooms just for the export
		mainCanvasRef.current.viewportTransform = [1, 0, 0, 1, 0, 0];

		// export as png
		let link = document.createElement("a");
		link.download = "polaroid-wallpaper.png";
		link.href = mainCanvasRef.current.toDataURL({
			format: "png",
			width: width,
			height: height,
			left: mainRectRef.current?.left,
			top: mainRectRef.current?.top,
		})!;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// restore viewport
		mainCanvasRef.current.viewportTransform = prevViewport;
	}

	useEffect(() => {
		const newMainCanvas = new fabric.Canvas("main", {
			width: window.innerWidth,
			height: window.innerHeight,
			renderOnAddRemove: true,
		});

		newMainCanvas.on("mouse:wheel", (opt) => {
			// handle zoom
			const delta = opt.e.deltaY;
			let zoom = newMainCanvas.getZoom();
			zoom *= 0.999 ** delta;
			if (zoom > 20) zoom = 20;
			if (zoom < 0.01) zoom = 0.01;
			newMainCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
			opt.e.preventDefault();
			opt.e.stopPropagation();
		});

		newMainCanvas.on("mouse:down", function (this: any, opt) {
			// handle canvas dragging
			var evt = opt.e;
			if (evt.altKey === true) {
				this.isDragging = true;
				this.selection = false;
				this.lastPosX = evt.clientX;
				this.lastPosY = evt.clientY;
			}
		});

		newMainCanvas.on("mouse:move", function (this: any, opt) {
			// handle canvas dragging
			if (this.isDragging) {
				var e = opt.e;
				var vpt = this.viewportTransform;
				vpt[4] += e.clientX - this.lastPosX;
				vpt[5] += e.clientY - this.lastPosY;
				this.requestRenderAll();
				this.lastPosX = e.clientX;
				this.lastPosY = e.clientY;
			}
		});

		newMainCanvas.on("mouse:up", function (this: any, opt) {
			// handle canvas dragging
			// on mouse up we want to recalculate new interaction
			// for all objects, so we call setViewportTransform
			this.setViewportTransform(this.viewportTransform);
			this.isDragging = false;
			this.selection = true;
		});

		newMainCanvas.on("selection:created", handleSelect);
		newMainCanvas.on("selection:updated", handleSelect);

		document.addEventListener("keydown", (event) => {
			// delete active object on delete press
			if (!event.isComposing && event.code === "Delete") {
				newMainCanvas.remove(newMainCanvas.getActiveObject());
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
	}, []);

	useEffect(() => {
		// delete previous rect
		mainCanvasRef.current?.remove(mainCanvasRef.current.getObjects().at(-1)!);

		const rect = new fabric.Rect({
			width: width,
			height: height,
			backgroundColor: "black",
			selectable: false,
			hasControls: false,
			hoverCursor: "auto",
		});

		mainCanvasRef.current?.add(rect);
		rect.center();
		mainCanvasRef.current?.sendToBack(rect);

		// zoom out if rect would be too big for window
		if (width >= window.innerWidth || height >= window.innerHeight)
			mainCanvasRef.current?.zoomToPoint(rect.getCenterPoint(), 0.7);

		mainRectRef.current = rect;
	}, [width, height]);

	return (
		<div className="h-screen">
			<div className="grow overflow-hidden">
				<canvas id="main" />
			</div>

			<Settings
				className="fixed right-0 bottom-0 p-4 z-10"
				onAddPolaroidClick={() => setisPolaroidModalOpen(true)}
				onBackgroundColorChange={(newColor) =>
					mainRectRef.current?.set("fill", newColor) && mainCanvasRef.current?.renderAll()
				}
				onDownloadClick={() => handleDownloadClick()}
			/>

			<KeyHints className="absolute left-10 bottom-5 text-gray-400 list-disc" />

			<CreatePolaroid
				isOpen={isPolaroidModalOpen}
				onCancelClick={() => setisPolaroidModalOpen(false)}
				onCreateClick={(newPolaroid) => handleAddPolaroid(newPolaroid)}
			/>
		</div>
	);
}

export default Editor;
