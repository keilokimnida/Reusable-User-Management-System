import { Container, Button } from 'react-bootstrap';

const Fallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container className="my-4">
      <h2>Yikes!</h2>
      <p>Here's what failed</p>

      <p className="p-2 border rounded bg-light">
        <strong><code>{error.name ?? "Unknown Error"}</code></strong>
        <br />
        <code>{error.message ?? "No Error Message"}</code>
      </p>

      <div className="d-grid gap-2">
        <Button variant="danger" onClick={resetErrorBoundary}>Reset</Button>
      </div>
    </Container>
  );
}

export default Fallback;
