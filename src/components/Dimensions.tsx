import { useState } from "react";

function Dimensions({
	onDimensionsChange,
}: {
	onDimensionsChange: (width: number, height: number) => void;
}) {
	const [width, setWidth] = useState(1920);
	const [height, setHeight] = useState(1080);

	return (
		<div className="flex h-screen items-center justify-center">
			<form
				className="flex flex-col gap-4 bg-neutral-700 p-4 rounded-lg"
				onSubmit={(e) => {
					e.preventDefault();
					onDimensionsChange(width, height);
				}}
			>
				<h1 className="text-xl font-bold">Größe einstellen</h1>
				<hr />
				<section className="flex flex-row gap-4">
					<div className="flex flex-col">
						<label htmlFor="width">Breite</label>
						<input
							id="width"
							className="border text-sm rounded-lg block w-full p-2.5 bg-neutral-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
							name="width"
							type="number"
							min={1}
							defaultValue={width}
							onChange={(e) => setWidth(e.target.valueAsNumber)}
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="height">Höhe</label>
						<input
							id="height"
							className="border text-sm rounded-lg block w-full p-2.5 bg-neutral-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
							name="height"
							type="number"
							min={1}
							defaultValue={height}
							onChange={(e) => setHeight(e.target.valueAsNumber)}
						/>
					</div>
				</section>
				<div className="text-center">
					<button
						className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
						type="submit"
					>
						Erstellen
					</button>
				</div>
			</form>
		</div>
	);
}

export default Dimensions;
