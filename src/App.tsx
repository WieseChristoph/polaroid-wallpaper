import { useState } from "react";
import Dimensions from "./components/Dimensions";
import Editor from "./components/Editor";

function App() {
	const [width, setWidth] = useState<number>();
	const [height, setHeight] = useState<number>();

	if (width && height) return <Editor width={width} height={height} />;
	else
		return (
			<Dimensions
				onDimensionsChange={(width, height) => {
					setWidth(width);
					setHeight(height);
				}}
			/>
		);
}

export default App;
