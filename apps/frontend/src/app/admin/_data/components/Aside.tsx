'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ocmi/frontend/ui/components/tooltip';
import { LogoComponentGlobal } from '@ocmi/frontend/ui/global/Logo.component';
import { SvgComponentGlobal } from '@ocmi/frontend/ui/global/Svg.component';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import aside from '../json/aside.json';

interface AsideInterface {
  title: string;
  link: string;
  icon: string;
}

export const AsideAdminComponent = () => {
  const path = usePathname().split('/')[3];
  const cn = classNames;

  return (
    <aside className="fixed bg-ligth dark:bg-dark w-14 min-h-screen px-2 border-r border-r-gray-400 border-opacity-50 backdrop-blur-lg z-30">
      <Link href={`/admin/dashboard`}>
        <LogoComponentGlobal
          alt="Challenge Trackr"
          src="/01.png"
          classNames="w-22 h-10 mx-auto my-5 "
        />
      </Link>
      <TooltipProvider>
        {aside.map((item, index: number) => (
          <ul
            key={index}
            className="border-b border-b-gray-400 border-opacity-50"
          >
            {item.map((asideItem: AsideInterface, index: number) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Link href={`/admin/dashboard/${asideItem.link}`}>
                    <SvgComponentGlobal
                      className={`w-9 h-9 mx-auto my-1 p-2 rounded-md hover:bg-zinc-700 hover:bg-opacity-25 text-[#383838] dark:text-[#979797] ${cn(
                        asideItem.link === path &&
                          'bg-gray-300 bg-opacity-70 dark:bg-zinc-500 dark:bg-opacity-25',
                      )}`}
                      strokeWidth={1.5}
                      icon={asideItem.icon}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{asideItem.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ul>
        ))}

        {/* THE COMPONENT BELOW WORKING WITH THE TOOLTIP PROVIDER */}
        {/* <PopoverComponent /> */}
      </TooltipProvider>
    </aside>
  );
};
