import useCompany from "../lib/customHooks";

function CompanyPage() {
  const { loading, error, company } = useCompany();

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
