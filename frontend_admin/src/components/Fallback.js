import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const Fallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container className="my-4">
      <h2>Yikes!</h2>
      <p>Here's what failed</p>

      <div className="mb-4 p-3 border rounded bg-light">
        <strong><code>{error.name || "Unknown Error"}</code></strong>
        <hr />
        <code>{error.message || "No Error Message"}</code>
      </div>

      <div className="d-grid gap-2">
        <Button variant="danger" onClick={resetErrorBoundary}>Reset</Button>
      </div>
    </Container>
  );
}

export default Fallback;
