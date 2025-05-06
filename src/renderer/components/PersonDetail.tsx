import { _Person } from "_/main/database/models/Person";
import { _Report } from "_/main/database/models/Report";
import SequelizeResponse from "_/types/SequelizeResponse";
import React, { useEffect, useState } from "react";
import { Card, Table, Row, Col, Button, Spinner, Badge, ListGroup, Modal, Form } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import EditPersonModal from "./EditPersonModal";

export default function PersonDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<_Person | null>(null);
  const [reports, setReports] = useState<SequelizeResponse<_Report>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the Add New Report modal
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [creatingReport, setCreatingReport] = useState<boolean>(false);
  const [newReportForm, setNewReportForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    hours: "",
    bibleStudies: "",
    participated: true,
    observations: ""
  });

  // State for the Edit Person modal
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<boolean>(false);
  const [editPersonForm, setEditPersonForm] = useState<any>({
    name: "",
    birth: "",
    baptism: "",
    privilege: "",
    service: "Publisher",
    anointed: false,
    male: true
  });

  // Load person and reports data
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("No person ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Load person details
        const personId = parseInt(id, 10);
        const personData = await window.ipcAPI?.persons.findById(personId);
        
        if (personData && personData.dataValues) {
          setPerson(personData.dataValues);
          
          // Load person's reports
          const reportData = await window.ipcAPI?.reports.findByPersonId(personId);
          setReports(reportData || []);
        } else {
          setError("Person not found");
        }
      } catch (err) {
        console.error("Failed to load person details:", err);
        setError("Failed to load person details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Format date for display
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Format dates for HTML date inputs (YYYY-MM-DD)
  const formatDateForInput = (dateString?: Date | string) => {
    if (!dateString) return "";
    if (dateString.toString().toLowerCase().includes("invalid")) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Get month name from number
  const getMonthName = (month: number): string => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Unknown";
  };

  // Handle open modal for new report
  const handleOpenReportModal = () => {
    setShowReportModal(true);
    // Initialize form with current month and year
    const currentDate = new Date();
    setNewReportForm({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      hours: "",
      bibleStudies: "",
      participated: true,
      observations: ""
    });
  };

  // Handle close report modal
  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  // Open modal to edit person
  const handleOpenEditModal = () => {
    if (!person) return;

    setEditPersonForm({
      id: person.id,
      name: person.name,
      birth: formatDateForInput(person.birth),
      baptism: formatDateForInput(person.baptism),
      privilege: person.privilege || "",
      service: person.service,
      anointed: Boolean(person.anointed),
      male: Boolean(person.male)
    });

    setShowEditModal(true);
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Handle form input changes for report
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewReportForm({
        ...newReportForm,
        [name]: checked
      });
    } else {
      setNewReportForm({
        ...newReportForm,
        [name]: value
      });
    }
  };

  // Handle form input changes for person edit
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditPersonForm({
        ...editPersonForm,
        [name]: checked
      });
    } else {
      setEditPersonForm({
        ...editPersonForm,
        [name]: value
      });
    }
  };

  // Handle form submission for report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!person || !person.id) return;
    
    try {
      setCreatingReport(true);
      
      const submitReportData = {
        ...newReportForm,
        userId: person.id,
        hours: newReportForm.hours === "" ? null : parseInt(newReportForm.hours as string, 10),
        bibleStudies: newReportForm.bibleStudies === "" ? null : parseInt(newReportForm.bibleStudies as string, 10)
      };
      
      await window.ipcAPI?.reports.create(submitReportData);
      
      // Reload reports data
      const reportData = await window.ipcAPI?.reports.findByPersonId(person.id);
      setReports(reportData || []);
      
      handleCloseReportModal();
    } catch (err) {
      console.error("Failed to create report:", err);
      setError("Failed to create report. Please try again.");
    } finally {
      setCreatingReport(false);
    }
  };

  // Handle form submission for person edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!person || !person.id) return;
    
    try {
      setEditingPerson(true);
      
      // Update person
      await window.ipcAPI?.persons.update(person.id, editPersonForm);
      
      // Reload person details
      const updatedPersonData = await window.ipcAPI?.persons.findById(person.id);
      if (updatedPersonData && updatedPersonData.dataValues) {
        setPerson(updatedPersonData.dataValues);
      }
      
      handleCloseEditModal();
    } catch (err) {
      console.error("Failed to update person:", err);
      setError("Failed to update person. Please try again.");
    } finally {
      setEditingPerson(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate('/persons')}>
            Back to Publishers List
          </Button>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="alert alert-info">
        Person not found
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate('/persons')}>
            Back to Publishers List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="person-detail-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Publisher Details</h2>
        <Button variant="primary" onClick={() => navigate('/persons')}>
          Back to Publishers List
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header as="h5">Personal Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {person.name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Birth:</strong> {formatDate(person.birth)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Baptism:</strong> {formatDate(person.baptism)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Gender:</strong> {person.male ? "Male" : "Female"}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Privilege:</strong> {person.privilege || "None"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Service:</strong> {person.service}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Anointed:</strong> {person.anointed ? "Yes" : "No"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-end mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={handleOpenEditModal}
                    >
                      Edit
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Service Reports</h3>
      {reports.length === 0 ? (
        <div className="alert alert-info">
          No reports found for this publisher.
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Period</th>
              <th>Hours</th>
              <th>Bible Studies</th>
              <th>Participated</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const r = report.dataValues;
              return (
                <tr key={r.id}>
                  <td>{getMonthName(r.month)} {r.year}</td>
                  <td>{r.hours !== undefined ? r.hours : '-'}</td>
                  <td>{r.bibleStudies !== undefined ? r.bibleStudies : '-'}</td>
                  <td>
                    {r.participated !== undefined 
                      ? (r.participated 
                          ? <Badge bg="success">Yes</Badge> 
                          : <Badge bg="danger">No</Badge>)
                      : '-'
                    }
                  </td>
                  <td>{r.observations || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <div className="d-flex justify-content-center mt-4 mb-5">
        <Button variant="success" className="me-2" onClick={handleOpenReportModal}>
          Add New Report
        </Button>
      </div>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={handleCloseReportModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitReport}>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    name="month"
                    value={newReportForm.month}
                    onChange={handleFormChange}
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
                    value={newReportForm.year}
                    onChange={handleFormChange}
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
                value={newReportForm.hours}
                onChange={handleFormChange}
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
                value={newReportForm.bibleStudies}
                onChange={handleFormChange}
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
                checked={newReportForm.participated}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observations</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observations"
                value={newReportForm.observations}
                onChange={handleFormChange}
                placeholder="Any additional notes..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReportModal}>
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

      {/* Edit Person Modal */}
      <EditPersonModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
        formData={editPersonForm}
        onFormChange={handleEditFormChange}
        isSubmitting={editingPerson}
      />
    </div>
  );
}