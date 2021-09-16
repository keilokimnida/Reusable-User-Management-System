import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// i heard about the semantic use of html and whatnot
// i found this tag <pre> that is used for pre-formatted text
// wont collapse whitespaces and line breaks
// https://www.w3schools.com/tags/tag_pre.asp

const Fallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container className="my-4">
      <h2>Yikes!</h2>
      <p>Here's what failed</p>

      <div className="mb-4 p-3 border rounded bg-light">
        <strong>
          <pre className="m-0">{error.name || "Unknown Error"}</pre>
        </strong>
        <hr />
        <pre className="m-0">{error.message || "No Error Message"}</pre>
      </div>

      <div className="d-grid gap-2">
        <Button variant="danger" onClick={resetErrorBoundary}>Reset</Button>
      </div>
    </Container>
  );
}

export default Fallback;
