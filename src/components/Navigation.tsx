import cn from "classnames";
import { FlexRow } from "./Flexbox";
import * as styles from "./Navigation.css";

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
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <ul className={styles.navigationSection} {...otherProps}>
    {children}
  </ul>
);

export const Navigation = () => (
  <nav>
    <FlexRow className={styles.navigation}>
      <NavigationSection>
        {/*
        <NavigationElement>
          <Link href="/">Home</Link>
        </NavigationElement>
        */}
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
