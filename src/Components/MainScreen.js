import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import ElectionCard from "./ElectionCard";
import web3 from "../web3.js";

const factoryAddress = "0x5B1287fbad7B49c368c0E252cEc6fd2e839c9eE6";
const compiledFactory = require("../ethereum/build/ElectionFactory.json");
const compiledElection = require("../ethereum/build/Election.json");

const Elections = () => {
  const [electionsData, setElectionsData] = useState([]);
  useEffect(async () => {
    const contract = new web3.eth.Contract(
      JSON.parse(JSON.stringify(compiledFactory.abi)),
      factoryAddress
    );

    const elections = await contract.methods.getElections().call();
    setElectionsData(elections);
  }, []);

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
        {electionsData &&
          electionsData.map((d) => (
            <ElectionCard data={d} key={d.name} />
          ))}
      </Container>
    </Container>
  );
};

export default Elections;
