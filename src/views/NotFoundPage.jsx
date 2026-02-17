import { Link } from "react-router-dom";
import { Seo } from "../shared/Seo";

export default function NotFoundPage() {
  return (
    <section className="state-card" role="alert">
      <Seo title="404 Not Found" description="The page you requested was not found." />
      <h1>404 - Page not found</h1>
      <p>The route you entered does not exist.</p>
      <Link className="button button--primary" to="/todos">
        Go to todos
      </Link>
    </section>
  );
}
