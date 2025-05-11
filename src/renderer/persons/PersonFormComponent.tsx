import React from "react";
import { Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import SequelizeResponse from "_/types/SequelizeResponse";
import { _CreatePerson, _Person } from "_/main/database/models/Person";
import { Link } from "react-router-dom";

interface Props {
  persons: SequelizeResponse<_Person>[];
  onOpenEditModal: (id: number) => void;
}

export default function Persons({ persons, onOpenEditModal }: Props): JSX.Element {

  return (
    <>
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
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => onOpenEditModal(person.id)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  );
}