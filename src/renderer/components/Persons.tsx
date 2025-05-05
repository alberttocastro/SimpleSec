import { _Person } from "_/main/database/models/Person";
import SequelizeResponse from "_/types/SequelizeResponse";
import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
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

  useEffect(() => {
    async function loadPersons() {
      try {
        setLoading(true);
        const data = await window.ipcAPI?.persons.findAll();
        console.log("Loaded persons:", data);
        setPersons(data || []);
      } catch (err) {
        console.error("Failed to load persons:", err);
        setError("Failed to load persons. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadPersons();
  }, []);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
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
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="persons-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Publishers</h2>
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
    </div>
  );
}
