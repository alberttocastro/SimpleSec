import { _Person } from "_/main/database/models/Person";
import { _Report } from "_/main/database/models/Report";
import SequelizeResponse from "_/types/SequelizeResponse";
import React, { useEffect, useState } from "react";
import { Card, Table, Row, Col, Button, Spinner, Badge, ListGroup, Modal, Form } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import EditPersonModal from "./EditPersonModal";
import ReportModal from "./ReportModal";

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
  const [newReportForm, setNewReportForm] = useState<{
    id: number | null;
    month: number;
    year: number;
    hours: number;
    bibleStudies: number;
    participated: boolean;
    observations: string;
  }>({
    id: null,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    hours: 0,
    bibleStudies: 0,
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
      id: null, // Clear the ID for new reports
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      hours: 0,
      bibleStudies: 0,
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

  // Update the handleSubmitReport function to check if the report is being edited
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!person || !person.id) return;

    try {
      setCreatingReport(true);

      const submitReportData = {
        ...newReportForm,
        userId: person.id,
        hours: parseInt(newReportForm.hours.toString(), 10) || 0,
        bibleStudies: parseInt(newReportForm.bibleStudies.toString(), 10) || 0,
      };

      if (newReportForm.id) {
        // Update existing report
        await window.ipcAPI?.reports.update(newReportForm.id, submitReportData);
      } else {
        // Create new report
        await window.ipcAPI?.reports.create(submitReportData);
      }

      // Reload reports data
      const reportData = await window.ipcAPI?.reports.findByPersonId(person.id);
      setReports(reportData || []);

      handleCloseReportModal();
    } catch (err) {
      console.error("Failed to save report:", err);
      setError("Failed to save report. Please try again.");
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

  // Add a function to handle editing a report
  const handleEditReport = (report: _Report) => {
    setShowReportModal(true);
    setNewReportForm({
      id: report.id || null, // Ensure the ID is set for editing
      month: report.month,
      year: report.year,
      hours: report.hours || 0,
      bibleStudies: report.bibleStudies || 0,
      participated: report.participated || false,
      observations: report.observations || "",
    });
  };

  // Add a function to handle deleting a report
  const handleDeleteReport = async (reportId: number) => {
    if (!person || !person.id) return;

    try {
      // Delete the report
      await window.ipcAPI?.reports.delete(reportId);

      // Reload reports data
      const reportData = await window.ipcAPI?.reports.findByPersonId(person.id);
      setReports(reportData || []);
    } catch (err) {
      console.error("Failed to delete report:", err);
      setError("Failed to delete report. Please try again.");
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
              <th>Actions</th>
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
                  <td>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditReport(r)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteReport(r.id)}
                    >
                      Delete
                    </Button>
                  </td>
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

      <ReportModal
        show={showReportModal}
        onHide={handleCloseReportModal}
        onSubmit={handleSubmitReport}
        formData={newReportForm}
        onFormChange={handleFormChange}
        creatingReport={creatingReport}
        getMonthName={getMonthName}
      />

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