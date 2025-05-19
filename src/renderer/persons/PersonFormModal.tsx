import React from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

interface EditPersonModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({
  show,
  onHide,
  onSubmit,
  formData,
  onFormChange,
  isSubmitting,
}) => {
  const buttonText = () => {
    const inActionText = formData.id ? "Editing..." : "Creating...";
    const stillText = formData.id ? "Edit" : "Create";

    if (isSubmitting) {
      return (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-1"
          />
          {inActionText}
        </>
      );
    }

    return stillText;
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Publisher</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={onFormChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Birth Date</Form.Label>
            <Form.Control
              type="date"
              name="birth"
              value={formData.birth}
              onChange={onFormChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Baptism Date</Form.Label>
            <Form.Control
              type="date"
              name="baptism"
              value={formData.baptism || ""}
              onChange={onFormChange}
            />
            <Form.Text className="text-muted">
              Optional. Leave blank if not baptized.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Privilege</Form.Label>
            <Form.Select
              name="privilege"
              value={formData.privilege || ""}
              onChange={onFormChange}
            >
              <option value="">None</option>
              <option value="Elder">Elder</option>
              <option value="Ministerial Servant">Ministerial Servant</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Service</Form.Label>
            <Form.Select
              name="service"
              value={formData.service}
              onChange={onFormChange}
              required
            >
              <option value="Publisher">Publisher</option>
              <option value="Regular Pioneer">Regular Pioneer</option>
              <option value="Special Pioneer">Special Pioneer</option>
              <option value="Missionary">Missionary</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Male"
              name="male"
              checked={formData.male}
              onChange={onFormChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Anointed"
              name="anointed"
              checked={formData.anointed}
              onChange={onFormChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {buttonText()}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPersonModal;