"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlexRow } from "./Flexbox";
import * as styles from "./Navigation.css";

export const NavigationLink = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
  href: string | URL;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => (
  <Link className={className} {...otherProps}>
    {children}
  </Link>
);

export const NavigationElement = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <li className={cn(styles.navigationElement, className)} {...otherProps}>
    {children}
  </li>
);

export const NavigationSection = ({
  children,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <ul className={cn(styles.navigationSection, className)} {...otherProps}>
    {children}
  </ul>
);

const navLinkOnClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
  const ariaCurrent =
    event.currentTarget.attributes.getNamedItem("aria-current");

  if (ariaCurrent?.value === "page") {
    event.preventDefault();
  }
};

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav>
      <FlexRow className={styles.navigation}>
        <NavigationSection>
          <NavigationElement>
            <NavigationLink
              aria-current={pathname === "/" ? "page" : ""}
              onClick={navLinkOnClick}
              href="/"
            >
              Home
            </NavigationLink>
          </NavigationElement>

          <NavigationElement>
            <NavigationLink
              aria-current={pathname === "/hiking" ? "page" : ""}
              href="/hiking"
            >
              Hiking
            </NavigationLink>
          </NavigationElement>
        </NavigationSection>

        <NavigationSection>
          <NavigationElement>
            <a
              href="https://www.linkedin.com/in/ndhoule"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </NavigationElement>
          <NavigationElement>
            <a
              href="https://github.com/ndhoule"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </NavigationElement>
          <NavigationElement>
            <a
              href="mailto:nathan@nathanhoule.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Email
            </a>
          </NavigationElement>
        </NavigationSection>
      </FlexRow>
    </nav>
  );
};
