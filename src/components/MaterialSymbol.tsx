import type { SpanProps } from "types";
import { $cl } from "utils";

export interface MaterialSymbolProps extends SpanProps {
    icon: string;
    variant?: 'sharp';
}

function MaterialSymbol ({
    icon,
    variant = 'sharp',
    className,
    ...spanProps
}: MaterialSymbolProps) {

    return (
        <i
            {...spanProps}
            className={$cl("icon", "material-symbols-sharp", className)}
        >
            {icon}
        </i>
    );
}

export default MaterialSymbol;
