import { lightBlue } from "../styles/colors";
import { hsl } from "../styles/utils";
import { FlexRow, flexRowStyles } from "./Flexbox";

export const NavigationElement = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) => (
  <li
    css={{
      "&:not(:last-of-type)": {
        marginRight: "1.7em",
      },

      "& > a": {
        color: hsl(lightBlue),
        textDecorationLine: "none",

        "&:hover, &:active": {
          textDecorationLine: "underline",
        },
      },
    }}
    {...otherProps}
  >
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
  <ul
    css={[
      flexRowStyles,
      {
        listStyleType: "none",
        margin: 0,
        marginBottom: "1em",
        marginTop: "1em",
        overflow: "hidden",
        padding: 0,
      },
    ]}
    {...otherProps}
  >
    {children}
  </ul>
);

export const Navigation = () => (
  <nav>
    <FlexRow css={{ justifyContent: "space-between" }}>
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
