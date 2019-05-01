import { css } from "@emotion/react";
import { Link } from "gatsby";
import * as React from "react";
import { Grid, Row } from "../components/Grid";
import Layout from "../components/Layout";
import { Menu, MenuItem, SubMenu } from "../components/Menu";
import SEO from "../components/SEO";

const Navbar: React.FunctionComponent = () => (
  <nav>
    <Menu>
      <SubMenu>
        <MenuItem>
          <Link to="/">Home</Link>
        </MenuItem>
      </SubMenu>

      <SubMenu position="right">
        <MenuItem>
          <a
            href="http://www.linkedin.com/in/ndhoule"
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </MenuItem>
        <MenuItem>
          <a href="https://github.com/ndhoule" rel="noreferrer" target="_blank">
            GitHub
          </a>
        </MenuItem>
        <MenuItem>
          <a href="mailto:nathan@nathanhoule.com">Email</a>
        </MenuItem>
      </SubMenu>
    </Menu>
  </nav>
);

const TitleArea: React.FunctionComponent = ({ children }) => (
  <h2
    css={css`
      padding-bottom: 2em;
      padding-top: 2em;
      text-align: center;
    `}
  >
    {children}
  </h2>
);

const MainPage: React.FunctionComponent = () => (
  <Layout>
    <SEO description="I'm Nathan Houle, a San Francisco Bay Area-based software engineer." />
    <div
      css={(theme) => css`
        border-top: 4px solid ${theme.colors.primary};
      `}
    >
      <div
        css={css`
          margin: auto;
          max-width: 700px;
        `}
      >
        <Navbar />

        <section>
          <Grid columns={4} alignment="center">
            <Row>
              <TitleArea>I{"'"}m Nathan Houle.</TitleArea>
            </Row>
            <Row>
              <p
                css={css`
                  text-align: center;
                `}
              >
                I{"'"}m a San Francisco Bay Area-based software engineer.
              </p>
            </Row>
          </Grid>
        </section>
      </div>
    </div>
  </Layout>
);

export default MainPage;
