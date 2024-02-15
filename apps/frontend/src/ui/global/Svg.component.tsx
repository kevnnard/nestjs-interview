import { IconsCatalog } from '@ocmi/frontend/enums/IconsSVG.enum';

interface Icon {
  icon: keyof typeof IconsCatalog | string;
  fill?: string;
  isSolid?: boolean;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}

export const SvgComponentGlobal = ({
  icon = 'HELP',
  fill,
  isSolid = false,
  strokeWidth = 1.5,
  className,
  onClick,
}: Icon) => {
  const clases = !isSolid ? `${className} fill-transparent` : className;
  return (
    <svg
      data-testid="Icon"
      className={clases}
      stroke={isSolid ? undefined : 'currentColor'}
      color={fill}
      fill={isSolid ? 'currentColor' : undefined}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={strokeWidth}
      focusable="false"
      aria-hidden="true"
      onClick={onClick}
    >
      {IconsCatalog[icon as keyof typeof IconsCatalog] && (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={IconsCatalog[icon as keyof typeof IconsCatalog]}
        />
      )}
    </svg>
  );
};
