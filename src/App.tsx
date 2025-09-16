import { useState } from 'react';
import Dimensions, { type DimensionsType } from '@/components/Dimensions';
import Editor from '@/components/Editor';

function App() {
    const [showDimensions, setShowDimensions] = useState(true);
    const [dimensions, setDimensions] = useState<DimensionsType>({
        width: 1920,
        height: 1080,
    });

    if (showDimensions) {
        return (
            <Dimensions
                dimensions={dimensions}
                setDimensions={setDimensions}
                onCreateClick={() => setShowDimensions(false)}
            />
        );
    }

    return <Editor dimensions={dimensions} />;
}

export default App;
