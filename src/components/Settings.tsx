import { useRef } from "react";
import { BiDownload, BiImageAdd } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface Props {
	className?: string;
	onAddPolaroidClick: () => void;
	onBackgroundColorChange: (newColor: string) => void;
	onBackgroundImageChange: (newBackgroundImage: File | null) => void;
	onDownloadClick: () => void;
}

function Settings({
	className = "",
	onAddPolaroidClick,
	onBackgroundColorChange,
	onBackgroundImageChange,
	onDownloadClick,
}: Props) {
	const backgroundImageInputRef = useRef<HTMLInputElement>(null);

	return (
		<section className={className}>
			<div className="p-2 bg-neutral-800 rounded-lg shadow-lg flex flex-col items-center justify-center">
				<div className="flex flex-row gap-5 items-center">
					<Tippy content="Add new polaroid">
						<button
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-neutral-700"
							onClick={onAddPolaroidClick}
						>
							<BiImageAdd className="text-5xl" />
						</button>
					</Tippy>
					<Tippy content="Set background color">
						<div className="flex items-center h-16 p-2 rounded-lg hover:bg-neutral-700">
							<input
								className="h-full hover:cursor-pointer"
								type="color"
								onChange={(e) => onBackgroundColorChange(e.target.value)}
							/>
						</div>
					</Tippy>
					<Tippy content="Download image">
						<button
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-neutral-700"
							onClick={onDownloadClick}
						>
							<BiDownload className="text-5xl" />
						</button>
					</Tippy>
				</div>

				<label htmlFor="backgroundImage">Background image:</label>
				<div className="flex items-center w-full p-2 text-base font-normal rounded-lg hover:bg-neutral-700">
					<Tippy content="Set background image">
						<input
							id="backgroundImage"
							ref={backgroundImageInputRef}
							className="text-sm cursor-pointer w-52"
							type="file"
							accept="image/png, image/jpeg"
							onChange={(e) => onBackgroundImageChange(e.target.files?.item(0)!)}
						/>
					</Tippy>
					<Tippy content="Clear background image">
						<button
							className="p-1 text-sm rounded-md bg-red-700/80"
							onClick={() => {
								onBackgroundImageChange(null);
								backgroundImageInputRef.current
									? (backgroundImageInputRef.current.value = "")
									: null;
							}}
						>
							Clear
						</button>
					</Tippy>
				</div>
			</div>
		</section>
	);
}

export default Settings;
