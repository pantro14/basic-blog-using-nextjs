import Link from "next/link";
import { FC } from "react";
import Logo from "../Logo";
import { APP_NAME } from "../AppHead";
import { HiLightBulb } from "react-icons/hi";
import { GitHubAuthButton } from "../../button";
import ProfileHead from "../ProfileHead";
import DropdownOptions, { dropDownOptions } from "../DropdownOptions";

interface Props {}

const UserNav: FC<Props> = (props): JSX.Element => {
  const dropDownOptions: dropDownOptions = [
    { label: "dashboard", onClick() {} },
    { label: "logout", onClick() {} },
  ];
  return (
    <div className="flex items-center justify-between bg-primary-dark p-3">
      {/* Logo */}
      <Link href="/" className="flex space-x-2 text-highlight-dark">
        <Logo className="fill-highlight-dark" />
        <span className="text-xl font-semibold">{APP_NAME}</span>
      </Link>

      <div className="flex items-center space-x-5">
        <button className="dark:text-secondary-dark text-secondary-light">
          <HiLightBulb size={34} />
        </button>
        <GitHubAuthButton lightOnly></GitHubAuthButton>
        <DropdownOptions
          options={dropDownOptions}
          head={<ProfileHead nameInitial="D" lightOnly />}
        />
      </div>
    </div>
  );
};

export default UserNav;
