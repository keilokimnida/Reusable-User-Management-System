import { Container, Button } from 'react-bootstrap';

const Fallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container className="my-4">
      <h2>Oops!</h2>
      <p>Here's what failed</p>
      <p className="p-2 border rounded bg-light">
        <code className="">{error.message}</code>
      </p>
      <div className="d-grid gap-2">
        <Button onClick={resetErrorBoundary}>Reset</Button>
      </div>
    </Container>
  );
}

export default Fallback;
