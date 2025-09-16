import { BiDownload, BiImageAdd } from 'react-icons/bi';
import Tooltip from '@/components/utils/Tooltip';

type SettingsProps = {
    className?: string;
    onAddPolaroidClick: () => void;
    backgroundColor: string;
    setBackgroundColor: (newColor: string) => void;
    backgroundImage: File | null;
    setBackgroundImage: (newBackgroundImage: File | null) => void;
    onDownloadClick: () => void;
};

function Settings({
    className,
    onAddPolaroidClick,
    backgroundColor,
    setBackgroundColor,
    setBackgroundImage,
    onDownloadClick,
}: SettingsProps) {
    return (
        <div className={`${className} bg-neutral-800 rounded-lg shadow-lg flex flex-col gap-2 p-4`}>
            <div className="flex flex-row gap-5 items-center justify-center w-full">
                <Tooltip text="Add new polaroid">
                    <button
                        className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-neutral-700"
                        onClick={() => onAddPolaroidClick()}
                    >
                        <BiImageAdd className="text-5xl" />
                    </button>
                </Tooltip>

                <Tooltip text="Set background color">
                    <div className="flex items-center h-16 p-2 rounded-lg hover:bg-neutral-700">
                        <input
                            className="h-full hover:cursor-pointer"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </div>
                </Tooltip>

                <Tooltip text="Download image">
                    <button
                        className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-neutral-700"
                        onClick={() => onDownloadClick()}
                    >
                        <BiDownload className="text-5xl" />
                    </button>
                </Tooltip>
            </div>

            <hr />

            <div className="flex flex-col gap-2">
                <span>Hintergrundbild</span>

                <div className="flex items-center w-full gap-2">
                    <input
                        className="text-sm cursor-pointer w-52 bg-neutral-600 px-2 py-1 rounded"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => setBackgroundImage(e.target.files?.item(0) ?? null)}
                    />

                    <button
                        className="p-1 text-sm rounded-md bg-red-700/80 cursor-pointer"
                        onClick={() => setBackgroundImage(null)}
                    >
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
