import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import ElectionCard from "./ElectionCard";

const Elections = () => {
  const data = [
    {
      name: "Bihar State Election",
      address: "axvt56jsgbe7j",
      manager: "Mr. Satnam",
      parties: ["BJP", "AAP", "Congress", "Communist Party"],
    },
    {
      name: "Delhi State Election",
      address: "hfdb45jfdgk7y",
      manager: "Mr. Manoj",
      parties: ["AAP", "BJP", "Congress", "Cycle Party"],
    },
    {
      name: "Lok Sabha Election",
      address: "tfgb75ufdgk5y",
      manager: "Mr.Yogi",
      parties: ["AAP", "BJP", "Congress", "Mamta Party", "Faltu Party"],
    },
    {
      name: "Kasol City Election",
      address: "6fgd78ufdgk7y",
      manager: "Its Your Boy Jack",
      parties: [
        "Breezer Party",
        "Cocain Party",
        "Nasha Party",
        "Andhi Party",
        "Ganjha Party",
      ],
    },
  ];
  return (
    <Container>
      <Row>
        <Col></Col>
        <Col md="6">
          <h1 className="text-center">Ongoing Elections</h1>
        </Col>
        <Col md="3">
          <Button variant="danger">Create Election</Button>
        </Col>
      </Row>
      <Container>
        {data.map((d) => (
          <ElectionCard data={d} />
        ))}
      </Container>
    </Container>
  );
};

export default Elections;
