import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "components/components/common/Logo";
import { IconType } from "react-icons";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";

interface Props {
  navItems: { label: string; icon: IconType; href: string }[];
}

const NAV_OPEN_WIDTH = "w-60";
const NAV_CLOSED_WIDTH = "w-12";
const NAV_VISIBILITY = "nav-visibility";

const AdminNav: FC<Props> = ({ navItems }): JSX.Element => {
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const toggleNav = (visibility: boolean) => {
    const { current } = navRef;
    if (!current) return;
    const { classList } = current;
    if (visibility) {
      // hide nav
      classList.remove(NAV_OPEN_WIDTH);
      classList.add(NAV_CLOSED_WIDTH);
    } else {
      // show nav
      classList.add(NAV_OPEN_WIDTH);
      classList.remove(NAV_CLOSED_WIDTH);
    }
  };
  const updateNavState = () => {
    toggleNav(visible);
    const newVisible = !visible;
    setVisible(newVisible);
    localStorage.setItem(NAV_VISIBILITY, JSON.stringify(newVisible));
  };

  useEffect(() => {
    const navState = localStorage.getItem(NAV_VISIBILITY);
    if (navState !== null) {
      const newState = JSON.parse(navState);
      setVisible(newState);
      toggleNav(!newState);
    } else {
      setVisible(true);
    }
  }, []);

  return (
    <nav
      ref={navRef}
      className="h-screen w-60 shadow-sm bg-secondary-light dark:bg-secondary-dark
             flex flex-col justify-between transition-width overflow-hidden sticky top-0"
    >
      <div>
        {/* logo */}
        <Link href="/admin" legacyBehavior={true}>
          <a className="flex items-center space-x-2 p-3 mb-10">
            <Logo className="fill-highlight-light dark:fill-highlight-dark w-5 h-5" />
            {visible && (
              <span className="text-highlight-light dark:text-highlight-dark w-5 h-5 text-xl font-semibold leading-none">
                Admin
              </span>
            )}
          </a>
        </Link>
        {/* nav items */}
        <div className="space-y-6">
          {navItems.map((item) => {
            return (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a className="flex items-center text-highlight-light dark:text-highlight-dark text-xl p-3 hover:scale-[0.98] transition">
                  <item.icon size={24}></item.icon>
                  {visible && (
                    <span className="ml-2 leading-none">{item.label}</span>
                  )}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      {/* nav toggle (button) */}
      <button
        className="text-highlight-light dark:text-highlight-dark p-3 hover:scale-[0.98] transition self-end"
        onClick={updateNavState}
      >
        {visible ? (
          <RiMenuFoldFill size={25} />
        ) : (
          <RiMenuUnfoldFill size={25} />
        )}
      </button>
    </nav>
  );
};

export default AdminNav;
