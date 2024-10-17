import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/graphql/queries";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    if (companyId) {
      (async () => {
        const loading = false;
        try {
          const company = await getCompany(companyId);
          setState({ company, loading, error: false });
        } catch (error) {
          console.error(error); //JSON.stringify(error, null, 2));
          setState({ company: null, loading, error });
        }
      })();
    }
  }, [companyId]);
  const { company, loading, error } = state;
  if (loading) {
    return <div>loading ....</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
    </div>
  );
}

export default CompanyPage;
