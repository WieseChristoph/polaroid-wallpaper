function KeyHints({ className }: { className?: string }) {
    return (
        <ul className={`${className} text-gray-400 list-disc`}>
            <li className="mb-2">
                <kbd className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-gray-600 text-gray-100 border-gray-500">
                    Entf
                </kbd>{' '}
                um das ausgewählte Polaroid zu Löschen
            </li>
            <li className="mb-2">
                Drücke{' '}
                <kbd className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-gray-600 text-gray-100 border-gray-500">
                    Alt
                </kbd>{' '}
                und linke Maustaste um das Bild zu verschieben
            </li>
            <li className="text-gray-400 mb-2">Scrollen zum zoomen</li>
            <li className="text-gray-400">Polaroid auswählen um es in den Vordergrund zu bringen</li>
        </ul>
    );
}

export default KeyHints;
