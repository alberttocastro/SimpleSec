import { _Person } from "_/main/database/models/Person";
import SequelizeResponse from "_/types/SequelizeResponse";
import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

// Person interface representing the data structure
interface Person {
  id?: number;
  name: string;
  birth: string;
  baptism?: string;
  privilege?: "Elder" | "Ministerial Servant" | null;
  service: "Publisher" | "Regular Pioneer" | "Special Pioneer" | "Missionary";
  anointed: boolean;
  male: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Persons(): JSX.Element {
  const [persons, setPersons] = useState<SequelizeResponse<_Person>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [creatingPerson, setCreatingPerson] = useState<boolean>(false);
  const [newPersonForm, setNewPersonForm] = useState<Person>({
    name: "",
    birth: "",
    service: "Publisher",
    anointed: false,
    male: true
  });

  // Extract the loadPersons function so it can be reused
  const loadPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.ipcAPI?.persons.findAll();
      console.log("Loaded persons:", data);
      setPersons(data || []);
    } catch (err) {
      console.error("Failed to load persons:", err);
      setError("Failed to load persons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle open/close modal
  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    // Reset form
    setNewPersonForm({
      name: "",
      birth: "",
      service: "Publisher",
      anointed: false,
      male: true
    });
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewPersonForm({
        ...newPersonForm,
        [name]: checked
      });
    } else {
      setNewPersonForm({
        ...newPersonForm,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingPerson(true);
      await window.ipcAPI?.persons.create(newPersonForm);
      handleCloseCreateModal();
      await loadPersons();
    } catch (err) {
      console.error("Failed to create person:", err);
      setError("Failed to create person. Please try again.");
    } finally {
      setCreatingPerson(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && persons.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="persons-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Publishers</h2>
        <div>
          <Button 
            variant="success" 
            onClick={handleOpenCreateModal} 
            className="me-2"
          >
            Create New
          </Button>
          <Button 
            variant="primary" 
            onClick={loadPersons} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </div>
      </div>

      {persons.length === 0 ? (
        <div className="alert alert-info">
          No publishers found. Add one to get started.
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth</th>
              <th>Baptism</th>
              <th>Privilege</th>
              <th>Service</th>
              <th>Anointed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons
              .map((person) => person.dataValues)
              .map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.birth.toString()}</td>
                  <td>{person.baptism?.toString()}</td>
                  <td>{person.privilege || "-"}</td>
                  <td>{person.service}</td>
                  <td>{person.anointed ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      to={`/persons/${person.id}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/persons/${person.id}/edit`}
                      className="btn btn-sm btn-secondary me-2"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {/* Create Person Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Publisher</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newPersonForm.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="date"
                name="birth"
                value={newPersonForm.birth}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Baptism Date</Form.Label>
              <Form.Control
                type="date"
                name="baptism"
                value={newPersonForm.baptism || ""}
                onChange={handleFormChange}
              />
              <Form.Text className="text-muted">
                Optional. Leave blank if not baptized.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Privilege</Form.Label>
              <Form.Select
                name="privilege"
                value={newPersonForm.privilege || ""}
                onChange={handleFormChange}
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
                value={newPersonForm.service}
                onChange={handleFormChange}
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
                checked={newPersonForm.male}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Anointed"
                name="anointed"
                checked={newPersonForm.anointed}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={creatingPerson}
            >
              {creatingPerson ? (
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
              ) : (
                'Create'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
