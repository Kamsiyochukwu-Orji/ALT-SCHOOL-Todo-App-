import { Helmet } from "react-helmet-async";

export const Seo = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} | Altodo` : "Altodo"}</title>
    {description ? <meta name="description" content={description} /> : null}
  </Helmet>
);
