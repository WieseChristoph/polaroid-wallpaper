export type DimensionsType = {
    width: number;
    height: number;
};

type DimensionsProps = {
    dimensions: DimensionsType;
    setDimensions: (dimensions: DimensionsType) => void;
    onCreateClick: () => void;
};

function Dimensions({ dimensions, setDimensions, onCreateClick }: DimensionsProps) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col gap-2 bg-neutral-700 p-4 rounded-lg">
                <h1 className="text-xl font-bold">Größe einstellen</h1>

                <hr />

                <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="width">Breite</label>
                        <input
                            id="width"
                            className="border text-sm rounded-lg block w-full p-2 bg-neutral-800 border-gray-600 placeholder-gray-400 text-white"
                            name="width"
                            type="number"
                            min={1}
                            value={dimensions.width}
                            onChange={(e) => setDimensions({ ...dimensions, width: e.target.valueAsNumber })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="height">Höhe</label>
                        <input
                            id="height"
                            className="border text-sm rounded-lg block w-full p-2 bg-neutral-800 border-gray-600 placeholder-gray-400 text-white"
                            name="height"
                            type="number"
                            min={1}
                            value={dimensions.height}
                            onChange={(e) => setDimensions({ ...dimensions, height: e.target.valueAsNumber })}
                        />
                    </div>
                </div>

                <button
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg font-bold px-5 py-2.5 text-center cursor-pointer"
                    onClick={() => onCreateClick()}
                >
                    Erstellen
                </button>
            </div>
        </div>
    );
}

export default Dimensions;
