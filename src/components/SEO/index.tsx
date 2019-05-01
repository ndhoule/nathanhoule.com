import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { Helmet } from "react-helmet";
import { SeoQuery } from "../../generated/graphql";

interface SEOProps {
  description?: string;
  language?: string;
  title?: string;
}

const SEO: React.FunctionComponent<SEOProps> = ({
  description = "",
  title,
  language = "en",
}) => {
  const data = useStaticQuery<SeoQuery>(graphql`
    query SEO {
      site {
        siteMetadata {
          defaultTitle
          titleTemplate
        }
      }
    }
  `);

  return (
    <Helmet
      htmlAttributes={{ lang: language }}
      meta={[
        {
          charSet: "utf-8",
        },
        {
          name: "description",
          content: description,
        },
      ]}
      defaultTitle={data.site?.siteMetadata?.defaultTitle ?? undefined}
      title={title}
      titleTemplate={data.site?.siteMetadata?.titleTemplate ?? undefined}
    ></Helmet>
  );
};

export default SEO;
