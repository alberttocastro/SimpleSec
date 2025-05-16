import React from "react";
import SequelizeResponse from "_/types/SequelizeResponse";
import { _Report } from "_/main/database/models/Report";
import {
  Card,
  Table,
  Row,
  Col,
  Button,
  Spinner,
  Badge,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";

interface Props {
  reports: SequelizeResponse<_Report>[];
  handleEditReport: (report: _Report) => void;
  handleDeleteReport: (id: number) => void;
}

export default function ServiceReportIndex({ reports, handleDeleteReport, handleEditReport }: Props): JSX.Element {
  const getMonthName = (month: number): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "Unknown";
  };

  return (
    <>
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
                  <td>
                    {getMonthName(r.month)} {r.year}
                  </td>
                  <td>{r.hours !== undefined ? r.hours : "-"}</td>
                  <td>{r.bibleStudies !== undefined ? r.bibleStudies : "-"}</td>
                  <td>
                    {r.participated !== undefined ? (
                      r.participated ? (
                        <Badge bg="success">Yes</Badge>
                      ) : (
                        <Badge bg="danger">No</Badge>
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{r.observations || "-"}</td>
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
    </>
  );
}
