import Image from "next/image";

/**
 * @name LogoInterface
 * @description Interface for LogoComponentGlobal.
 * @property {string!} src - The image source.
 * @property {string!} alt - The image alt text.
 * @property {number!} width - The image width.
 * @property {number!} height - The image height.
 * @property {string?} [classNames] - The image class names.
 */
interface LogoInterface {
	src: string;
	alt: string;
	classNames?: string;
}

/**
 * @name LogoComponentGlobal
 * @description Component that renders a logo image.
 */
export function LogoComponentGlobal(data: LogoInterface) {
	return (
		<Image
			className={`${data.classNames}`}
			src={data.src}
			alt={data.alt}
			width="0"
			height="0"
			priority
		/>
	);
}
