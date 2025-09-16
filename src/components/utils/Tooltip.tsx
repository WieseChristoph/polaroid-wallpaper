import {
    arrow,
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { type PropsWithChildren, useRef, useState } from 'react';
import { cn } from '@/utils/tailwind-cn';

type TooltipProps = PropsWithChildren<{
    text: string;
    placement?: 'top' | 'right' | 'bottom' | 'left';
}>;

function Tooltip({ children, text, placement = 'top' }: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles, context, middlewareData } = useFloating({
        placement: placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, {
        role: 'tooltip',
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    const actualPlacement = context.placement?.split('-')[0] ?? 'top';

    return (
        <>
            {isOpen && (
                <div
                    className="bg-neutral-600 px-2 py-1 rounded text-sm relative"
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                >
                    {text}
                    <div
                        ref={arrowRef}
                        style={{
                            left: middlewareData.arrow?.x,
                            top: middlewareData.arrow?.y,
                        }}
                        className={cn(
                            'absolute w-0 h-0',
                            actualPlacement === 'top' &&
                                'border-x-4 border-x-transparent border-t-4 border-t-neutral-600 -bottom-1',
                            actualPlacement === 'bottom' &&
                                'border-x-4 border-x-transparent border-b-4 border-b-neutral-600 -top-1',
                            actualPlacement === 'left' &&
                                'border-y-4 border-y-transparent border-l-4 border-l-neutral-600 -right-1',
                            actualPlacement === 'right' &&
                                'border-y-4 border-y-transparent border-r-4 border-r-neutral-600 -left-1',
                        )}
                    />
                </div>
            )}
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                {children}
            </div>
        </>
    );
}

export default Tooltip;
