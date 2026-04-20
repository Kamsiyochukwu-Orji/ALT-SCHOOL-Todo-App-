import { Helmet } from "react-helmet-async";

type SeoProps = {
  title?: string;
  description?: string;
};
export const Seo = ({ title, description }: SeoProps) => (
  <Helmet>
    <title>{title ? `${title} | Altodo` : "Altodo"}</title>
    {description ? <meta name="description" content={description} /> : null}
  </Helmet>
);
