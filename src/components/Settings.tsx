import { BiDownload, BiImageAdd } from "react-icons/bi";

interface Props {
	className?: string;
	onAddPolaroidClick: () => void;
	onBackgroundColorChange: (newColor: string) => void;
	onDownloadClick: () => void;
}

function Settings({
	className = "",
	onAddPolaroidClick,
	onBackgroundColorChange,
	onDownloadClick,
}: Props) {
	return (
		<section className={className}>
			<div className="p-4 bg-neutral-800 rounded-lg shadow-lg">
				<ul className="grid grid-cols-3 gap-5 items-center">
					<li>
						<button
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-neutral-700"
							onClick={onAddPolaroidClick}
						>
							<BiImageAdd className="text-5xl" />
						</button>
					</li>
					<li className="h-full">
						<div className="flex items-center h-full p-2 text-base font-normal rounded-lg hover:bg-neutral-700">
							<input
								className="h-full hover:cursor-pointer"
								type="color"
								onChange={(e) => onBackgroundColorChange(e.target.value)}
							/>
						</div>
					</li>
					<li>
						<button
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-neutral-700"
							onClick={onDownloadClick}
						>
							<BiDownload className="text-5xl" />
						</button>
					</li>
				</ul>
			</div>
		</section>
	);
}

export default Settings;
