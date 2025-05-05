import { _Person } from "_/main/database/models/Person";
import { _Report } from "_/main/database/models/Report";
import SequelizeResponse from "_/types/SequelizeResponse";
import React, { useEffect, useState } from "react";
import { Card, Table, Row, Col, Button, Spinner, Badge, ListGroup } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function PersonDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<_Person | null>(null);
  const [reports, setReports] = useState<SequelizeResponse<_Report>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Get month name from number
  const getMonthName = (month: number): string => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Unknown";
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
                      onClick={() => navigate(`/persons/${person.id}/edit`)}
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
        <Button variant="success" className="me-2">
          Add New Report
        </Button>
      </div>
    </div>
  );
}