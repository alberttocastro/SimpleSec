import React from "react";
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";

interface ReportModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  creatingReport: boolean;
  getMonthName: (month: number) => string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  show,
  onHide,
  onSubmit,
  formData,
  onFormChange,
  creatingReport,
  getMonthName,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Report</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select
                  name="month"
                  value={formData.month}
                  onChange={onFormChange}
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={onFormChange}
                  required
                  min={2000}
                  max={2100}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Hours</Form.Label>
            <Form.Control
              type="number"
              name="hours"
              value={formData.hours}
              onChange={onFormChange}
              min={0}
            />
            <Form.Text className="text-muted">
              Optional. Leave blank if not applicable.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bible Studies</Form.Label>
            <Form.Control
              type="number"
              name="bibleStudies"
              value={formData.bibleStudies}
              onChange={onFormChange}
              min={0}
            />
            <Form.Text className="text-muted">
              Optional. Leave blank if not applicable.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Participated in Ministry This Month"
              name="participated"
              checked={formData.participated}
              onChange={onFormChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observations</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observations"
              value={formData.observations}
              onChange={onFormChange}
              placeholder="Any additional notes..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={creatingReport}
          >
            {creatingReport ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Creating...
              </>
            ) : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReportModal;