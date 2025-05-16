import { _CreatePerson, _Person } from "_/main/database/models/Person";
import SequelizeResponse from "_/types/SequelizeResponse";
import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import EditPersonModal from "../components/EditPersonModal";
import PersonIndexComponent from "./PersonIndexComponent";

export default function Persons(): JSX.Element {
  const [persons, setPersons] = useState<SequelizeResponse<_Person>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [creatingPerson, setCreatingPerson] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);
  const [newPersonForm, setNewPersonForm] = useState<any>({
    name: "",
    birth: "",
    service: "Publisher",
    anointed: false,
    male: true,
  });
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Extract the loadPersons function so it can be reused
  const loadPersons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.ipcAPI?.persons.findAll();
      console.log("Loaded persons:", data);
      setPersons(data || []);
    } catch (err) {
      console.error("Failed to load persons:", { err });
      setError("Failed to load persons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle open/close modal
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditingPersonId(null);
    setNewPersonForm({
      name: "",
      birth: "",
      service: "Publisher",
      anointed: false,
      male: true,
    });
    setShowCreateModal(true);
  };

  // Open modal in edit mode with person data pre-filled
  const handleOpenEditModal = async (id: number) => {
    try {
      setCreatingPerson(true);
      const personData = await window.ipcAPI?.persons.findById(id);

      if (personData && personData.dataValues) {
        const person = personData.dataValues;
        // Format dates for HTML date inputs (YYYY-MM-DD)
        const formatDateForInput = (dateString?: Date | string) => {
          if (!dateString) return "";
          if (dateString.toString().toLowerCase().includes("invalid"))
            return null;
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setNewPersonForm({
          id: person.id,
          name: person.name,
          birth: formatDateForInput(person.birth),
          baptism: formatDateForInput(person.baptism),
          privilege: person.privilege || null,
          service: person.service,
          anointed: Boolean(person.anointed),
          male: Boolean(person.male),
        });

        setIsEditMode(true);
        setEditingPersonId(person.id || null);
        setShowEditModal(true);
      } else {
        setError("Could not load person data for editing");
      }
    } catch (err) {
      console.error("Failed to load person for editing:", err);
      setError("Failed to load person data. Please try again.");
    } finally {
      setCreatingPerson(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditingPersonId(null);
    // Reset form
    setNewPersonForm({
      name: "",
      birth: "",
      service: "Publisher",
      anointed: false,
      male: true,
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsEditMode(false);
    setEditingPersonId(null);
    setNewPersonForm({
      name: "",
      birth: "",
      service: "Publisher",
      anointed: false,
      male: true,
    });
  };

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewPersonForm({
        ...newPersonForm,
        [name]: checked,
      });
    } else {
      setNewPersonForm({
        ...newPersonForm,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingPerson(true);

      if (isEditMode && editingPersonId) {
        // Update existing person
        await window.ipcAPI?.persons.update(editingPersonId, newPersonForm);
        setError(null);
      } else {
        // Create new person
        await window.ipcAPI?.persons.create(newPersonForm);
      }

      handleCloseCreateModal();
      await loadPersons();
    } catch (err) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} person:`,
        err
      );
      setError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } person. Please try again.`
      );
    } finally {
      setCreatingPerson(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      if (isEditMode && editingPersonId) {
        await window.ipcAPI?.persons.update(editingPersonId, newPersonForm);
        setError(null);
      } else {
        await window.ipcAPI?.persons.create(newPersonForm);
      }

      handleCloseEditModal();
      await loadPersons();
    } catch (err) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} person:`,
        err
      );
      setError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } person. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
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
          <Button variant="primary" onClick={loadPersons} disabled={loading}>
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
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      <PersonIndexComponent
        persons={persons}
        onOpenEditModal={handleOpenEditModal}
      />

      <EditPersonModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        onSubmit={handleSubmitEdit}
        formData={newPersonForm}
        onFormChange={handleFormChange}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
